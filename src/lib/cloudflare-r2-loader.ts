/**
 * Cloudflare R2 + Image Resizing transformation for astro-loader-hashnode
 *
 * Uploads Hashnode CDN images to R2 and serves via Image Resizing for modern formats
 * Mappings stored in R2 bucket as _image-mappings.json (no git commits needed)
 */

import { createHash } from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import type { ImageTransformFn } from 'astro-loader-hashnode';

interface ImageMapping {
  hashnodeUrl: string;
  r2Key: string;
  r2Url: string;
  uploadedAt: string;
  type: string;
  postId: string;
}

interface R2UploadConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain?: string; // Optional custom domain, defaults to r2.dev
}

class CloudflareR2Cache {
  private cache: Map<string, string>;
  private config: R2UploadConfig;
  private newMappings: ImageMapping[] = [];
  private s3Client: S3Client | null = null;
  private mappingKey = '_image-mappings.json';
  private initialized = false;

  constructor() {
    this.cache = new Map();

    this.config = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      bucketName: process.env.R2_IMAGES || 'blog-images',
      publicDomain: process.env.R2_IMAGES_PUBLIC_DOMAIN || 'i.mrugesh.dev'
    };

    // Initialize S3 client for R2
    if (this.config.accountId && this.config.accessKeyId && this.config.secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey
        }
      });
    }
  }

  /**
   * Load existing mappings from R2 bucket
   */
  private async loadMappingsFromR2(): Promise<void> {
    if (this.initialized || !this.s3Client) {
      if (this.initialized) {
        console.log(`Cache already initialized with ${this.cache.size} mappings`);
      }
      return;
    }

    try {
      console.log(`Loading image mappings from R2: ${this.config.bucketName}/${this.mappingKey}`);

      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: this.mappingKey
      });

      const response = await this.s3Client.send(command);

      if (response.Body) {
        const body = await response.Body.transformToString();
        const mappings: ImageMapping[] = JSON.parse(body);

        mappings.forEach((m) => {
          this.cache.set(m.hashnodeUrl, m.r2Url);
        });

        console.log(`✓ Loaded ${mappings.length} image mappings from R2`);
      }
    } catch (error: unknown) {
      // 404 is expected on first run
      const err = error as { name?: string };
      if (err.name === 'NoSuchKey') {
        console.log('No existing mappings found in R2 (first run)');
      } else {
        console.warn('Could not load mappings from R2:', error);
      }
    }

    this.initialized = true;
  }

  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.loadMappingsFromR2();
    }
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }

  get(url: string): string | undefined {
    return this.cache.get(url);
  }

  /**
   * Generate R2 key from URL
   */
  private generateKey(url: string, postId: string): string {
    const hash = createHash('md5').update(url).digest('hex');
    const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
    return `blog/${postId}/${hash}.${ext}`;
  }

  /**
   * Upload image to R2 via S3-compatible API
   * Returns R2 URL on success, original URL on failure
   */
  async upload(url: string, postId: string, type: 'cover' | 'inline'): Promise<string> {
    // Ensure mappings are loaded from R2
    await this.ensureInitialized();

    if (!this.s3Client) {
      console.warn('R2 credentials missing, using original URL');
      return url;
    }

    try {
      // Download image
      const imageResponse = await fetch(url);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.statusText}`);
      }

      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

      // Generate R2 key
      const key = this.generateKey(url, postId);

      // Upload to R2 using AWS SDK
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: imageBuffer,
        ContentType: contentType
      });

      await this.s3Client.send(command);

      // Generate public URL
      const baseUrl = this.config.publicDomain
        ? `https://${this.config.publicDomain}`
        : `https://pub-${this.config.accountId}.r2.dev`;

      const r2Url = `${baseUrl}/${key}`;

      // Add to cache and new mappings
      this.cache.set(url, r2Url);
      this.newMappings.push({
        hashnodeUrl: url,
        r2Key: key,
        r2Url,
        uploadedAt: new Date().toISOString(),
        type,
        postId
      });

      console.log(`✓ Uploaded to R2: ${key}`);

      // Save mapping immediately (don't wait for process exit)
      await this.saveToR2();

      // Rate limit: wait 100ms
      await new Promise((resolve) => setTimeout(resolve, 100));

      return r2Url;
    } catch (error) {
      console.error(`Error uploading ${url}:`, error);
      // Return original URL - don't cache failed uploads
      return url;
    }
  }

  /**
   * Save current mappings to R2
   */
  async saveToR2(): Promise<void> {
    if (this.newMappings.length === 0 || !this.s3Client) return;

    try {
      // Get all current mappings (cache + new)
      const allMappings: ImageMapping[] = [];

      // Add existing cached mappings
      this.cache.forEach((r2Url, hashnodeUrl) => {
        // Find full mapping data if it exists
        const existing = this.newMappings.find((m) => m.hashnodeUrl === hashnodeUrl);
        if (!existing) {
          // Reconstruct from cache (for existing mappings loaded from R2)
          const key = r2Url.split('/').slice(-3).join('/'); // Extract key from URL
          allMappings.push({
            hashnodeUrl,
            r2Key: key,
            r2Url,
            uploadedAt: new Date().toISOString(),
            type: 'unknown',
            postId: 'unknown'
          });
        }
      });

      // Add new mappings
      allMappings.push(...this.newMappings);

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: this.mappingKey,
        Body: JSON.stringify(allMappings, null, 2),
        ContentType: 'application/json'
      });

      await this.s3Client.send(command);

      console.log(`✓ Saved ${allMappings.length} total image mappings to R2 (${this.newMappings.length} new)`);
      this.newMappings = [];
    } catch (error) {
      console.error('Failed to save mappings to R2:', error);
    }
  }
}

// Singleton instance
let cacheInstance: CloudflareR2Cache | null = null;

function getCache(): CloudflareR2Cache {
  if (!cacheInstance) {
    cacheInstance = new CloudflareR2Cache();
    // Note: Mappings are now saved immediately after each upload
    // No need for beforeExit hook
  }
  return cacheInstance;
}

// For testing: reset singleton
export function resetCache(): void {
  cacheInstance = null;
}

/**
 * Generate Cloudflare Image Resizing URL
 *
 * Cloudflare Image Resizing transforms images on-the-fly:
 * - Automatic format negotiation (WebP/AVIF based on browser)
 * - Responsive sizing
 * - Quality optimization
 *
 * Only applies Image Resizing when running on Cloudflare infrastructure.
 * In local dev, returns direct R2 URL.
 *
 * @param baseUrl - Base R2 URL
 * @param options - Image resizing options
 */
function getImageResizingUrl(
  baseUrl: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'json';
  } = {}
): string {
  const { width = 1200, quality = 85, format = 'auto' } = options;

  // Check if running on Cloudflare infrastructure
  // CF_PAGES is set to "1" in Cloudflare Pages builds
  // In local dev with astro dev, this won't be set
  const isCloudflare = process.env.CF_PAGES === '1' || process.env.USE_IMAGE_RESIZING === 'true';

  if (!isCloudflare) {
    // Local dev: return direct R2 URL (no Image Resizing)
    console.log('Local dev mode: using direct R2 URL');
    return baseUrl;
  }

  // Cloudflare: return relative URL with Image Resizing
  return `/cdn-cgi/image/width=${width},quality=${quality},format=${format}/${baseUrl}`;
}

/**
 * Transform Hashnode CDN images to R2 + Image Resizing
 *
 * Uploads images to R2 and returns optimized URLs with:
 * - Automatic WebP/AVIF format based on browser support
 * - Responsive sizing (1200px for covers, 800px for inline)
 * - Quality optimization (85%)
 *
 * Usage in content.config.ts:
 *
 * ```ts
 * import { cloudflareR2Transform } from './lib/cloudflare-r2-loader';
 *
 * export const collections = {
 *   blog: defineCollection({
 *     loader: hashnodeLoader({
 *       publicationHost: 'blog.hashnode.dev',
 *       transformImage: cloudflareR2Transform
 *     })
 *   })
 * };
 * ```
 *
 * Required environment variables:
 * - CLOUDFLARE_ACCOUNT_ID: Cloudflare Account ID
 * - R2_ACCESS_KEY_ID: R2 Access Key ID
 * - R2_SECRET_ACCESS_KEY: R2 Secret Access Key
 * - R2_IMAGES: R2 bucket name (default: blog-images)
 * - R2_IMAGES_PUBLIC_DOMAIN: (Optional) Custom domain for R2 bucket (default: i.mrugesh.dev)
 */
export const cloudflareR2Transform: ImageTransformFn = async (url, context) => {
  // Only transform Hashnode CDN images
  if (!url.includes('cdn.hashnode.com')) {
    return url;
  }

  const cache = getCache();

  // Ensure mappings are loaded from R2
  await cache.ensureInitialized();

  // Check cache first
  if (cache.has(url)) {
    const cachedUrl = cache.get(url);
    if (cachedUrl) {
      console.log(`Using cached R2 URL for ${context.type} image in "${context.postTitle}"`);

      // Apply image resizing for optimization
      return getImageResizingUrl(cachedUrl, {
        width: context.type === 'cover' ? 1200 : 800,
        quality: 85,
        format: 'auto' // Auto WebP/AVIF
      });
    }
  }

  // Upload to R2
  console.log(`Uploading ${context.type} image for "${context.postTitle}"`);
  const r2Url = await cache.upload(url, context.postId, context.type);

  // If upload failed (returns original URL), return as-is
  if (r2Url === url) {
    return url;
  }

  // Apply image resizing for optimization
  return getImageResizingUrl(r2Url, {
    width: context.type === 'cover' ? 1200 : 800,
    quality: 85,
    format: 'auto'
  });
};

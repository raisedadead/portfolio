/**
 * Tests for Cloudflare R2 image loader with caching
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { S3Client } from '@aws-sdk/client-s3';

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => {
  const mockSend = vi.fn();
  const MockS3Client = vi.fn(() => ({
    send: mockSend
  }));

  return {
    S3Client: MockS3Client,
    GetObjectCommand: vi.fn((params) => params),
    PutObjectCommand: vi.fn((params) => params)
  };
});

// Mock fetch
global.fetch = vi.fn();

describe('Cloudflare R2 Image Loader', () => {
  const mockEnv = {
    CLOUDFLARE_ACCOUNT_ID: 'test-account-id',
    R2_ACCESS_KEY_ID: 'test-access-key',
    R2_SECRET_ACCESS_KEY: 'test-secret-key',
    R2_IMAGES: 'test-bucket'
  };

  beforeEach(async () => {
    // Reset cache singleton between tests
    const { resetCache } = await import('./cloudflare-r2-loader.js');
    resetCache();

    // Set env vars
    Object.assign(process.env, mockEnv);

    // Reset mocks
    vi.clearAllMocks();

    // Suppress console output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock successful image fetch
    (global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      headers: new Map([['content-type', 'image/jpeg']])
    });
  });

  afterEach(() => {
    // Clean up env
    Object.keys(mockEnv).forEach((key) => {
      delete process.env[key];
    });

    // Restore console
    vi.restoreAllMocks();
  });

  describe('Cache Loading', () => {
    it('should load existing mappings from R2 on first call', async () => {
      const mockMappings = [
        {
          hashnodeUrl: 'https://cdn.hashnode.com/test1.jpg',
          r2Key: 'blog/post1/abc123.jpg',
          r2Url: 'https://pub-xxx.r2.dev/blog/post1/abc123.jpg',
          uploadedAt: '2025-10-26T00:00:00.000Z',
          type: 'cover',
          postId: 'post1'
        }
      ];

      // Mock GetObjectCommand response
      const mockS3Send = vi.fn().mockResolvedValueOnce({
        Body: {
          transformToString: () => Promise.resolve(JSON.stringify(mockMappings))
        }
      });

      (S3Client as any).mockImplementation(() => ({
        send: mockS3Send
      }));

      // Import after mocking
      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      // First call should load from R2
      const result = await cloudflareR2Transform('https://cdn.hashnode.com/test1.jpg', {
        type: 'cover',
        postId: 'post1',
        postTitle: 'Test Post',
        originalUrl: 'https://cdn.hashnode.com/test1.jpg'
      });

      // Should have called GetObjectCommand to load mappings
      expect(mockS3Send).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'test-bucket',
          Key: '_image-mappings.json'
        })
      );

      // Should return cached URL without uploading
      expect(result).toContain('pub-xxx.r2.dev');
      expect(global.fetch).not.toHaveBeenCalled(); // No upload
    });

    it('should handle missing mappings file (first run)', async () => {
      const mockS3Send = vi.fn().mockRejectedValueOnce({
        name: 'NoSuchKey'
      });

      (S3Client as any).mockImplementation(() => ({
        send: mockS3Send
      }));

      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      // Should not throw, should proceed to upload
      await expect(
        cloudflareR2Transform('https://cdn.hashnode.com/new-image.jpg', {
          type: 'cover',
          postId: 'post1',
          postTitle: 'Test Post',
          originalUrl: 'https://cdn.hashnode.com/new-image.jpg'
        })
      ).resolves.toBeDefined();
    });
  });

  describe('Upload and Save', () => {
    it('should upload new image and save mapping immediately', async () => {
      const mockS3Send = vi
        .fn()
        // First call: GetObjectCommand (no mappings)
        .mockRejectedValueOnce({ name: 'NoSuchKey' })
        // Second call: PutObjectCommand (upload image)
        .mockResolvedValueOnce({})
        // Third call: PutObjectCommand (save mapping)
        .mockResolvedValueOnce({});

      (S3Client as any).mockImplementation(() => ({
        send: mockS3Send
      }));

      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      await cloudflareR2Transform('https://cdn.hashnode.com/new-image.jpg', {
        type: 'cover',
        postId: 'post1',
        postTitle: 'Test Post',
        originalUrl: 'https://cdn.hashnode.com/new-image.jpg'
      });

      // Should have called PutObjectCommand twice (image + mapping)
      expect(mockS3Send).toHaveBeenCalledTimes(3);

      // Verify image upload
      const imageUploadCall = mockS3Send.mock.calls[1][0];
      expect(imageUploadCall.Bucket).toBe('test-bucket');
      expect(imageUploadCall.Key).toMatch(/^blog\/post1\//);

      // Verify mapping save
      const mappingSaveCall = mockS3Send.mock.calls[2][0];
      expect(mappingSaveCall.Bucket).toBe('test-bucket');
      expect(mappingSaveCall.Key).toBe('_image-mappings.json');
      expect(mappingSaveCall.ContentType).toBe('application/json');

      const savedMappings = JSON.parse(mappingSaveCall.Body);
      expect(savedMappings).toHaveLength(1);
      expect(savedMappings[0].hashnodeUrl).toBe('https://cdn.hashnode.com/new-image.jpg');
    });

    it('should not re-upload cached images', async () => {
      const mockMappings = [
        {
          hashnodeUrl: 'https://cdn.hashnode.com/cached.jpg',
          r2Key: 'blog/post1/cached.jpg',
          r2Url: 'https://pub-xxx.r2.dev/blog/post1/cached.jpg',
          uploadedAt: '2025-10-26T00:00:00.000Z',
          type: 'cover',
          postId: 'post1'
        }
      ];

      const mockS3Send = vi.fn().mockResolvedValueOnce({
        Body: {
          transformToString: () => Promise.resolve(JSON.stringify(mockMappings))
        }
      });

      (S3Client as any).mockImplementation(() => ({
        send: mockS3Send
      }));

      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      // Call with cached image
      await cloudflareR2Transform('https://cdn.hashnode.com/cached.jpg', {
        type: 'cover',
        postId: 'post1',
        postTitle: 'Test Post',
        originalUrl: 'https://cdn.hashnode.com/cached.jpg'
      });

      // Should only call GetObjectCommand (load), no PutObjectCommand (upload)
      expect(mockS3Send).toHaveBeenCalledTimes(1);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Image Resizing URLs', () => {
    describe('Cloudflare Mode (CF_PAGES=1)', () => {
      beforeEach(() => {
        // Enable Cloudflare mode
        process.env.CF_PAGES = '1';
      });

      afterEach(() => {
        delete process.env.CF_PAGES;
      });

      it('should return relative URLs with Image Resizing params', async () => {
        const mockS3Send = vi.fn().mockRejectedValueOnce({ name: 'NoSuchKey' });

        (S3Client as any).mockImplementation(() => ({
          send: mockS3Send
        }));

        const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

        const result = await cloudflareR2Transform('https://cdn.hashnode.com/test.jpg', {
          type: 'cover',
          postId: 'post1',
          postTitle: 'Test Post',
          originalUrl: 'https://cdn.hashnode.com/test.jpg'
        });

        // Should be relative URL with Image Resizing
        expect(result).toMatch(/^\/cdn-cgi\/image\//);
        expect(result).toContain('width=1200');
        expect(result).toContain('quality=85');
        expect(result).toContain('format=auto');
      });

      it('should use different width for inline images', async () => {
        const mockS3Send = vi.fn().mockRejectedValueOnce({ name: 'NoSuchKey' });

        (S3Client as any).mockImplementation(() => ({
          send: mockS3Send
        }));

        const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

        const result = await cloudflareR2Transform('https://cdn.hashnode.com/test.jpg', {
          type: 'inline',
          postId: 'post1',
          postTitle: 'Test Post',
          originalUrl: 'https://cdn.hashnode.com/test.jpg'
        });

        // Should use 800px for inline
        expect(result).toContain('width=800');
      });
    });

    describe('Local Dev Mode (no CF_PAGES)', () => {
      it('should return direct R2 URLs without Image Resizing', async () => {
        const mockS3Send = vi.fn().mockRejectedValueOnce({ name: 'NoSuchKey' });

        (S3Client as any).mockImplementation(() => ({
          send: mockS3Send
        }));

        const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

        const result = await cloudflareR2Transform('https://cdn.hashnode.com/test.jpg', {
          type: 'cover',
          postId: 'post1',
          postTitle: 'Test Post',
          originalUrl: 'https://cdn.hashnode.com/test.jpg'
        });

        // Should be direct R2 URL (no /cdn-cgi/image/ prefix)
        // Default is i.mrugesh.dev, not pub-xxx.r2.dev
        expect(result).toMatch(/^https:\/\/i\.mrugesh\.dev\//);
        expect(result).not.toContain('/cdn-cgi/image/');
      });

      it('should return direct R2 URLs for cached images', async () => {
        const mockMappings = [
          {
            hashnodeUrl: 'https://cdn.hashnode.com/cached.jpg',
            r2Key: 'blog/post1/cached.jpg',
            r2Url: 'https://pub-xxx.r2.dev/blog/post1/cached.jpg',
            uploadedAt: '2025-10-26T00:00:00.000Z',
            type: 'cover',
            postId: 'post1'
          }
        ];

        const mockS3Send = vi.fn().mockResolvedValueOnce({
          Body: {
            transformToString: () => Promise.resolve(JSON.stringify(mockMappings))
          }
        });

        (S3Client as any).mockImplementation(() => ({
          send: mockS3Send
        }));

        const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

        const result = await cloudflareR2Transform('https://cdn.hashnode.com/cached.jpg', {
          type: 'cover',
          postId: 'post1',
          postTitle: 'Test Post',
          originalUrl: 'https://cdn.hashnode.com/cached.jpg'
        });

        // Should return direct R2 URL
        expect(result).toBe('https://pub-xxx.r2.dev/blog/post1/cached.jpg');
        expect(result).not.toContain('/cdn-cgi/image/');
      });
    });
  });

  describe('Non-Hashnode URLs', () => {
    it('should not transform non-Hashnode CDN images', async () => {
      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      const externalUrl = 'https://example.com/image.jpg';
      const result = await cloudflareR2Transform(externalUrl, {
        type: 'cover',
        postId: 'post1',
        postTitle: 'Test Post',
        originalUrl: externalUrl
      });

      // Should return unchanged
      expect(result).toBe(externalUrl);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return original URL on upload failure', async () => {
      const mockS3Send = vi
        .fn()
        .mockRejectedValueOnce({ name: 'NoSuchKey' })
        .mockRejectedValueOnce(new Error('Upload failed'));

      (S3Client as any).mockImplementation(() => ({
        send: mockS3Send
      }));

      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      const originalUrl = 'https://cdn.hashnode.com/test.jpg';
      const result = await cloudflareR2Transform(originalUrl, {
        type: 'cover',
        postId: 'post1',
        postTitle: 'Test Post',
        originalUrl
      });

      // Should return original URL on error
      expect(result).toBe(originalUrl);
    });

    it('should handle missing credentials gracefully', async () => {
      // Reset cache to force re-initialization
      const { resetCache } = await import('./cloudflare-r2-loader.js');
      resetCache();

      // Remove credentials (bypass TypeScript check for delete)
      delete (process.env as Record<string, string | undefined>).R2_ACCESS_KEY_ID;

      // Re-import to get fresh instance without credentials
      const { cloudflareR2Transform } = await import('./cloudflare-r2-loader.js');

      const originalUrl = 'https://cdn.hashnode.com/test.jpg';
      const result = await cloudflareR2Transform(originalUrl, {
        type: 'cover',
        postId: 'post1',
        postTitle: 'Test Post',
        originalUrl
      });

      // Should return original URL
      expect(result).toBe(originalUrl);
    });
  });
});

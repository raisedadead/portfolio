# Development Guide

## Image Storage with Cloudflare R2

### Overview

Blog images are stored in Cloudflare R2 and served via Image Resizing for automatic format optimization (WebP/AVIF).

**Benefits:**

- Free storage (10GB free tier)
- No egress fees
- Automatic format optimization
- Responsive sizing
- Fast delivery via Cloudflare CDN

### Prerequisites

1. Cloudflare account with Workers plan
2. R2 bucket created: `blog-images`

### Setup

#### 1. Create R2 API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **R2** in sidebar
3. Click **Manage R2 API Tokens**
4. Click **Create API Token**
5. Configure:
   - **Token Name**: `blog-images-uploader`
   - **Permissions**: Object Read & Write
   - **Specify bucket**: `blog-images`
   - **TTL**: Never expire
6. Click **Create API Token**
7. **Copy credentials**:
   - Access Key ID
   - Secret Access Key

**Finding Account ID:**

- Dashboard URL: `dash.cloudflare.com/<account-id>/r2`
- Or: R2 → Overview → Account ID

#### 2. Configure Environment

Add to `.env`:

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_IMAGES=blog-images
```

Optional custom domain (already configured):

```bash
R2_IMAGES_PUBLIC_DOMAIN=i.mrugesh.dev
```

#### 3. Configure CORS (Dashboard)

R2 bucket CORS policy (already applied):

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

#### 4. Test Upload

```bash
pnpm develop
```

**Expected output:**

```
Loading image mappings from R2: blog-images/_image-mappings.json
✓ Loaded 14 image mappings from R2
Uploading cover image for "Post Title"
✓ Uploaded to R2: blog/post-id/abc123.jpg
✓ Saved 1 total image mappings to R2
```

### How It Works

#### Build Time

1. Loader fetches posts from Hashnode
2. Downloads images from Hashnode CDN
3. Uploads to R2: `blog/[post-id]/[hash].[ext]`
4. Saves mappings to R2: `_image-mappings.json`
5. Generates optimized URLs

#### Environment-Aware URLs

**Local Development** (`astro dev`):

- Direct R2 URLs: `https://i.mrugesh.dev/blog/post-id/image.jpg`
- No Image Resizing (not needed in dev)

**Cloudflare Builds** (`CF_PAGES=1`):

- Image Resizing URLs: `/cdn-cgi/image/width=1200,quality=85,format=auto/https://i.mrugesh.dev/...`
- Automatic WebP/AVIF conversion
- Responsive sizing (1200px covers, 800px inline)

#### Caching

- **First build**: Uploads all images (~5-10 min for 14 posts)
- **Subsequent builds**: Loads mappings from R2, only uploads new images
- **No git commits**: Mappings stored in R2 bucket itself

### Custom Domain Setup

Custom domain `i.mrugesh.dev` is already configured:

1. **Cloudflare Dashboard**: R2 → blog-images → Settings → Custom Domains
2. **Status**: Active
3. **DNS**: Automatic via Cloudflare
4. **Benefits**: No CORS issues, cleaner URLs, same performance

### Configuration

**Image Resizing Settings** (`src/lib/cloudflare-r2-loader.ts:356`):

```typescript
width: context.type === 'cover' ? 1200 : 800,  // Responsive sizing
quality: 85,                                     // Balance quality/size
format: 'auto',                                  // Auto WebP/AVIF
```

### Troubleshooting

#### "R2 credentials missing, using original URL"

- Check `.env` has `CLOUDFLARE_ACCOUNT_ID` (not deprecated `CF_ACCOUNT_ID`)
- Restart dev server after adding credentials

#### "Failed to upload to R2"

- Verify API token has Write permissions
- Check Account ID matches Cloudflare account
- Ensure bucket name is `blog-images`

#### Images not showing

- Verify R2 bucket has public access
- Check network tab for 403 errors
- Confirm mappings in R2: `wrangler r2 object get blog-images/_image-mappings.json`

#### "Invalid URL format" or 404 for `/cdn-cgi/image/` in local dev

**Expected behavior**: Image Resizing disabled in local dev, uses direct R2 URLs instead.

**Why**: `/cdn-cgi/image/` requires Cloudflare Workers infrastructure.

**Solution**: Already handled automatically. Images use `https://i.mrugesh.dev/...` in dev.

#### Images not optimized (JPEG instead of WebP) in production

- Image Resizing only works in Cloudflare builds (not local dev)
- Check image URL starts with `/cdn-cgi/image/` in production
- Verify `CF_PAGES=1` is set in CI/CD (automatic in Cloudflare Pages)
- If using custom domain, ensure Cloudflare proxy enabled (orange cloud in DNS)

#### `net::ERR_BLOCKED_BY_ORB` errors

- CORS not configured or custom domain not active
- Verify CORS policy in R2 bucket settings
- Confirm custom domain shows "Active" status

### Cost

**Current usage (14 posts, ~52 images):**

- Storage: ~50MB = **$0.00/month** (under 10GB free tier)
- Requests: Build-time only, minimal
- Image Resizing: **$0.00** (included with Workers)
- Bandwidth: Included with Cloudflare

**Total: FREE** ✨

**Scaling:**

- Storage: $0.015/GB/month after 10GB
- Image Resizing: Always free with Workers
- Typical savings: 70-85% bandwidth from WebP/AVIF

### CI/CD Setup

Add environment variables (same as `.env`):

```
CLOUDFLARE_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_IMAGES=blog-images
```

Builds automatically:

1. Load mappings from R2
2. Upload new images
3. Update mappings in R2

No git commits needed.

### Migration Commands

**View mappings:**

```bash
npx wrangler r2 object get blog-images/_image-mappings.json
```

**Delete mappings (force re-upload):**

```bash
npx wrangler r2 object delete blog-images/_image-mappings.json --remote
```

**Clear local caches:**

```bash
pnpm clean
```

### Development Scripts

```bash
# Development server
pnpm develop

# Build for production
pnpm build

# Preview production build
pnpm preview

# Clean caches and build artifacts
pnpm clean

# Deploy to Cloudflare
pnpm deploy
```

### Files

**Loader Implementation:**

- `src/lib/cloudflare-r2-loader.ts` - R2 upload and Image Resizing
- `src/lib/image-optimizer.ts` - Passthrough for already-optimized URLs

**Tests:**

- `src/lib/cloudflare-r2-loader.test.ts` - Comprehensive test suite

**Configuration:**

- `src/content/config.ts` - Loader configuration
- `.env.example` - Environment variables template

**Documentation:**

- `docs/development.md` - This file

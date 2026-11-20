# Article covers

This guide tells you how to create, store, and replace an article cover.

## Rules

- Preserve article bodies, inline images, metadata, and unrelated unpublished edits.
- Do not change freeCodeCamp covers unless the operator asks.
- Upload covers to EmDash. Do not add them to `public/`.

## Storage

Store the cover images and `manifest.json` in `~/Pictures/portfolio/article-covers/`. Keep the prompt and the EmDash media URL of each cover in the manifest.

## Procedure

1. Read `manifest.json`. Use a cover in the manifest as the visual reference.
1. Choose one concrete metaphor for the article. Examples: DNS → connected server islands; caching → storage drawers; filtering → a sorting gate.
1. Fill in the subject of the style recipe below. Keep the style, palette, camera, and lighting.
1. Generate the image.
1. Review the image at thumbnail size.
1. Export the image as a 1280 × 720 WebP.
1. Write descriptive alt text.
1. Upload the image to EmDash. Replace only the cover field of the article.
1. Add the prompt and the media URL to `manifest.json`.

## Style recipe

```text
16:9 editorial cover. Isometric 3D voxel diorama inspired
by Minecraft and interlocking LEGO bricks.

Crisp stepped shapes, subtle studs, matte surfaces.
Pale mint, teal, peach-orange, ivory, and charcoal.
Mint-to-ivory backdrop, warm upper-left light, soft shadows.
Front three-quarter orthographic view.

One clear visual metaphor for the article.
Generous margins for cropping; readable at thumbnail size.
No text, watermarks, or unrelated logos.

Subject: [describe the scene here]
```

## Request template

The operator can ask for a cover with this text:

> Create a cover for “[article title]” using my existing brick-built article-cover style. Read the saved manifest and use an existing cover as a visual reference. Base the scene on this article: [summary or content].

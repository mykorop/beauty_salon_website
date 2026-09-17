# BookMe mark generation

Generated with the built-in imagegen tool on 2026-09-17. The reference is the
existing client app icon, copied from
`bookme_mobile/ios/client/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`.
The original reference and selected generated master are preserved here. The
first draft was rejected because its glow obscured the small-size silhouette.

## Initial prompt

```text
Use case: logo-brand
Asset type: BookMe favicon master, square 1024 by 1024 PNG.
Input image: reference only, the current BookMe B inside a map pin.
Primary request: create a fresh, simplified, precisely geometric version of this recognizable B-in-location-pin mark for tiny browser favicons.
Scene/backdrop: perfectly flat solid graphite #181a1d, full bleed square, opaque.
Subject: one warm gold #dfbf7a map pin outline containing one bold gold capital B. Preserve the identity and upright orientation of the reference. Use a thick clean rounded pin outline, a broad heavy B with two clearly open graphite counters. Give the B enough negative space from the outline. Make the pin and B simple and bold enough to recognize at 16 pixels.
Composition: center the single mark optically; outer pin fills about 82 percent of image height and 72 percent of image width, with a clean pointed bottom and generous curves. No outer rounded-square frame.
Style: crisp flat two-color logo, smooth antialiasing, no texture.
Text: only the single letter B inside the pin; no brand name, captions or fine print.
Avoid: gradients, metallic shine, shadows, bevels, 3D, photographic effects, decorative dots, extra symbols, extra borders, mockup sheet or multiple versions.
Save the final square master as a local image file.
```

## Final correction prompt

```text
Use case: precise-object-edit
Edit target: attached BookMe gold B-in-location-pin master.
Change only the color treatment and background: remove ALL glow, gradients, shadows, textures and transparency. Use uniform matte gold #dfbf7a throughout the B and pin strokes. Use uniform opaque graphite #181a1d everywhere else, including outside the pin, the inside of the pin and the two holes of the B. Entire full-bleed square must be opaque graphite except the gold shape.
Preserve the exact clean B-in-pin silhouette, thick strokes, central position and margins. Crisp sharp antialiased edges. This is a tiny 16px favicon source, so no blurred halos at all. Flat vector-like two-color appearance, not metallic, no effects, no added text. Output a single square PNG image.
```

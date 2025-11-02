# PWA Icon Setup

To complete the PWA setup, you need to create PNG icon files from your college-logo.svg:

## Required Icons:

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

## How to Create Icons:

### Option 1: Using an online converter
1. Go to https://cloudconvert.com/svg-to-png or similar
2. Upload `Assets/college-logo.svg`
3. Set output size to 192x192, download as `icon-192.png`
4. Repeat with 512x512 size for `icon-512.png`
5. Place both files in the `Assets/` folder

### Option 2: Using command line (if you have ImageMagick installed)
```bash
convert -background none -resize 192x192 Assets/college-logo.svg Assets/icon-192.png
convert -background none -resize 512x512 Assets/college-logo.svg Assets/icon-512.png
```

### Option 3: Using any image editor
1. Open college-logo.svg in your preferred editor (Photoshop, GIMP, Inkscape, etc.)
2. Export as PNG at 192x192 and 512x512 sizes
3. Save to the Assets folder

## Testing the PWA:

Once the icons are in place:

1. Deploy the app to a web server (GitHub Pages, Netlify, Vercel, etc.)
2. Open the site on your iPhone/iPad in Safari
3. Tap the Share button
4. Select "Add to Home Screen"
5. The calculator will now be installable as an app!

## Note:
The PWA will work without the PNG icons (using the SVG), but having proper PNG icons 
ensures better compatibility across all iOS versions.

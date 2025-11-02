# HP 12C Calculator - Deployment Guide

## Quick Deploy to GitHub Pages

Since this repository is already on GitHub, you can deploy it to GitHub Pages in minutes:

### Steps:

1. **Push all changes to GitHub:**
   ```powershell
   git add .
   git commit -m "Add PWA support for iOS/iPad app"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to: https://github.com/mscottsewell/HP12c/settings/pages
   - Under "Source", select "Deploy from a branch"
   - Under "Branch", select `main` and `/ (root)`
   - Click "Save"

3. **Wait 1-2 minutes** for deployment to complete

4. **Access your app at:**
   `https://mscottsewell.github.io/HP12c/`

### Install on iPhone/iPad:

1. Open the URL above in Safari on your iOS device
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right
5. The calculator is now installed as an app!

### Alternative Hosting Options:

#### Netlify (Drag & Drop):
1. Go to https://app.netlify.com/drop
2. Drag the entire HP12c folder
3. Get instant URL

#### Vercel:
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` in the project directory
3. Follow prompts

## Custom Domain (Optional):

If you want to use a custom domain like `calculator.yourdomain.com`:

### GitHub Pages:
1. Add a `CNAME` file with your domain
2. Configure DNS with your domain provider
3. Update settings in GitHub

### Update Service Worker:
If using a subdirectory or custom domain, update the `start_url` in `manifest.json`

## Testing:

Before deploying, you can test locally:
```powershell
python -m http.server 8000
```
Then open: http://localhost:8000

Note: Service worker requires HTTPS to work (except on localhost), so some PWA features won't work until deployed.

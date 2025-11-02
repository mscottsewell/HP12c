# Deploy HP 12C Calculator to GitHub Pages
# This script commits all changes and pushes to GitHub

Write-Host "🚀 Deploying HP 12C Calculator..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "❌ Not a git repository. Please run this from the HP12c directory." -ForegroundColor Red
    exit 1
}

# Show current status
Write-Host "📋 Current changes:" -ForegroundColor Yellow
git status --short

Write-Host ""
$confirm = Read-Host "Do you want to commit and push these changes? (y/n)"

if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    # Add all changes
    Write-Host ""
    Write-Host "➕ Adding all changes..." -ForegroundColor Green
    git add .
    
    # Commit
    Write-Host "💾 Committing changes..." -ForegroundColor Green
    git commit -m "Add PWA support for iOS/iPad installation - includes manifest, service worker, and mobile optimizations"
    
    # Push to GitHub
    Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Green
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/mscottsewell/HP12c/settings/pages" -ForegroundColor White
    Write-Host "2. Under 'Source', select branch 'main' and folder '/ (root)'" -ForegroundColor White
    Write-Host "3. Click 'Save'" -ForegroundColor White
    Write-Host "4. Wait 1-2 minutes for deployment" -ForegroundColor White
    Write-Host "5. Your app will be live at: https://mscottsewell.github.io/HP12c/" -ForegroundColor Green
    Write-Host ""
    Write-Host "📲 To install on iPhone/iPad:" -ForegroundColor Cyan
    Write-Host "   Open the URL in Safari and tap 'Add to Home Screen'" -ForegroundColor White
    
} else {
    Write-Host "❌ Deployment cancelled." -ForegroundColor Yellow
}

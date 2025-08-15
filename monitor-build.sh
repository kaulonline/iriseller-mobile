#!/bin/bash

# IRISeller iOS Build Monitor
# Monitor GitHub Actions build progress from terminal

echo "📱 IRISeller iOS Build Monitor"
echo "=============================="
echo
echo "🔗 Build URL: https://github.com/kaulonline/iriseller-mobile/actions"
echo "📝 Latest Commit: $(git rev-parse --short HEAD) - $(git log -1 --pretty=format:'%s')"
echo "⏰ Check Time: $(date)"
echo

echo "🎯 WHAT TO LOOK FOR:"
echo "✅ Dependencies install with npm (not yarn)"
echo "✅ No 'yarn failed with exit code 1' errors"
echo "✅ EAS Build proceeds to iOS compilation"
echo "✅ Artifacts uploaded: 'IRISeller-Enterprise-iOS'"
echo

echo "📊 EXPECTED TIMELINE:"
echo "• 0-3 min: Workflow starts, dependencies install"
echo "• 3-8 min: npm ci completes successfully" 
echo "• 8-25 min: iOS device compilation (.ipa)"
echo "• 25+ min: Artifacts ready for download"
echo

echo "🔄 TO CHECK STATUS:"
echo "1. Open: https://github.com/kaulonline/iriseller-mobile/actions"
echo "2. Look for workflow with commit: $(git rev-parse --short HEAD)"
echo "3. Click to see real-time logs"
echo

echo "📱 AFTER SUCCESS:"
echo "1. Download .ipa file from Actions artifacts"
echo "2. Run: ./deploy-ipa.sh /path/to/IRISeller.ipa"
echo "3. Test: https://app.iriseller.com/ios-enterprise/install.html"
echo

read -p "🔄 Press ENTER to open GitHub Actions in your browser..."
echo "Opening https://github.com/kaulonline/iriseller-mobile/actions"
echo "(If on server, copy this URL to your local browser)"

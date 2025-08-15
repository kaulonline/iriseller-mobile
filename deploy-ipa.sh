#!/bin/bash

# IRISeller iOS Enterprise Deployment Script
# Run this script after downloading .ipa from GitHub Actions

set -e

echo "🚀 IRISeller iOS Enterprise Deployment"
echo "======================================"

# Check if .ipa file provided
if [ -z "$1" ]; then
    echo "❌ Usage: ./deploy-ipa.sh path/to/IRISeller.ipa"
    echo ""
    echo "Example:"
    echo "  ./deploy-ipa.sh ~/Downloads/IRISeller.ipa"
    echo ""
    echo "💡 Download .ipa from GitHub Actions artifacts first"
    exit 1
fi

IPA_FILE="$1"

# Validate .ipa file exists
if [ ! -f "$IPA_FILE" ]; then
    echo "❌ Error: .ipa file not found: $IPA_FILE"
    exit 1
fi

echo "📱 Found .ipa file: $IPA_FILE"

# Deploy to enterprise distribution directory
DEPLOY_DIR="/var/www/html/ios-enterprise"
TARGET_FILE="$DEPLOY_DIR/IRISeller.ipa"

echo "📤 Deploying to: $TARGET_FILE"

# Copy with sudo permissions
sudo cp "$IPA_FILE" "$TARGET_FILE"
sudo chown www-data:www-data "$TARGET_FILE"
sudo chmod 644 "$TARGET_FILE"

# Verify deployment
if [ -f "$TARGET_FILE" ]; then
    FILE_SIZE=$(ls -lh "$TARGET_FILE" | awk '{print $5}')
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 File size: $FILE_SIZE"
    echo "📍 Location: $TARGET_FILE"
    echo ""
    echo "🎉 Your iPhone app is now ready!"
    echo "📱 Share this link: https://app.iriseller.com/ios-enterprise/install.html"
    echo ""
    echo "📋 Test instructions:"
    echo "1. Open link on iPhone Safari"
    echo "2. Tap 'Install on iPhone' button"
    echo "3. Allow installation when prompted"
    echo "4. Trust developer: Settings > General > VPN & Device Management"
    echo "5. Launch IRISeller from home screen"
    echo "6. Login: jchen@iriseller.com / Password123"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi

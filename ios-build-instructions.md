# IRISeller Native iOS App - Build Instructions

## Prerequisites
- macOS computer with Xcode installed
- Apple Developer Account ($99/year for App Store, free for development)
- IRISeller iOS project files (iriseller-ios-project.tar.gz)

## Step 1: Extract Project Files
```bash
# Download iriseller-ios-project.tar.gz to your macOS machine
tar -xzf iriseller-ios-project.tar.gz
cd ios/App
```

## Step 2: Open in Xcode
```bash
# Open the workspace (not the project!)
open App.xcworkspace
```

## Step 3: Configure Signing
1. Select "App" target in Xcode
2. Go to "Signing & Capabilities" 
3. Select your Apple Developer Team
4. Xcode will automatically configure provisioning

## Step 4: Build Options

### For Testing (Free Developer Account)
1. Connect iPhone via USB
2. Select your iPhone as destination
3. Click "Build and Run" (▶️ button)
4. App installs directly on your iPhone!

### For TestFlight Distribution (Paid Developer Account)
1. Select "Generic iOS Device" as destination
2. Product → Archive
3. Window → Organizer
4. Select your archive → "Distribute App"
5. Choose "App Store Connect"
6. Follow prompts to upload to TestFlight

### For Enterprise Distribution (Enterprise Account)
1. Select "Generic iOS Device" as destination
2. Product → Archive
3. Window → Organizer
4. Select your archive → "Distribute App"
5. Choose "Enterprise" → "Export"
6. Save .ipa file for direct distribution

## Step 5: Distribution Methods

### TestFlight (Internal Beta Testing)
- Upload to App Store Connect
- Invite team members via email
- They install TestFlight app → install IRISeller
- Perfect for team testing

### Direct Enterprise Distribution
- Email the .ipa file to users
- Users install via Apple Configurator or MDM
- No App Store approval needed
- Great for internal company use

### App Store (Public Release)
- Submit for App Store review (3-7 days)
- Available to public via App Store
- Automatic updates and discovery

## App Configuration
- **App Name**: IRISeller  
- **Bundle ID**: com.iriseller.mobile
- **Server URL**: https://app.iriseller.com
- **Brand Colors**: IRIS Turquoise (#06868D)
- **Features**: Face ID, Camera, Photo Library access

## Updating the App
When you update https://app.iriseller.com:
- Web content updates automatically
- Native app features require rebuild/resubmission
- TestFlight: Upload new build
- Enterprise: Distribute new .ipa file

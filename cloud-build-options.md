# IRISeller iOS App - Cloud Build Options (No Mac Required)

## Cloud Build Services for iOS Apps

### 1. **Codemagic (Recommended)**
- ✅ **Free tier available**: 500 minutes/month
- ✅ **Supports Capacitor** projects out of the box
- ✅ **Automatic TestFlight** upload
- 💰 **Pro plans**: $28-$99/month

**Setup Steps:**
1. Sign up at https://codemagic.io
2. Connect your GitHub/GitLab repository
3. Upload IRISeller project
4. Configure iOS build settings
5. Add Apple Developer credentials
6. Build → Automatic TestFlight upload

### 2. **Visual Studio App Center**
- ✅ **Microsoft service** (reliable)
- ✅ **Free tier**: 240 minutes/month
- ✅ **Good Capacitor support**
- 💰 **Paid plans**: $40+/month

### 3. **Bitrise**
- ✅ **Popular choice** for mobile CI/CD
- ✅ **Free tier**: 200 minutes/month  
- ✅ **Excellent iOS support**
- 💰 **Pro plans**: $45+/month

### 4. **GitHub Actions** (If using GitHub)
- ✅ **Free for open source**
- ✅ **macOS runners** available
- ⚠️ **More complex setup**
- 💰 **Paid for private repos**

## Quick Setup with Codemagic

### Step 1: Prepare Repository
```bash
# Upload your IRISeller project to GitHub/GitLab
git init
git add .
git commit -m "IRISeller iOS project"
git remote add origin [YOUR_REPO_URL]  
git push -u origin main
```

### Step 2: Codemagic Configuration
Create `.codemagic.yaml` in project root:

```yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    environment:
      groups:
        - app_store_credentials
      vars:
        BUNDLE_ID: "com.iriseller.mobile"
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
      node: latest
    scripts:
      - name: Install dependencies
        script: |
          npm ci
      - name: Capacitor sync
        script: |
          npx cap sync ios
    artifacts:
      - ios/App/build/outputs/**/*.ipa
    publishing:
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER  
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID
        submit_to_testflight: true
```

### Step 3: Add Apple Credentials
1. Go to Codemagic dashboard
2. Add Apple Developer credentials
3. Upload certificates and provisioning profiles
4. Configure App Store Connect API key

### Step 4: Build & Deploy
1. Push code to repository
2. Codemagic automatically builds
3. App uploads to TestFlight
4. Invite testers via App Store Connect

## Cost Comparison

| Service | Free Tier | Pro Plan | Best For |
|---------|-----------|----------|----------|
| Codemagic | 500 min/mo | $28/mo | Capacitor apps |
| App Center | 240 min/mo | $40/mo | Microsoft ecosystem |
| Bitrise | 200 min/mo | $45/mo | Enterprise features |
| GitHub Actions | 2000 min/mo | $4/mo | GitHub projects |

## Recommendation for IRISeller
- **Start with**: Codemagic free tier (500 minutes)
- **Build time**: ~10-15 minutes per build
- **Monthly capacity**: ~30-50 builds
- **Perfect for**: Testing and internal distribution

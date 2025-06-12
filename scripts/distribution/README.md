# Firebase App Distribution Scripts

This directory contains scripts for distributing React Native builds to Firebase App Distribution for both Android and iOS platforms.

## 🚀 Quick Start

### Local Development

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**

   ```bash
   firebase login
   ```

3. **Set up service account (optional for local development):**

   ```bash
   export FIREBASE_SERVICE_ACCOUNT_PATH="/path/to/your/service-account.json"
   ```

4. **Run distribution:**

   ```bash
   # Android only
   ./scripts/distribution/android-distribute.sh "Bug fixes and improvements" "testers,developers"

   # iOS only
   ./scripts/distribution/ios-distribute.sh "New features added" "testers"

   # Both platforms
   ./scripts/distribution/distribute.sh both "Version 1.2.0 release" "testers,developers"
   ```

## 📱 Available Scripts

### `distribute.sh`

Combined script that can distribute to Android, iOS, or both platforms.

**Usage:**

```bash
./distribute.sh [platform] [release-notes] [groups]
```

**Examples:**

```bash
# Distribute to both platforms
./distribute.sh both "Version 1.2.0 with new features"

# Android only with custom groups
./distribute.sh android "Bug fixes" "testers,qa-team"

# iOS only with default settings
./distribute.sh ios
```

### `android-distribute.sh`

Dedicated Android distribution script.

**Usage:**

```bash
./android-distribute.sh [release-notes] [groups]
```

### `ios-distribute.sh`

Dedicated iOS distribution script.

**Usage:**

```bash
./ios-distribute.sh [release-notes] [groups]
```

## 🔧 Configuration

### Environment Variables

#### For Local Development:

```bash
# Firebase service account (optional - will use firebase login otherwise)
export FIREBASE_SERVICE_ACCOUNT_PATH="/path/to/service-account.json"

# Build variants (optional)
export BUILD_VARIANT="assembleRelease"  # Android
export CONFIGURATION="Release"          # iOS
export SCHEME="WorldExplorer"           # iOS
```

#### For CI/CD:

```bash
# Firebase service account (base64 encoded JSON)
FIREBASE_SERVICE_ACCOUNT_KEY="<base64-encoded-service-account-json>"

# Android signing (optional)
ANDROID_KEYSTORE_BASE64="<base64-encoded-keystore>"
ANDROID_KEYSTORE_PASSWORD="<keystore-password>"
ANDROID_KEY_ALIAS="<key-alias>"
ANDROID_KEY_PASSWORD="<key-password>"

# iOS signing (optional)
IOS_DISTRIBUTION_CERTIFICATE_BASE64="<base64-encoded-p12>"
IOS_DISTRIBUTION_CERTIFICATE_PASSWORD="<p12-password>"
DEVELOPMENT_TEAM_ID="<apple-team-id>"
APPSTORE_ISSUER_ID="<app-store-connect-issuer-id>"
APPSTORE_API_KEY_ID="<app-store-connect-key-id>"
APPSTORE_API_PRIVATE_KEY="<app-store-connect-private-key>"
```

### Firebase Project Configuration

- **Project ID:** `world-explorer-c13fd`
- **Android App ID:** `1:264542140465:android:6c4f95fef8e056c94abd10`
- **iOS App ID:** `1:264542140465:ios:34ab91b3503d52204abd10`

## 🎯 Distribution Groups

Default distribution groups can be configured in Firebase Console:

- `testers` - QA team and beta testers
- `developers` - Internal development team
- `stakeholders` - Product managers and stakeholders

Create additional groups as needed in the [Firebase Console](https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution).

## 🔄 CI/CD Integration

### GitHub Actions

Two workflows are available:

- **Android Distribution:** `.github/workflows/android-distribution.yml`
- **iOS Distribution:** `.github/workflows/ios-distribution.yml`

#### Triggers:

- **Manual Only:** Use "Actions" tab in GitHub with custom release notes and distribution groups
- **Pull Request Testing:** Automatic builds on PRs to `main` branch (for testing, not distribution)
- **Automatic Distribution:** ❌ **DISABLED** - No automatic distribution on push to main/develop branches

#### Manual Distribution:

1. Go to GitHub repository → Actions tab
2. Select "Android Distribution" or "iOS Distribution" workflow
3. Click "Run workflow"
4. Enter release notes and distribution groups
5. Click "Run workflow" button

#### Required Secrets:

Set these in GitHub repository settings > Secrets and variables > Actions:

```
FIREBASE_SERVICE_ACCOUNT_KEY
ANDROID_KEYSTORE_BASE64 (optional)
ANDROID_KEYSTORE_PASSWORD (optional)
ANDROID_KEY_ALIAS (optional)
ANDROID_KEY_PASSWORD (optional)
IOS_DISTRIBUTION_CERTIFICATE_BASE64 (optional)
IOS_DISTRIBUTION_CERTIFICATE_PASSWORD (optional)
DEVELOPMENT_TEAM_ID (optional)
APPSTORE_ISSUER_ID (optional)
APPSTORE_API_KEY_ID (optional)
APPSTORE_API_PRIVATE_KEY (optional)
```

## 🛠️ Prerequisites

### Android

- Android SDK and build tools
- Java 17+
- Gradle

### iOS

- Xcode (latest stable)
- CocoaPods
- Valid Apple Developer account for code signing

### Both Platforms

- Node.js 18+
- React Native development environment
- Firebase CLI

## 📋 Troubleshooting

### Common Issues

1. **Firebase authentication failed:**

   - Ensure `firebase login` is executed or service account is properly configured
   - Check that service account has App Distribution Admin role

2. **Android build fails:**

   - Verify Android SDK and build tools are installed
   - Check `android/local.properties` for correct SDK path
   - Ensure gradlew has execute permissions: `chmod +x android/gradlew`

3. **iOS build fails:**

   - Verify Xcode is installed and up to date
   - Run `pod install` in iOS directory
   - Check code signing configuration

4. **Distribution groups not found:**
   - Create groups in Firebase Console before using them
   - Use exact group names (case-sensitive)

### Logs and Debugging

Add `-v` flag to Firebase CLI commands for verbose output:

```bash
firebase appdistribution:distribute --help
```

## 🍎 iOS Code Signing Requirements

### ⚠️ **Current Status: iOS Distribution Blocked**

**iOS distribution requires Apple Developer Account ($99/year) - currently not available.**

### What's Working ✅

- iOS app builds successfully
- All dependencies and Firebase integration work
- Archive (.xcarchive) file is created: `ios/build/WorldExplorer.xcarchive`
- Distribution infrastructure is fully set up
- All scripts and CI/CD workflows are ready

### What's Missing ❌

- **Apple Developer Account** (paid membership required)
- **iOS Development Certificate**
- **Provisioning Profile** for bundle ID: `org.luubui.worldexplorer`
- **Code Signing Configuration**

### Error Message You'll See

```
error: exportArchive No signing certificate "iOS Development" found
error: exportArchive No profiles for 'org.luubui.worldexplorer' were found
```

### When Apple Developer Account is Available

The distribution setup is **100% ready**. Once you have an Apple Developer Account:

1. **Create iOS Development Certificate** in Apple Developer Portal
2. **Create Provisioning Profile** for `org.luubui.worldexplorer`
3. **Configure code signing** in Xcode or add certificates to CI/CD
4. **Run the existing scripts** - they will work immediately

### Alternatives Until Then

#### ✅ **Android Distribution** (Fully Working)

- No developer account required
- Firebase App Distribution works perfectly
- Use for MVP testing and user feedback

#### 🔍 **iOS Simulator Testing** (Local Only)

- Free Xcode simulator testing
- No device testing or distribution possible
- Limited testing capabilities

#### 📱 **iOS TestFlight** (Future Option)

- Requires Apple Developer Account
- Apple's official beta testing platform
- Can be added later alongside Firebase App Distribution

### Build Artifacts Location

Even without code signing, the iOS build creates:

```
ios/build/
├── WorldExplorer.xcarchive/               # Complete iOS app archive
│   └── Products/Applications/
│       └── WorldExplorer.app/             # Your built iOS app
├── ExportOptions.plist                    # Export configuration
└── generated/                             # Generated React Native code
```

### Next Steps

1. **Continue with Android distribution** for immediate testing
2. **Gather user feedback** and validate app concept
3. **Get Apple Developer Account** when ready for iOS testing/App Store
4. **Documentation complete** - no additional setup needed later

### Cost Comparison

| Platform    | Distribution Cost | Developer Account    | Requirements            |
| ----------- | ----------------- | -------------------- | ----------------------- |
| **Android** | ✅ Free           | ❌ Not required      | None                    |
| **iOS**     | ✅ Free\*         | ✅ $99/year required | Apple Developer Account |

\*Firebase App Distribution is free, but Apple requires developer account for any iOS app distribution.

## 🔗 Links

- [Firebase Console](https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution)
- [Firebase App Distribution Documentation](https://firebase.google.com/docs/app-distribution)
- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [iOS Code Signing Guide](https://developer.apple.com/support/code-signing/)

## 📞 Support

For issues with the distribution setup:

1. Check this README for troubleshooting steps
2. Review GitHub Actions workflow logs
3. Check Firebase Console for distribution status
4. Contact the development team

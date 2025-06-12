# Firebase App Distribution Setup Guide

## ✅ Completed Setup

This setup has implemented Firebase App Distribution for both Android and iOS platforms with the following components:

### 📱 Platform Configuration

#### Android

- ✅ Added Firebase App Distribution Gradle plugin
- ✅ Configured `android/build.gradle` with distribution settings
- ✅ Created `android-distribute.sh` script

#### iOS

- ✅ Added Firebase App Distribution to `ios/Podfile`
- ✅ Created `ios-distribute.sh` script

### 🚀 Distribution Scripts

- ✅ `distribute.sh` - Combined script for both platforms
- ✅ `android-distribute.sh` - Android-specific distribution
- ✅ `ios-distribute.sh` - iOS-specific distribution
- ✅ All scripts made executable

### ⚙️ CI/CD Workflows

- ✅ `.github/workflows/android-distribution.yml` - Android CI/CD
- ✅ `.github/workflows/ios-distribution.yml` - iOS CI/CD

### 📚 Documentation

- ✅ Comprehensive `README.md` with usage instructions
- ✅ Troubleshooting guide
- ✅ Environment variable documentation

## 🔧 Next Steps

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Set up Service Account (for CI/CD)

1. Go to [Firebase Console](https://console.firebase.google.com/project/world-explorer-c13fd/settings/serviceaccounts/adminsdk)
2. Generate new private key
3. Download the JSON file
4. For GitHub Actions: Base64 encode and add as `FIREBASE_SERVICE_ACCOUNT_KEY` secret

### 3. Create Distribution Groups

In [Firebase Console](https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution):

1. Navigate to App Distribution
2. Create groups: `testers`, `developers`, `stakeholders`
3. Add testers to appropriate groups

### 4. Configure Code Signing (iOS)

- Set up Apple Developer certificates
- Configure provisioning profiles
- Add required secrets to GitHub Actions

### 5. Test Local Distribution

```bash
# Test Android
npm run distribute:android "Test build" "testers"

# Test iOS
npm run distribute:ios "Test build" "testers"

# Test both
npm run distribute:both "Test build" "testers"
```

## 🔐 Required Secrets (GitHub Actions)

Add these to GitHub repository settings > Secrets and variables > Actions:

### Required

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Base64 encoded Firebase service account JSON

### Optional (for signed builds)

- `ANDROID_KEYSTORE_BASE64` - Base64 encoded Android keystore
- `ANDROID_KEYSTORE_PASSWORD` - Keystore password
- `ANDROID_KEY_ALIAS` - Key alias
- `ANDROID_KEY_PASSWORD` - Key password
- `IOS_DISTRIBUTION_CERTIFICATE_BASE64` - Base64 encoded P12 certificate
- `IOS_DISTRIBUTION_CERTIFICATE_PASSWORD` - Certificate password
- `DEVELOPMENT_TEAM_ID` - Apple Developer Team ID

## 📋 Usage Examples

```bash
# Local development
./scripts/distribution/distribute.sh android "Bug fixes" "testers"
./scripts/distribution/distribute.sh ios "New features" "developers"
./scripts/distribution/distribute.sh both "Release v1.2.0" "testers,developers"

# Via npm scripts
npm run distribute android "Bug fixes" "testers"
npm run distribute:both "Release v1.2.0" "testers,developers"
```

## 🎯 Current Project Configuration

- **Firebase Project:** `world-explorer-c13fd`
- **Android App ID:** `1:264542140465:android:6c4f95fef8e056c94abd10`
- **iOS App ID:** `1:264542140465:ios:34ab91b3503d52204abd10`
- **Default Groups:** `testers`

## 🔗 Quick Links

- [Firebase Console](https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution)
- [GitHub Actions](../../.github/workflows)
- [Distribution Scripts](.)

Your Firebase App Distribution setup is now complete! 🎉

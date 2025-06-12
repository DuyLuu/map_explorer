#!/bin/bash

# iOS Firebase App Distribution Script
# Usage: ./ios-distribute.sh [release-notes] [groups]

set -e

echo "🚀 Starting iOS distribution process..."

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IOS_DIR="$PROJECT_DIR/ios"
RELEASE_NOTES="${1:-"New iOS build available for testing"}"
DISTRIBUTION_GROUPS="${2:-"testers"}"
SCHEME="${SCHEME:-WorldExplorer}"
CONFIGURATION="${CONFIGURATION:-Release}"
WORKSPACE="WorldExplorer.xcworkspace"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "$IOS_DIR" ]; then
    echo_error "iOS directory not found. Make sure you're running this from the project root."
    exit 1
fi

# Check required tools
if ! command -v xcodebuild &> /dev/null; then
    echo_error "xcodebuild not found. Make sure Xcode is installed."
    exit 1
fi

if ! command -v firebase &> /dev/null; then
    echo_error "Firebase CLI not found. Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if Firebase service account is configured
if [ -z "$FIREBASE_SERVICE_ACCOUNT_KEY" ] && [ -z "$FIREBASE_SERVICE_ACCOUNT_PATH" ]; then
    echo_warning "No Firebase service account found. Make sure to set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH"
    echo_info "For CI/CD, set FIREBASE_SERVICE_ACCOUNT_KEY as base64 encoded JSON"
    echo_info "For local development, set FIREBASE_SERVICE_ACCOUNT_PATH to the JSON file path"
fi

# Navigate to iOS directory
cd "$IOS_DIR"

# Check if workspace exists
if [ ! -d "$WORKSPACE" ]; then
    echo_error "Workspace $WORKSPACE not found. Make sure CocoaPods is installed and run 'pod install'."
    exit 1
fi

echo_info "Installing/updating CocoaPods dependencies..."
pod install --repo-update

echo_info "Building iOS app..."

# Clean previous builds
xcodebuild clean \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION"

# Create build directory
BUILD_DIR="$IOS_DIR/build"
ARCHIVE_PATH="$BUILD_DIR/WorldExplorer.xcarchive"
IPA_PATH="$BUILD_DIR/WorldExplorer.ipa"

mkdir -p "$BUILD_DIR"

echo_info "Archiving iOS app..."

# Archive the app
xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    -destination "generic/platform=iOS" \
    CODE_SIGNING_ALLOWED=NO \
    ARCHS=arm64 \
    ONLY_ACTIVE_ARCH=NO

echo_success "iOS app archived successfully!"

echo_info "Exporting IPA..."

# Create export options plist
EXPORT_OPTIONS_PLIST="$BUILD_DIR/ExportOptions.plist"
cat > "$EXPORT_OPTIONS_PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>\${DEVELOPMENT_TEAM}</string>
    <key>compileBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

# Export IPA
xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$BUILD_DIR" \
    -exportOptionsPlist "$EXPORT_OPTIONS_PLIST"

# Find the generated IPA
IPA_FILE=$(find "$BUILD_DIR" -name "*.ipa" -type f | head -1)

if [ -z "$IPA_FILE" ]; then
    echo_error "IPA not found in $BUILD_DIR"
    exit 1
fi

echo_info "IPA found at: $IPA_FILE"

# Setup Firebase authentication
if [ -n "$FIREBASE_SERVICE_ACCOUNT_KEY" ]; then
    # For CI/CD - decode base64 service account key
    echo "$FIREBASE_SERVICE_ACCOUNT_KEY" | base64 --decode > /tmp/firebase-service-account.json
    export GOOGLE_APPLICATION_CREDENTIALS="/tmp/firebase-service-account.json"
elif [ -n "$FIREBASE_SERVICE_ACCOUNT_PATH" ]; then
    # For local development
    export GOOGLE_APPLICATION_CREDENTIALS="$FIREBASE_SERVICE_ACCOUNT_PATH"
fi

# Distribute to Firebase App Distribution
echo_info "Distributing to Firebase App Distribution..."
echo_info "Groups: $DISTRIBUTION_GROUPS"
echo_info "Release notes: $RELEASE_NOTES"

firebase appdistribution:distribute "$IPA_FILE" \
    --app "1:264542140465:ios:34ab91b3503d52204abd10" \
    --groups "$DISTRIBUTION_GROUPS" \
    --release-notes "$RELEASE_NOTES"

# Cleanup
if [ -f "/tmp/firebase-service-account.json" ]; then
    rm "/tmp/firebase-service-account.json"
fi

echo_success "🎉 iOS distribution completed successfully!"
echo_info "Check your Firebase console for distribution status: https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution" 
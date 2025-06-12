#!/bin/bash

# Android Firebase App Distribution Script
# Usage: ./android-distribute.sh [release-notes] [groups]

set -e

echo "🚀 Starting Android distribution process..."

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"
RELEASE_NOTES="${1:-"New Android build available for testing"}"
DISTRIBUTION_GROUPS="${2:-"testers"}"
BUILD_VARIANT="${BUILD_VARIANT:-assembleRelease}"

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
if [ ! -d "$ANDROID_DIR" ]; then
    echo_error "Android directory not found. Make sure you're running this from the project root."
    exit 1
fi

# Check if Firebase service account is configured
if [ -z "$FIREBASE_SERVICE_ACCOUNT_KEY" ] && [ -z "$FIREBASE_SERVICE_ACCOUNT_PATH" ]; then
    echo_warning "No Firebase service account found. Make sure to set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH"
    echo_info "For CI/CD, set FIREBASE_SERVICE_ACCOUNT_KEY as base64 encoded JSON"
    echo_info "For local development, set FIREBASE_SERVICE_ACCOUNT_PATH to the JSON file path"
fi

# Navigate to Android directory
cd "$ANDROID_DIR"

echo_info "Building Android APK..."

# Clean previous builds
./gradlew clean

# Build the APK
echo_info "Running: ./gradlew $BUILD_VARIANT"
./gradlew $BUILD_VARIANT

echo_success "Android APK built successfully!"

# Find the generated APK
APK_PATH=$(find app/build/outputs/apk -name "*.apk" -type f | head -1)

if [ -z "$APK_PATH" ]; then
    echo_error "APK not found in app/build/outputs/apk/"
    exit 1
fi

echo_info "APK found at: $APK_PATH"

# Create temporary release notes file if needed
TEMP_NOTES_FILE=""
if [ ! -f "$PROJECT_DIR/release-notes.txt" ]; then
    TEMP_NOTES_FILE="$PROJECT_DIR/temp-release-notes.txt"
    echo "$RELEASE_NOTES" > "$TEMP_NOTES_FILE"
    NOTES_FILE_PATH="$TEMP_NOTES_FILE"
else
    NOTES_FILE_PATH="$PROJECT_DIR/release-notes.txt"
fi

# Distribute to Firebase App Distribution
echo_info "Distributing to Firebase App Distribution..."
echo_info "Groups: $DISTRIBUTION_GROUPS"
echo_info "Release notes: $RELEASE_NOTES"

if [ -n "$FIREBASE_SERVICE_ACCOUNT_KEY" ]; then
    # For CI/CD - decode base64 service account key
    echo "$FIREBASE_SERVICE_ACCOUNT_KEY" | base64 --decode > /tmp/firebase-service-account.json
    SERVICE_ACCOUNT_PATH="/tmp/firebase-service-account.json"
elif [ -n "$FIREBASE_SERVICE_ACCOUNT_PATH" ]; then
    # For local development
    SERVICE_ACCOUNT_PATH="$FIREBASE_SERVICE_ACCOUNT_PATH"
fi

# Run the distribution task with parameters
./gradlew appDistributionUploadRelease \
    -PdistributionGroups="$DISTRIBUTION_GROUPS" \
    -PreleaseNotes="$RELEASE_NOTES" \
    ${SERVICE_ACCOUNT_PATH:+-PfirebaseServiceAccountPath="$SERVICE_ACCOUNT_PATH"}

# Cleanup
if [ -n "$TEMP_NOTES_FILE" ] && [ -f "$TEMP_NOTES_FILE" ]; then
    rm "$TEMP_NOTES_FILE"
fi

if [ -f "/tmp/firebase-service-account.json" ]; then
    rm "/tmp/firebase-service-account.json"
fi

echo_success "🎉 Android distribution completed successfully!"
echo_info "Check your Firebase console for distribution status: https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution" 
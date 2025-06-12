#!/bin/bash

# Combined Firebase App Distribution Script
# Usage: ./distribute.sh [platform] [release-notes] [groups]
# Platform: android, ios, or both
# Examples:
#   ./distribute.sh android "Bug fixes and improvements" "testers,developers"
#   ./distribute.sh ios "New features added"
#   ./distribute.sh both "Version 1.2.0 release"

set -e

# Configuration
PLATFORM="${1:-both}"
RELEASE_NOTES="${2:-"New build available for testing"}"
DISTRIBUTION_GROUPS="${3:-"testers"}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

echo_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Validate platform parameter
case $PLATFORM in
    android|ios|both)
        ;;
    *)
        echo_error "Invalid platform: $PLATFORM"
        echo_info "Valid platforms: android, ios, both"
        exit 1
        ;;
esac

echo_header "Starting Firebase App Distribution for: $PLATFORM"
echo_info "Release notes: $RELEASE_NOTES"
echo_info "Distribution groups: $DISTRIBUTION_GROUPS"
echo ""

# Function to distribute Android
distribute_android() {
    echo_header "Starting Android Distribution"
    
    if [ -f "$SCRIPT_DIR/android-distribute.sh" ]; then
        chmod +x "$SCRIPT_DIR/android-distribute.sh"
        "$SCRIPT_DIR/android-distribute.sh" "$RELEASE_NOTES" "$DISTRIBUTION_GROUPS"
    else
        echo_error "Android distribution script not found at $SCRIPT_DIR/android-distribute.sh"
        return 1
    fi
}

# Function to distribute iOS
distribute_ios() {
    echo_header "Starting iOS Distribution"
    
    if [ -f "$SCRIPT_DIR/ios-distribute.sh" ]; then
        chmod +x "$SCRIPT_DIR/ios-distribute.sh"
        "$SCRIPT_DIR/ios-distribute.sh" "$RELEASE_NOTES" "$DISTRIBUTION_GROUPS"
    else
        echo_error "iOS distribution script not found at $SCRIPT_DIR/ios-distribute.sh"
        return 1
    fi
}

# Main distribution logic
case $PLATFORM in
    android)
        distribute_android
        ;;
    ios)
        distribute_ios
        ;;
    both)
        echo_info "Distributing to both platforms..."
        echo ""
        
        # Run Android first
        if distribute_android; then
            echo_success "Android distribution completed!"
        else
            echo_error "Android distribution failed!"
            exit 1
        fi
        
        echo ""
        echo_info "Waiting 5 seconds before starting iOS distribution..."
        sleep 5
        echo ""
        
        # Run iOS second
        if distribute_ios; then
            echo_success "iOS distribution completed!"
        else
            echo_error "iOS distribution failed!"
            exit 1
        fi
        ;;
esac

echo ""
echo_success "🎉 Distribution process completed successfully!"
echo_info "Check your Firebase console: https://console.firebase.google.com/project/world-explorer-c13fd/appdistribution"
echo "" 
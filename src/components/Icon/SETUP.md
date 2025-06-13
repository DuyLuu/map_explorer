# IcoMoon Font Setup for React Native CLI

## Issue Fixed

The runtime error `Cannot read property 'NativeModule' of undefined` was caused by mixing Expo modules in a React Native CLI project. This has been resolved by:

1. ✅ Removed `expo-font`, `expo-modules-core`, and `expo-asset` 
2. ✅ Updated Icon component to work with React Native CLI
3. ✅ Metro cache cleared and project restarted

## Font Configuration Required

To properly use your IcoMoon font in React Native CLI, you need to configure it natively:

### iOS Setup

1. **Add font to iOS project:**
   ```bash
   # Copy the font file to iOS project
   cp src/components/Icon/assets/icomoon.ttf ios/WorldExplorer/
   ```

2. **Update Info.plist:**
   Add this to `ios/WorldExplorer/Info.plist`:
   ```xml
   <key>UIAppFonts</key>
   <array>
     <string>icomoon.ttf</string>
   </array>
   ```

3. **Add to Xcode project:**
   - Open `ios/WorldExplorer.xcworkspace` in Xcode
   - Drag `icomoon.ttf` into the project navigator
   - Make sure "Add to target" is checked for WorldExplorer

### Android Setup

1. **Add font to Android project:**
   ```bash
   # Create fonts directory if it doesn't exist
   mkdir -p android/app/src/main/assets/fonts
   
   # Copy the font file
   cp src/components/Icon/assets/icomoon.ttf android/app/src/main/assets/fonts/
   ```

### Rebuild the Apps

After configuring the fonts:

```bash
# Clean and rebuild iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Clean and rebuild Android  
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

## Usage

Once properly configured, your IcoMoon icons will work:

```tsx
import Icon from '../components/Icon/Icon'

// Simple usage
<Icon name="setting" size={24} primary />

// With spacing and custom color
<Icon name="search" size="md" color="#FF0000" marginRight="sm" />
```

## Verification

The app should now start without the "NativeModule" error and your custom IcoMoon icons should render properly.
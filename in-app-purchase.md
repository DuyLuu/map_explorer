# In-App Purchase Implementation Guide

## Overview

This document outlines the implementation of in-app purchases for the World Explorer app, specifically for the "Pro" version features. We'll use a direct server communication approach that leverages Apple/Google's official servers for purchase validation, eliminating the need for our own server or third-party payment processors.

## Why We Don't Need RevenueCat or Stripe

### Current Implementation Benefits

1. **Direct Platform Integration**

   - Uses native App Store/Play Store billing
   - Handles all payment processing
   - Manages receipts and validation
   - Handles tax and currency conversion

2. **Simplified Architecture**

   - No additional third-party dependencies
   - Direct communication with platform servers
   - Built-in security and validation
   - Lower maintenance overhead

3. **Cost Effective**
   - No additional service fees
   - No server hosting costs
   - No third-party subscription costs
   - Uses platform's built-in features

### When to Consider RevenueCat/Stripe

These services would be beneficial if we needed:

1. **Complex Subscription Management**

   - Multiple subscription tiers
   - Cross-platform subscription syncing
   - Advanced analytics
   - Server-side receipt validation

2. **Custom Payment Flows**

   - Direct payment processing
   - Web-based payments
   - Non-platform payments
   - Custom billing cycles

3. **Advanced Features**
   - Detailed analytics
   - User management
   - Custom pricing
   - Complex business logic

### Our Approach is Sufficient Because:

1. **Simple Purchase Model**

   - One-time purchase (Pro version)
   - No subscription management
   - No complex pricing
   - No cross-platform syncing needed

2. **Platform Features**

   - Built-in purchase validation
   - Automatic receipt management
   - Platform-specific security
   - Standard billing flows

3. **Maintenance Benefits**
   - Fewer dependencies
   - Simpler codebase
   - Lower maintenance costs
   - Easier debugging

## Dependencies

```bash
npm install react-native-iap
# or
yarn add react-native-iap
```

## Platform Setup

### iOS Setup

1. Configure in App Store Connect:

   - Create an app record
   - Set up in-app purchase products
   - Configure pricing and availability
   - Add product descriptions and screenshots

2. Update app.json:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourapp.bundleid",
    "buildNumber": "1.0.0"
  }
}
```

### Android Setup

1. Configure in Google Play Console:

   - Create an app
   - Set up in-app products
   - Configure pricing
   - Add product descriptions

2. Update app.json:

```json
{
  "android": {
    "package": "com.yourapp.package",
    "versionCode": 1
  }
}
```

## Implementation Steps

### 1. Product Configuration

Create a products configuration file (e.g., `src/config/products.ts`):

```typescript
export const PRODUCTS = {
  PRO_VERSION: {
    id: 'com.yourapp.proversion',
    type: 'non_consumable', // or 'subscription' for subscription-based
    title: 'Pro Version',
    description: 'Unlock all features and remove ads',
  },
}
```

### 2. Purchase Flow Implementation

```typescript
import { initConnection, getProducts, requestPurchase } from 'react-native-iap'

// Initialize IAP
const initializeIAP = async () => {
  try {
    await initConnection()
    const products = await getProducts([PRODUCTS.PRO_VERSION.id])
    return products
  } catch (error) {
    console.error('IAP initialization failed:', error)
  }
}

// Handle purchase
const handlePurchase = async (productId: string) => {
  try {
    await requestPurchase(productId)
  } catch (error) {
    console.error('Purchase failed:', error)
  }
}
```

### 3. Purchase Status Management

- Store purchase status in AsyncStorage
- Implement purchase verification
- Handle purchase restoration

### Handling Purchases Without User Login

Since our app doesn't have a login feature, we'll use platform-specific mechanisms to maintain purchase status:

1. **Platform-Specific Purchase Tracking**

   - iOS: Uses Apple's receipt system
   - Android: Uses Google Play's purchase system
   - Both platforms maintain purchase history tied to the user's App Store/Play Store account

2. **Device Identification**

```typescript
import DeviceInfo from 'react-native-device-info'

// Get unique device identifier
const getDeviceId = async () => {
  try {
    // Get platform-specific unique identifier
    if (Platform.OS === 'ios') {
      return await DeviceInfo.getUniqueId()
    } else {
      return await DeviceInfo.getAndroidId()
    }
  } catch (error) {
    console.error('Failed to get device ID:', error)
    return null
  }
}

// Store purchase status with device info
const storePurchaseStatus = async (isValid: boolean) => {
  try {
    const deviceId = await getDeviceId()
    await AsyncStorage.setItem(
      'pro_version_purchased',
      JSON.stringify({
        isValid,
        timestamp: Date.now(),
        deviceId,
        platform: Platform.OS,
      })
    )
  } catch (error) {
    console.error('Failed to store purchase status:', error)
  }
}
```

### Handling App Reinstallation

1. **Automatic Purchase Restoration**
   - When user reinstalls the app, we automatically check for previous purchases
   - Uses platform's built-in purchase history
   - No user login required

```typescript
// Check for existing purchases on app start
const checkExistingPurchases = async () => {
  try {
    // Initialize IAP connection
    await initConnection()

    // Get available purchases
    const purchases = await getAvailablePurchases()

    // Check for Pro version purchase
    const proPurchase = purchases.find(purchase => purchase.productId === PRODUCTS.PRO_VERSION.id)

    if (proPurchase) {
      // Validate the purchase
      const isValid = await validatePurchase(proPurchase.transactionReceipt)

      if (isValid) {
        // Store the purchase status
        await storePurchaseStatus(true)
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Failed to check existing purchases:', error)
    return false
  }
}
```

2. **Platform-Specific Behavior**

   - iOS: Purchases are tied to Apple ID
   - Android: Purchases are tied to Google Account
   - Both platforms maintain purchase history across reinstalls

3. **Best Practices for No-Login Apps**
   - Always check for existing purchases on app start
   - Provide clear restore purchase option
   - Handle platform-specific edge cases
   - Store purchase status locally as backup
   - Implement proper error handling

### Security Considerations for No-Login Apps

1. **Platform Security**

   - Rely on platform's built-in security
   - Use platform-specific validation
   - Trust platform's purchase history

2. **Local Storage Security**

   - Encrypt stored purchase status
   - Include device-specific information
   - Add timestamp validation
   - Store platform information

3. **Edge Cases**
   - Handle device changes
   - Manage platform account changes
   - Deal with network issues
   - Handle validation failures

### Handling Device Changes

When users switch devices or use multiple devices, we need to handle purchase status appropriately:

1. **Device Change Detection**

```typescript
import DeviceInfo from 'react-native-device-info'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Check if device has changed
const checkDeviceChange = async () => {
  try {
    const currentDeviceId = await getDeviceId()
    const storedData = await AsyncStorage.getItem('pro_version_purchased')

    if (storedData) {
      const { deviceId: storedDeviceId, platform: storedPlatform } = JSON.parse(storedData)

      // Check if device ID or platform has changed
      if (currentDeviceId !== storedDeviceId || Platform.OS !== storedPlatform) {
        // Device has changed, attempt to restore purchases
        return await restorePurchases()
      }
    }

    return false
  } catch (error) {
    console.error('Failed to check device change:', error)
    return false
  }
}
```

2. **Cross-Device Purchase Management**

```typescript
// Handle purchase status across devices
const handleCrossDevicePurchase = async () => {
  try {
    // First check local storage
    const localStatus = await checkLocalPurchaseStatus()

    if (!localStatus) {
      // If no local status, check platform purchases
      const platformStatus = await checkExistingPurchases()

      if (platformStatus) {
        // Update local storage with new device info
        await storePurchaseStatus(true)
        return true
      }
    }

    return localStatus
  } catch (error) {
    console.error('Failed to handle cross-device purchase:', error)
    return false
  }
}

// Check local purchase status
const checkLocalPurchaseStatus = async () => {
  try {
    const storedData = await AsyncStorage.getItem('pro_version_purchased')
    if (storedData) {
      const { isValid, timestamp } = JSON.parse(storedData)
      return isValid
    }
    return false
  } catch (error) {
    console.error('Failed to check local purchase status:', error)
    return false
  }
}
```

3. **Implementation Strategy**

   a. **On App Start**

   ```typescript
   const initializeApp = async () => {
     try {
       // Initialize IAP connection
       await initConnection()

       // Check for device changes
       const deviceChanged = await checkDeviceChange()

       if (deviceChanged) {
         // Device has changed, handle cross-device purchase
         await handleCrossDevicePurchase()
       } else {
         // Normal purchase status check
         await checkExistingPurchases()
       }
     } catch (error) {
       console.error('Failed to initialize app:', error)
     }
   }
   ```

   b. **Purchase Status Updates**

   ```typescript
   const updatePurchaseStatus = async (isValid: boolean) => {
     try {
       // Store current device info with purchase status
       await storePurchaseStatus(isValid)

       // If purchase is valid, ensure it's properly restored
       if (isValid) {
         await restorePurchases()
       }
     } catch (error) {
       console.error('Failed to update purchase status:', error)
     }
   }
   ```

4. **Best Practices for Device Changes**

   - Always check for device changes on app start
   - Maintain platform-specific purchase history
   - Handle platform account changes
   - Provide clear user feedback
   - Implement proper error handling
   - Store backup information locally
   - Validate purchases after device changes

5. **Edge Cases to Handle**

   - User changes Apple ID/Google Account
   - User uses multiple devices
   - User reinstalls on same device
   - User switches between iOS and Android
   - Network issues during device change
   - Platform account issues

## Testing

### iOS Testing

1. Use Sandbox environment
2. Create a sandbox tester account
3. Test purchase flow using sandbox account

### Android Testing

1. Use internal testing track
2. Test with test accounts
3. Verify purchase flow

## Security Considerations

### Direct Server Validation Approach

Our implementation uses a direct server validation approach, where the app communicates directly with Apple/Google's servers for purchase validation. This approach is secure, efficient, and doesn't require maintaining our own server.

#### Key Benefits:

1. **Direct Platform Communication**

   - App communicates directly with Apple/Google servers
   - No intermediate server needed
   - Reduced complexity and maintenance
   - Lower latency for users

2. **Built-in Security**

   - Uses official platform APIs
   - Handles all security measures
   - Manages refunds and cancellations
   - Prevents purchase forgery

3. **Cost Effective**
   - No server hosting costs
   - No server maintenance
   - No additional infrastructure needed

### Implementation Details

```typescript
import {
  initConnection,
  getProducts,
  requestPurchase,
  validateReceiptIos,
  validateReceiptAndroid,
  endConnection,
  getAvailablePurchases,
} from 'react-native-iap'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

// Validate purchase receipt directly with platform servers
const validatePurchase = async (receipt: string) => {
  try {
    if (Platform.OS === 'ios') {
      // Direct communication with Apple's servers
      const validation = await validateReceiptIos({
        receiptBody: { 'receipt-data': receipt },
        secret: 'your_shared_secret', // From App Store Connect
      })
      return validation.status === 0
    } else {
      // Direct communication with Google's servers
      const validation = await validateReceiptAndroid({
        receiptBody: { 'receipt-data': receipt },
        secret: 'your_license_key', // From Google Play Console
      })
      return validation.status === 0
    }
  } catch (error) {
    console.error('Receipt validation failed:', error)
    return false
  }
}

// Store validated purchase status locally
const storePurchaseStatus = async (isValid: boolean) => {
  try {
    await AsyncStorage.setItem(
      'pro_version_purchased',
      JSON.stringify({
        isValid,
        timestamp: Date.now(),
        deviceId: await getDeviceId(), // Implement device ID generation
      })
    )
  } catch (error) {
    console.error('Failed to store purchase status:', error)
  }
}

// Restore purchases
const restorePurchases = async () => {
  try {
    // Get all available purchases from the store
    const purchases = await getAvailablePurchases()

    // Filter for our Pro version purchase
    const proPurchase = purchases.find(purchase => purchase.productId === PRODUCTS.PRO_VERSION.id)

    if (proPurchase) {
      // Validate the restored purchase
      const isValid = await validatePurchase(proPurchase.transactionReceipt)

      if (isValid) {
        // Store the restored purchase status
        await storePurchaseStatus(true)
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Failed to restore purchases:', error)
    return false
  }
}

// Clean up IAP connection
const cleanup = async () => {
  try {
    await endConnection()
  } catch (error) {
    console.error('Failed to end IAP connection:', error)
  }
}
```

### Security Measures

1. **Platform-Specific Validation**

   - iOS: Uses Apple's secure receipt validation
   - Android: Uses Google Play's secure billing validation
   - Both platforms handle their own security measures

2. **Local Storage Security**

   - Encrypt purchase status data
   - Include device-specific information
   - Add timestamp for validation

3. **Additional Security Layers**
   - Implement device fingerprinting
   - Add purchase timestamp validation
   - Include app version checks

### Best Practices

1. Always validate receipts using platform-specific methods
2. Store purchase status with encryption
3. Implement device-specific checks
4. Add timestamp validation
5. Handle network issues gracefully

## Common Issues and Solutions

### 1. Purchase Not Completing

- Check network connection
- Verify product configuration
- Ensure proper error handling

### 2. Receipt Validation Failures

- Verify server-side validation
- Check receipt format
- Handle different receipt types

### 3. Platform-Specific Issues

- iOS: Handle App Store receipt validation
- Android: Handle Google Play billing

## Debugging Tips

1. Use console logs for debugging
2. Implement proper error handling
3. Test in sandbox environment
4. Verify product configuration
5. Check network connectivity

## Next Steps

1. Implement the basic purchase flow
2. Add direct server validation
3. Implement purchase restoration
4. Add device-specific identification
5. Implement device change handling
6. Add cross-device purchase management
7. Implement reinstallation handling
8. Add secure local storage
9. Test thoroughly in sandbox environment

### When to Switch to RevenueCat/Stripe

Here are specific scenarios where we might need to switch to RevenueCat or Stripe:

1. **Subscription-Based Features**

   ```typescript
   // Current approach (one-time purchase)
   const PRODUCTS = {
     PRO_VERSION: {
       id: 'com.yourapp.proversion',
       type: 'non_consumable',
       title: 'Pro Version',
       description: 'Unlock all features and remove ads',
     },
   }

   // If we need subscriptions (RevenueCat would be better)
   const SUBSCRIPTIONS = {
     BASIC: {
       id: 'com.yourapp.subscription.basic',
       type: 'subscription',
       title: 'Basic Plan',
       price: '$4.99/month',
     },
     PREMIUM: {
       id: 'com.yourapp.subscription.premium',
       type: 'subscription',
       title: 'Premium Plan',
       price: '$9.99/month',
     },
     ENTERPRISE: {
       id: 'com.yourapp.subscription.enterprise',
       type: 'subscription',
       title: 'Enterprise Plan',
       price: '$29.99/month',
     },
   }
   ```

2. **Cross-Platform User Management**

   ```typescript
   // Current approach (platform-specific)
   const checkPurchaseStatus = async () => {
     if (Platform.OS === 'ios') {
       // iOS specific check
     } else {
       // Android specific check
     }
   }

   // If we need cross-platform sync (RevenueCat would be better)
   const syncUserSubscription = async (userId: string) => {
     // Sync across iOS, Android, Web
     // Handle different subscription states
     // Manage user entitlements
     // Track usage across platforms
   }
   ```

3. **Complex Business Logic**

   ```typescript
   // Current approach (simple validation)
   const validatePurchase = async (receipt: string) => {
     // Simple platform validation
   }

   // If we need complex business rules (Stripe would be better)
   const handleComplexPayment = async (payment: Payment) => {
     // Custom pricing rules
     // Dynamic discounts
     // Usage-based billing
     // Custom payment schedules
     // Multiple payment methods
   }
   ```

4. **Specific Scenarios Requiring Switch**

   a. **Multiple Subscription Tiers**

   - Free trial management
   - Different feature sets per tier
   - Promotional pricing
   - Family plans
   - Team subscriptions

   b. **Advanced Analytics Needs**

   - Revenue tracking
   - User behavior analysis
   - Churn prediction
   - Conversion tracking
   - A/B testing

   c. **Custom Payment Flows**

   - Web-based purchases
   - Custom checkout process
   - Multiple payment methods
   - International pricing
   - Custom billing cycles

   d. **Enterprise Features**

   - Team management
   - Usage tracking
   - Custom invoicing
   - Bulk purchases
   - Special pricing

5. **Migration Considerations**

   a. **When to Consider Migration**

   - Adding subscription features
   - Expanding to web platform
   - Need for advanced analytics
   - Complex pricing models
   - Enterprise requirements

   b. **Migration Process**

   - Plan feature migration
   - Handle existing purchases
   - Update user interface
   - Implement new validation
   - Test thoroughly

   c. **Cost-Benefit Analysis**

   - Service fees
   - Development time
   - Maintenance costs
   - Feature benefits
   - User experience

6. **Current Limitations**

   a. **Platform Restrictions**

   - Limited to App Store/Play Store
   - Platform-specific rules
   - Standard pricing models
   - Limited analytics

   b. **Feature Constraints**

   - No custom payment flows
   - Limited subscription management
   - Basic validation only
   - Platform-dependent features

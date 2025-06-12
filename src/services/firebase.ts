import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app'

export class FirebaseService {
  private static instance: FirebaseService

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService()
    }
    return FirebaseService.instance
  }

  // Test Firebase connection
  public async testConnection(): Promise<boolean> {
    try {
      // Test Firestore connection
      await firestore().enableNetwork()
      console.log('✅ Firebase connection successful')
      return true
    } catch (error) {
      console.error('❌ Firebase connection failed:', error)
      return false
    }
  }

  // Get Firebase app info
  public getAppInfo() {
    const app = firebase.app()
    return {
      name: app.name,
      options: app.options
    }
  }

  // Auth methods
  public getCurrentUser() {
    return auth().currentUser
  }

  public async signInAnonymously() {
    try {
      const userCredential = await auth().signInAnonymously()
      console.log('✅ Anonymous sign-in successful')
      return userCredential.user
    } catch (error) {
      console.error('❌ Anonymous sign-in failed:', error)
      throw error
    }
  }

  public async signOut() {
    try {
      await auth().signOut()
      console.log('✅ Sign-out successful')
    } catch (error) {
      console.error('❌ Sign-out failed:', error)
      throw error
    }
  }

  // Firestore methods
  public getFirestore() {
    return firestore()
  }

  public async testFirestoreWrite() {
    try {
      const testDoc = firestore().collection('test').doc('connection')
      await testDoc.set({
        timestamp: firestore.FieldValue.serverTimestamp(),
        message: 'Firebase connection test'
      })
      console.log('✅ Firestore write test successful')
      return true
    } catch (error) {
      console.error('❌ Firestore write test failed:', error)
      return false
    }
  }
}

export default FirebaseService.getInstance()

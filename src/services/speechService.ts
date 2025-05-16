import Tts from 'react-native-tts'
import { Platform } from 'react-native'

export const initializeTts = async () => {
  try {
    await Tts.setDefaultLanguage('en-US')
    // Set rate differently for iOS and Android
    if (Platform.OS === 'ios') {
      await Tts.setDefaultRate(0.5)
    } else {
      await Tts.setDefaultRate(0.5)
    }
    await Tts.setDefaultPitch(1.0)
  } catch (error) {
    console.error('Failed to initialize TTS:', error)
  }
}

export const speakText = async (text: string) => {
  try {
    // Only stop on Android, as iOS has issues with stop()
    if (Platform.OS === 'android') {
      await Tts.stop()
    }
    await Tts.speak(text)
  } catch (error) {
    console.error('Failed to speak text:', error)
  }
} 
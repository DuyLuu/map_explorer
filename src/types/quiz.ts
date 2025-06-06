import { ImageSourcePropType } from 'react-native'

export interface QuizQuestion {
  id: string
  flagAsset: ImageSourcePropType
  correctAnswer: string
  options: string[]
}

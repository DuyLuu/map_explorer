import { QuizQuestion } from '../types/quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@quiz_progress';

// Temporary mock data - will be replaced with actual API calls
const mockCountries = [
  {
    id: '1',
    name: 'United States',
    flagUrl: 'https://flagcdn.com/w320/us.png',
  },
  {
    id: '2',
    name: 'United Kingdom',
    flagUrl: 'https://flagcdn.com/w320/gb.png',
  },
  {
    id: '3',
    name: 'France',
    flagUrl: 'https://flagcdn.com/w320/fr.png',
  },
  {
    id: '4',
    name: 'Germany',
    flagUrl: 'https://flagcdn.com/w320/de.png',
  },
  {
    id: '5',
    name: 'Japan',
    flagUrl: 'https://flagcdn.com/w320/jp.png',
  },
  {
    id: '6',
    name: 'Italy',
    flagUrl: 'https://flagcdn.com/w320/it.png',
  },
  {
    id: '7',
    name: 'Spain',
    flagUrl: 'https://flagcdn.com/w320/es.png',
  },
  {
    id: '8',
    name: 'Canada',
    flagUrl: 'https://flagcdn.com/w320/ca.png',
  },
  {
    id: '9',
    name: 'Australia',
    flagUrl: 'https://flagcdn.com/w320/au.png',
  },
  {
    id: '10',
    name: 'Brazil',
    flagUrl: 'https://flagcdn.com/w320/br.png',
  },
  {
    id: '11',
    name: 'China',
    flagUrl: 'https://flagcdn.com/w320/cn.png',
  },
  {
    id: '12',
    name: 'India',
    flagUrl: 'https://flagcdn.com/w320/in.png',
  },
  {
    id: '13',
    name: 'Russia',
    flagUrl: 'https://flagcdn.com/w320/ru.png',
  },
  {
    id: '14',
    name: 'South Africa',
    flagUrl: 'https://flagcdn.com/w320/za.png',
  },
  {
    id: '15',
    name: 'Mexico',
    flagUrl: 'https://flagcdn.com/w320/mx.png',
  },
];

export const generateQuizQuestion = (): QuizQuestion => {
  // Randomly select a country for the correct answer
  const correctCountryIndex = Math.floor(Math.random() * mockCountries.length);
  const correctCountry = mockCountries[correctCountryIndex];

  // Generate 3 random wrong answers
  const wrongAnswers = mockCountries
    .filter((_, index) => index !== correctCountryIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(country => country.name);

  // Combine correct and wrong answers, then shuffle
  const options = [...wrongAnswers, correctCountry.name].sort(
    () => Math.random() - 0.5
  );

  return {
    id: correctCountry.id,
    flagUrl: correctCountry.flagUrl,
    correctAnswer: correctCountry.name,
    options,
  };
};

export const saveQuizProgress = async (score: number): Promise<void> => {
  try {
    const currentProgress = await getQuizProgress();
    const newProgress = Math.max(currentProgress, score);
    await AsyncStorage.setItem(PROGRESS_KEY, newProgress.toString());
  } catch (error) {
    console.error('Error saving quiz progress:', error);
  }
};

export const getQuizProgress = async (): Promise<number> => {
  try {
    const progress = await AsyncStorage.getItem(PROGRESS_KEY);
    return progress ? parseInt(progress, 10) : 0;
  } catch (error) {
    console.error('Error getting quiz progress:', error);
    return 0;
  }
}; 
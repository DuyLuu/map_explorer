import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LEADERBOARD_KEY = '@leaderboard_data'

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  questionCount: number
  date: string
}

interface LeaderboardStore {
  entries: LeaderboardEntry[]
  addEntry: (entry: Omit<LeaderboardEntry, 'id' | 'date'>) => Promise<void>
  clearLeaderboard: () => Promise<void>
  loadLeaderboard: () => Promise<void>
}

export const useLeaderboardStore = create<LeaderboardStore>(set => ({
  entries: [],

  addEntry: async entry => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }

    const updatedEntries = [
      ...useLeaderboardStore.getState().entries,
      newEntry,
    ].sort((a, b) => b.score - a.score)

    set({ entries: updatedEntries })
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedEntries))
  },

  clearLeaderboard: async () => {
    set({ entries: [] })
    await AsyncStorage.removeItem(LEADERBOARD_KEY)
  },

  loadLeaderboard: async () => {
    try {
      const storedData = await AsyncStorage.getItem(LEADERBOARD_KEY)
      if (storedData) {
        const entries = JSON.parse(storedData)
        set({ entries })
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  },
}))

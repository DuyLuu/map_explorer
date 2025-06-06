import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from '../../../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from '../../../types/region'
import { getSelectableRegions } from '../../../services/regionService'
import { isLevelUnlocked } from '../../../services/quizService'
import BackButton from '../../../components/BackButton'

import MapRegionOption from '../components/MapRegionOption'

const MapRegionSelectionScreen: React.FC = () => {
  const { selectedRegion, setSelectedRegion, selectedLevel, setSelectedLevel, setQuestionCount } =
    useCountryStore()
  const navigation = useNavigation<any>()
  const [unlockedLevels, setUnlockedLevels] = useState<Record<number, boolean>>({
    1: true, // Easy is always unlocked
    2: false,
    3: false,
  })

  const levels = [
    { id: 1, name: 'Easy', description: 'Most popular countries' },
    { id: 2, name: 'Medium', description: 'Moderately known countries' },
    { id: 3, name: 'Hard', description: 'Less known countries' },
  ]

  // Set default values for map quiz when screen loads
  useEffect(() => {
    if (!selectedLevel) {
      setSelectedLevel(1) // Default to easy level for map quiz
    }
    setQuestionCount(10) // Default to 10 questions for map quiz
  }, [setSelectedLevel, setQuestionCount, selectedLevel])

  // Check level unlock status when region changes
  useEffect(() => {
    if (selectedRegion) {
      checkLevelUnlockStatus()
    }
  }, [selectedRegion])

  // All 7 regions for map quiz
  const regions = getSelectableRegions().map(region => REGION_INFO[region])

  const checkLevelUnlockStatus = async () => {
    if (!selectedRegion) return

    const unlockStatus: Record<number, boolean> = {
      1: true, // Easy is always unlocked
      2: await isLevelUnlocked(selectedRegion, 2),
      3: await isLevelUnlocked(selectedRegion, 3),
    }

    setUnlockedLevels(unlockStatus)

    // If currently selected level is now locked, reset to level 1
    if (selectedLevel && !unlockStatus[selectedLevel]) {
      setSelectedLevel(1)
    }
  }

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
  }

  const handleLevelSelect = (level: number) => {
    if (unlockedLevels[level]) {
      setSelectedLevel(level)
    }
  }

  const onConfirm = () => {
    navigation.navigate('MapQuiz')
  }

  const canStart = selectedRegion && selectedLevel && unlockedLevels[selectedLevel]

  const getLevelLockMessage = (level: number): string => {
    if (level === 1) return ''
    if (level === 2) return 'Complete Easy level to unlock'
    if (level === 3) return 'Complete Medium level to unlock'
    return ''
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Map Quiz</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Select region and difficulty level</Text>
        <Text style={styles.infoText}>
          Progressive difficulty: complete easier levels to unlock harder ones!
        </Text>

        {/* Region Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Region</Text>
          <View style={styles.optionsContainer}>
            {regions.map(region => (
              <MapRegionOption
                key={region.id}
                region={region.id}
                isSelected={selectedRegion === region.id}
                onPress={() => handleRegionSelect(region.id)}
              />
            ))}
          </View>
          {/* Add View Progress Detail button */}
          {selectedRegion && (
            <TouchableOpacity
              style={[styles.confirmButton, { marginTop: 12, marginBottom: 0 }]}
              onPress={() => navigation.navigate('MapProgressDetail')}
            >
              <Text style={styles.confirmButtonText}>View Progress Detail</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !canStart && styles.disabledButton]}
        onPress={onConfirm}
        disabled={!canStart}
      >
        <Text style={styles.confirmButtonText}>Start Map Quiz</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

// Helper function to get region descriptions
const getRegionDescription = (region: Region): string => {
  const descriptions: Record<Region, string> = {
    [Region.WORLD]: 'All countries worldwide',
    [Region.EUROPE]: '47 European countries',
    [Region.AFRICA]: '54 African countries',
    [Region.ASIA]: '48 Asian countries',
    [Region.NORTH_AMERICA]: '23 North American countries',
    [Region.SOUTH_AMERICA]: '12 South American countries',
    [Region.OCEANIA]: '14 Oceanian countries',
  }
  return descriptions[region] || 'Explore this region'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginHorizontal: 8,
  },
  optionButton: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#FF6B35',
    borderColor: '#E55A2B',
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  progressContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  optionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'left',
  },
  progressPercentage: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 2,
  },
  selectedText: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressCardsContainer: {
    gap: 12,
    marginHorizontal: 8,
  },
  levelOptionButton: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLevelOption: {
    backgroundColor: '#FF6B35',
    borderColor: '#E55A2B',
  },
  lockedOption: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelOptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  levelOptionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 2,
  },
  lockMessage: {
    fontSize: 12,
    color: '#888',
    textAlign: 'left',
  },
  checkmark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedText: {
    color: '#999',
  },
})

export default MapRegionSelectionScreen

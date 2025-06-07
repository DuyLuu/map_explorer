import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'
import { useCountryStore } from '../../../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from '../../../types/region'
import { getSelectableRegions } from '../../../services/regionService'
import RegionProgressCard from '../../../components/RegionProgressCard'
import { isLevelUnlocked } from '../../../services/quizService'
import BackButton from '../../../components/BackButton'

const MapProgressDetailScreen: React.FC = () => {
  const { selectedLevel, setSelectedLevel, selectedRegion, setSelectedRegion } = useCountryStore()
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

  // Check level unlock status when region changes
  useEffect(() => {
    if (selectedRegion) {
      checkLevelUnlockStatus()
    }
  }, [selectedRegion])

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

  const handleLevelSelect = (level: number) => {
    if (unlockedLevels[level]) {
      setSelectedLevel(level)
    }
  }

  const onConfirm = () => {
    navigation.navigate('MapQuiz')
  }

  const canStart = selectedLevel && selectedRegion && unlockedLevels[selectedLevel]

  const getLevelLockMessage = (level: number): string => {
    if (level === 1) return ''
    if (level === 2) return 'Complete Easy level to unlock'
    if (level === 3) return 'Complete Medium level to unlock'
    return ''
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Box
          row
          centerItems
          spaceBetween
          padding="m"
          style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}
        >
          <BackButton />
          <Box flex centerItems>
            <Text style={styles.title}>Progress Detail</Text>
          </Box>
        </Box>

        {/* Progress for Selected Region */}
        {selectedRegion && (
          <Box marginBottom="xl">
            <Text style={styles.sectionTitle}>
              Your Progress in {REGION_INFO[selectedRegion].displayName}
            </Text>
            <Box style={styles.progressCardsContainer}>
              {levels.map(level => (
                <RegionProgressCard
                  key={level.id}
                  region={selectedRegion}
                  level={level.id}
                  size="small"
                  showDetailedStats={false}
                  onPress={() => handleLevelSelect(level.id)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Difficulty Level Selection */}
        <Box marginBottom="xl">
          <Text style={styles.sectionTitle}>Select Difficulty</Text>
          <Text style={styles.sectionSubtitle}>
            Complete easier levels to unlock harder difficulties
          </Text>
          <Box style={styles.optionsContainer}>
            {levels.map(level => {
              const isUnlocked = unlockedLevels[level.id]
              const isSelected = selectedLevel === level.id

              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelOptionButton,
                    isSelected && styles.selectedLevelOption,
                    !isUnlocked && styles.lockedOption,
                  ]}
                  onPress={() => handleLevelSelect(level.id)}
                  disabled={!isUnlocked}
                >
                  <Box row spaceBetween centerItems>
                    <Text
                      style={[
                        styles.levelOptionName,
                        ...(isSelected ? [styles.selectedText] : []),
                        ...(!isUnlocked ? [styles.lockedText] : []),
                      ]}
                    >
                      {level.name} {!isUnlocked && '🔒'}
                    </Text>
                    {isUnlocked && isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </Box>
                  <Text
                    style={[
                      styles.levelOptionDescription,
                      ...(isSelected ? [styles.selectedText] : []),
                      ...(!isUnlocked ? [styles.lockedText] : []),
                    ]}
                  >
                    {level.description}
                  </Text>
                  {!isUnlocked && (
                    <Text style={styles.lockMessage}>{getLevelLockMessage(level.id)}</Text>
                  )}
                </TouchableOpacity>
              )
            })}
          </Box>
        </Box>

        {/* Detailed Progress for Selected Level */}
        {selectedRegion && selectedLevel && (
          <Box marginBottom="xl">
            <Text style={styles.sectionTitle}>
              {REGION_INFO[selectedRegion].displayName} -{' '}
              {levels.find(l => l.id === selectedLevel)?.name} Level
            </Text>
            <RegionProgressCard
              region={selectedRegion}
              level={selectedLevel}
              size="large"
              showDetailedStats={true}
            />
          </Box>
        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  lockedText: {
    color: '#999',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
    color: '#FF6B35',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressCardsContainer: {
    gap: 12,
    marginHorizontal: 8,
  },
  optionsContainer: {
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
})

export default MapProgressDetailScreen

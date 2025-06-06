import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from '../../../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from '../../../types/region'
import { getSelectableRegions } from '../../../services/regionService'
import RegionProgressCard from '../../../components/RegionProgressCard'
import { isLevelUnlocked } from '../../../services/quizService'
import BackButton from '../../../components/BackButton'
import { Box } from '@duyluu/rn-ui-kit'

const FlagProgressDetailScreen: React.FC = () => {
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

  const regions = [
    REGION_INFO[Region.WORLD],
    ...getSelectableRegions().map(region => REGION_INFO[region]),
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

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
  }

  const onConfirm = () => {
    navigation.navigate('Quiz')
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
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Progress Detail</Text>
          </View>
        </View>

        {/* Progress for Selected Region */}
        {selectedRegion && (
          <Box marginTop="md" style={styles.section}>
            <Text style={styles.sectionTitle}>
              Your Progress in {REGION_INFO[selectedRegion].displayName}
            </Text>
            <View style={styles.progressCardsContainer}>
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
            </View>
          </Box>
        )}

        {/* Difficulty Level Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Difficulty</Text>
          <Text style={styles.sectionSubtitle}>
            Complete easier levels to unlock harder difficulties
          </Text>
          <View style={styles.optionsContainer}>
            {levels.map(level => {
              const isUnlocked = unlockedLevels[level.id]
              const isSelected = selectedLevel === level.id

              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    !isUnlocked && styles.lockedOption,
                  ]}
                  onPress={() => handleLevelSelect(level.id)}
                  disabled={!isUnlocked}
                >
                  <View style={styles.levelHeader}>
                    <Text
                      style={[
                        styles.optionName,
                        isSelected && styles.selectedText,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      {level.name} {!isUnlocked && '🔒'}
                    </Text>
                    {isUnlocked && isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.selectedText,
                      !isUnlocked && styles.lockedText,
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
          </View>
        </View>

        {/* Detailed Progress for Selected Level */}
        {selectedRegion && selectedLevel && (
          <View style={styles.section}>
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
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !canStart && styles.disabledButton]}
        onPress={onConfirm}
        disabled={!canStart}
      >
        <Text style={styles.confirmButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
    marginHorizontal: 8,
  },
  progressCardsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#25A278',
    borderColor: '#1a8c63',
  },
  lockedOption: {
    backgroundColor: '#ccc',
  },
  optionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
  },
  lockedText: {
    color: '#999',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  lockMessage: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#F47D42',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default FlagProgressDetailScreen

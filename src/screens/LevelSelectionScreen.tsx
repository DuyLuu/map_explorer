import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from '../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from '../types/region'
import { getSelectableRegions } from '../services/regionService'

const LevelSelectionScreen: React.FC = () => {
  const { selectedLevel, setSelectedLevel, selectedRegion, setSelectedRegion } = useCountryStore()
  const navigation = useNavigation<any>()

  const levels = [
    { id: 1, name: 'Easy', description: 'Most popular countries' },
    { id: 2, name: 'Medium', description: 'Moderately known countries' },
    { id: 3, name: 'Hard', description: 'Less known countries' },
  ]

  const regions = [
    REGION_INFO[Region.WORLD],
    ...getSelectableRegions().map(region => REGION_INFO[region]),
  ]

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level)
  }

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
  }

  const onConfirm = () => {
    navigation.navigate('Quiz')
  }

  const canStart = selectedLevel && selectedRegion

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quiz Settings</Text>

        {/* Region Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Region</Text>
          <View style={styles.optionsContainer}>
            {regions.map(region => (
              <TouchableOpacity
                key={region.id}
                style={[styles.optionButton, selectedRegion === region.id && styles.selectedOption]}
                onPress={() => handleRegionSelect(region.id)}
              >
                <Text
                  style={[styles.optionName, selectedRegion === region.id && styles.selectedText]}
                >
                  {region.displayName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Level Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Difficulty</Text>
          <View style={styles.optionsContainer}>
            {levels.map(level => (
              <TouchableOpacity
                key={level.id}
                style={[styles.optionButton, selectedLevel === level.id && styles.selectedOption]}
                onPress={() => handleLevelSelect(level.id)}
              >
                <Text
                  style={[styles.optionName, selectedLevel === level.id && styles.selectedText]}
                >
                  {level.name}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    selectedLevel === level.id && styles.selectedText,
                  ]}
                >
                  {level.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginHorizontal: 8,
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

export default LevelSelectionScreen

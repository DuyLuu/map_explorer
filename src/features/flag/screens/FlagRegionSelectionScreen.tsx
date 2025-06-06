import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from '../../../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from '../../../types/region'
import { getSelectableRegions } from '../../../services/regionService'
import RegionOption from '../../../components/RegionOption'
import BackButton from '../../../components/BackButton'

const FlagRegionSelectionScreen: React.FC = () => {
  const { selectedRegion, setSelectedRegion, setQuestionCount } = useCountryStore()
  const navigation = useNavigation<any>()

  // Set default values for flag quiz when screen loads
  useEffect(() => {
    setQuestionCount(10) // Default to 10 questions
  }, [setQuestionCount])

  // All 7 regions for flag quiz
  const regions = getSelectableRegions().map(region => REGION_INFO[region])

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
  }

  const onConfirm = () => {
    navigation.navigate('FlagProgressDetail')
  }

  const canStart = selectedRegion !== undefined

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Flag Quiz</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Select a region to get started</Text>
        <Text style={styles.infoText}>
          Choose your region, then select difficulty level with progressive unlocking!
        </Text>

        {/* Region Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Region</Text>
          <View style={styles.optionsContainer}>
            {regions.map(region => (
              <RegionOption
                key={region.id}
                region={region.id}
                isSelected={selectedRegion === region.id}
                onPress={() => handleRegionSelect(region.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !canStart && styles.disabledButton]}
        onPress={onConfirm}
        disabled={!canStart}
      >
        <Text style={styles.confirmButtonText}>Start Flag Quiz</Text>
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
  placeholder: {
    width: 60, // Same width as back button to center title
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
    minWidth: 180,
  },
  progressButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
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

export default FlagRegionSelectionScreen

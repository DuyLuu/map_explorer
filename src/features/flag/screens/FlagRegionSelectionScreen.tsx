import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from '../../../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from '../../../types/region'
import { getSelectableRegions } from '../../../services/regionService'
import RegionOption from '../../../components/RegionOption'
import BackButton from '../../../components/BackButton'
import { Text } from '../../../components/Text'

const FlagRegionSelectionScreen: React.FC = () => {
  const { selectedRegion, setSelectedRegion } = useCountryStore()
  const navigation = useNavigation<any>()

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
        <BackButton onBack={() => navigation.navigate('MainTabs')} />
        <View style={styles.headerTitleContainer}>
          <Text variant="h3" weight="bold" style={styles.titleColor}>
            Flag Quiz
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text variant="body" muted center marginBottom="s">
          Select a region to get started
        </Text>
        <Text
          variant="bodySmall"
          muted
          center
          marginBottom="xl"
          paddingHorizontal="m"
          style={styles.infoTextStyle}
        >
          Choose your region, then select difficulty level with progressive unlocking!
        </Text>

        {/* Region Selection */}
        <View style={styles.section}>
          <Text
            variant="h5"
            weight="semi-bold"
            center
            marginBottom="m"
            style={styles.sectionTitleColor}
          >
            Choose Your Region
          </Text>
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
        <Text variant="h6" weight="bold" style={styles.buttonText}>
          Start Flag Quiz
        </Text>
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
  titleColor: {
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
  infoTextStyle: {
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleColor: {
    color: '#333',
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
  buttonText: {
    color: '#fff',
  },
})

export default FlagRegionSelectionScreen

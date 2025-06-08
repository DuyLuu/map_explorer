import React, { useEffect } from 'react'
import { StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from 'stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { Region, REGION_INFO } from 'types/region'
import { getSelectableRegions } from 'services/regionService'
import RegionOption from 'components/RegionOption'
import BackButton from 'components/BackButton'
import { Text } from 'components/Text'
import { Box } from 'components/Box'

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
      <Box row centerItems spaceBetween padding="m" style={styles.headerBorder}>
        <BackButton onBack={() => navigation.navigate('MainTabs')} />
        <Box flex centerItems>
          <Text variant="h3" weight="bold" style={styles.titleColor}>
            Flag Quiz
          </Text>
        </Box>
        <Box style={{ width: 40 }} />
      </Box>
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
        <Box marginBottom="xl">
          <Text
            variant="h5"
            weight="semi-bold"
            center
            marginBottom="m"
            style={styles.sectionTitleColor}
          >
            Choose Your Region
          </Text>
          <Box marginHorizontal="xs" style={{ gap: 12 }}>
            {regions.map(region => (
              <RegionOption
                key={region.id}
                region={region.id}
                isSelected={selectedRegion === region.id}
                onPress={() => handleRegionSelect(region.id)}
              />
            ))}
          </Box>
        </Box>
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
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  sectionTitleColor: {
    color: '#333',
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

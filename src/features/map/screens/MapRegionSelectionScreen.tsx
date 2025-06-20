import React, { useEffect } from 'react'
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useCountryStore } from 'stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Region, REGION_INFO } from 'types/region'
import { getSelectableRegions } from 'services/regionService'
import BackButton from 'components/BackButton'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'

import MapRegionOption from '../components/MapRegionOption'

const MapRegionSelectionScreen: React.FC = () => {
  const { selectedRegion, setSelectedRegion } = useCountryStore()
  const navigation = useNavigation<any>()

  // All 7 regions for map quiz
  const regions = getSelectableRegions().map(region => REGION_INFO[region])

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
  }

  const onConfirm = () => {
    navigation.navigate('MapQuiz')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box
        row
        centerItems
        spaceBetween
        padding="m"
        style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}
      >
        <BackButton />
        <Box flex centerItems>
          <Text
            variant="h3"
            weight="bold"
            center
            marginBottom="s"
            marginTop="m"
            style={styles.titleColor}
          >
            Map Quiz
          </Text>
        </Box>
        <Box style={{ width: 40 }} />
      </Box>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text variant="body" muted center marginBottom="s">
          Select region and difficulty level
        </Text>
        <Text
          variant="bodySmall"
          muted
          center
          marginBottom="xl"
          paddingHorizontal="m"
          style={styles.infoTextStyle}
        >
          Progressive difficulty: complete easier levels to unlock harder ones!
        </Text>

        {/* Region Selection */}
        <Box marginBottom="xl">
          <Text
            variant="h5"
            weight="semi-bold"
            center
            marginBottom="l"
            style={styles.sectionTitleColor}
          >
            Choose Your Region
          </Text>
          <Box style={styles.optionsContainer}>
            {regions.map(region => (
              <MapRegionOption
                key={region.id}
                region={region.id}
                isSelected={selectedRegion === region.id}
                onPress={() => handleRegionSelect(region.id)}
                correctAnswers={0}
                totalQuestions={0}
                isUnlocked={true}
              />
            ))}
          </Box>
          {/* Add View Progress Detail button */}
          {selectedRegion && (
            <Button
              variant="primary"
              style={[styles.confirmButton, styles.progressButton]}
              onPress={() => navigation.navigate('MapProgressDetail')}
            >
              <Text variant="body" weight="bold" style={styles.buttonText}>
                View Progress Detail
              </Text>
            </Button>
          )}
        </Box>
      </ScrollView>

      <Button style={[styles.confirmButton]} onPress={onConfirm}>
        <Text variant="body" weight="bold" style={styles.buttonText}>
          Start Map Quiz
        </Text>
      </Button>
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
  titleColor: {
    color: '#FF6B35',
  },
  infoTextStyle: {
    fontStyle: 'italic',
  },
  sectionTitleColor: {
    color: '#333',
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
    elevation: 4,
  },
  progressButton: {
    marginTop: 12,
    marginBottom: 0,
  },
  buttonText: {
    color: '#fff',
  },
})

export default MapRegionSelectionScreen

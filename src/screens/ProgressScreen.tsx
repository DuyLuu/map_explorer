import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useCountryStore } from '../stores/countryStore'
import ProgressStats from '../components/ProgressStats'

const ProgressScreen: React.FC = () => {
  const navigation = useNavigation<any>()
  const { selectedLevel } = useCountryStore()

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Progress Overview</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.progressSection}>
          <ProgressStats
            showOverallProgress={true}
            showRegionBreakdown={true}
            level={selectedLevel || 1}
          />
        </View>
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60, // Same width as back button to center title
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  progressSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 4,
  },
})

export default ProgressScreen

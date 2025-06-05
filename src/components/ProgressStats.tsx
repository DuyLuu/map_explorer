import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Region, REGION_INFO } from '../types/region'
import { getAllRegionProgress } from '../services/quizService'
import { RegionLevelProgress } from '../types/progress'
import ProgressBar from './ProgressBar'

interface ProgressStatsProps {
  showOverallProgress?: boolean
  showRegionBreakdown?: boolean
}

interface OverallStats {
  totalLearned: number
  totalCountries: number
  averageCompletion: number
  regionsStarted: number
  regionsCompleted: number
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  showOverallProgress = true,
  showRegionBreakdown = true,
}) => {
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalLearned: 0,
    totalCountries: 0,
    averageCompletion: 0,
    regionsStarted: 0,
    regionsCompleted: 0,
  })
  const [regionProgress, setRegionProgress] = useState<Record<Region, RegionLevelProgress[]>>(
    {} as Record<Region, RegionLevelProgress[]>
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProgressStats()
  }, [])

  const loadProgressStats = async () => {
    try {
      setIsLoading(true)
      const allProgress = await getAllRegionProgress()

      let totalLearned = 0
      let totalCountries = 0
      let totalCompletion = 0
      let regionsStarted = 0
      let regionsCompleted = 0
      const progressByRegion: Record<Region, RegionLevelProgress[]> = {} as Record<
        Region,
        RegionLevelProgress[]
      >

      // Get all unique levels from the progress keys
      const allLevels = Array.from(
        new Set(
          Object.keys(allProgress)
            .map(key => key.split('_')[1])
            .filter(Boolean)
        )
      )

      Object.values(Region).forEach(region => {
        // Gather all progress objects for this region across all levels
        const regionLevelProgress: RegionLevelProgress[] = allLevels
          .map(level => allProgress[`${region}_${level}`])
          .filter(Boolean)
        progressByRegion[region] = regionLevelProgress

        // Aggregate stats for this region
        let regionLearned = 0
        let regionTotal = 0
        let regionCompletionSum = 0
        let regionLevelsWithProgress = 0
        let regionLevelsCompleted = 0

        regionLevelProgress.forEach(progress => {
          regionLearned += progress.learnedCountries.length
          regionTotal += progress.totalCountries
          regionCompletionSum += progress.completionPercentage
          if (progress.learnedCountries.length > 0) regionLevelsWithProgress++
          if (progress.completionPercentage === 100) regionLevelsCompleted++
        })

        totalLearned += regionLearned
        totalCountries += regionTotal
        totalCompletion += regionCompletionSum
        if (regionLevelsWithProgress > 0) regionsStarted++
        if (regionLevelsCompleted === allLevels.length && allLevels.length > 0) regionsCompleted++
      })

      const totalLevels = allLevels.length
      const regionCount = Object.values(Region).length
      const averageCompletion =
        regionCount > 0 && totalLevels > 0 ? totalCompletion / (regionCount * totalLevels) : 0

      setOverallStats({
        totalLearned,
        totalCountries,
        averageCompletion,
        regionsStarted,
        regionsCompleted,
      })
      setRegionProgress(progressByRegion)
    } catch (error) {
      console.error('Error loading progress stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading progress stats...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {showOverallProgress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Progress</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overallStats.totalLearned}</Text>
              <Text style={styles.statLabel}>Countries Learned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(overallStats.averageCompletion)}%</Text>
              <Text style={styles.statLabel}>Average Completion</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overallStats.regionsStarted}</Text>
              <Text style={styles.statLabel}>Regions Started</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overallStats.regionsCompleted}</Text>
              <Text style={styles.statLabel}>Regions Completed</Text>
            </View>
          </View>

          <ProgressBar
            percentage={overallStats.averageCompletion}
            width={300}
            height={12}
            color="#4CAF50"
            showLabel={true}
            label={`${overallStats.totalLearned} / ${overallStats.totalCountries} total countries`}
            showPercentage={true}
          />
        </View>
      )}

      {showRegionBreakdown && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Region Breakdown</Text>
          <View style={styles.regionsList}>
            {Object.values(Region).map(region => {
              const progressArr = regionProgress[region] || []
              const regionInfo = REGION_INFO[region]
              const learned = progressArr.reduce(
                (sum, p) => sum + (p?.learnedCountries?.length || 0),
                0
              )
              const total = progressArr.reduce((sum, p) => sum + (p?.totalCountries || 0), 0)
              const completionSum = progressArr.reduce(
                (sum, p) => sum + (p?.completionPercentage || 0),
                0
              )
              const levelsCount = progressArr.length
              const percentage = levelsCount > 0 ? completionSum / levelsCount : 0

              return (
                <View key={region} style={styles.regionItem}>
                  <View style={styles.regionHeader}>
                    <Text style={styles.regionName}>{regionInfo.displayName}</Text>
                    <Text style={styles.regionStats}>
                      {learned}/{total}
                    </Text>
                  </View>
                  <ProgressBar
                    percentage={percentage}
                    width={280}
                    height={6}
                    color={percentage === 100 ? '#4CAF50' : percentage > 0 ? '#FF9800' : '#f0f0f0'}
                    showPercentage={false}
                  />
                </View>
              )
            })}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  regionsList: {
    gap: 12,
  },
  regionItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  regionStats: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
})

export default ProgressStats

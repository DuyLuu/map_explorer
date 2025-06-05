import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Region, REGION_INFO } from '../types/region'
import { RegionLevelProgress } from '../types/progress'
import { getRegionLevelProgress } from '../services/quizService'
import ProgressRing from './ProgressRing'
import ProgressBar from './ProgressBar'

interface RegionProgressCardProps {
  region: Region
  level: number
  onPress?: () => void
  showDetailedStats?: boolean
  size?: 'small' | 'medium' | 'large'
}

const RegionProgressCard: React.FC<RegionProgressCardProps> = ({
  region,
  level,
  onPress,
  showDetailedStats = true,
  size = 'medium',
}) => {
  const [progress, setProgress] = useState<RegionLevelProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [region, level])

  const loadProgress = async () => {
    try {
      setIsLoading(true)
      const progressData = await getRegionLevelProgress(region, level)
      setProgress(progressData)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyName = (level: number): string => {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
    return levels[level as keyof typeof levels] || `Level ${level}`
  }

  const getDifficultyColor = (level: number): string => {
    const colors = { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' }
    return colors[level as keyof typeof colors] || '#666'
  }

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return { padding: 12, progressSize: 60 }
      case 'large':
        return { padding: 20, progressSize: 80 }
      default:
        return { padding: 16, progressSize: 70 }
    }
  }

  const cardSize = getCardSize()
  const regionInfo = REGION_INFO[region]
  const percentage = progress?.completionPercentage || 0
  const learnedCount = progress?.learnedCountries.length || 0
  const totalCount = progress?.totalCountries || 0

  const CardContent = () => (
    <View style={[styles.card, { padding: cardSize.padding }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.regionName}>{regionInfo.displayName}</Text>
          <Text style={[styles.difficulty, { color: getDifficultyColor(level) }]}>
            {getDifficultyName(level)}
          </Text>
        </View>
        <ProgressRing
          percentage={percentage}
          size={cardSize.progressSize}
          color={getDifficultyColor(level)}
          textSize={size === 'small' ? 12 : 14}
        />
      </View>

      {showDetailedStats && !isLoading && (
        <View style={styles.statsContainer}>
          <ProgressBar
            percentage={percentage}
            width={150}
            height={6}
            color={getDifficultyColor(level)}
            showLabel={true}
            label={`${learnedCount} / ${totalCount} countries`}
            showPercentage={false}
          />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learnedCount}</Text>
              <Text style={styles.statLabel}>Learned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCount - learnedCount}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress...</Text>
        </View>
      )}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <CardContent />
      </TouchableOpacity>
    )
  }

  return <CardContent />
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  regionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
})

export default RegionProgressCard

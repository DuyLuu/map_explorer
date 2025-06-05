import React, { useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { useLeaderboardStore } from '../stores/leaderboardStore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import BackButton from '../components/BackButton'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const LeaderboardScreen: React.FC = () => {
  const { entries, loadLeaderboard } = useLeaderboardStore()
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.entryContainer}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <View style={styles.entryDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.score}>
          Score: {item.score}/{item.questionCount}
        </Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onBack={() => navigation.navigate('Home')} />
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={() => navigation.navigate('QuestionCount')}
        >
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No scores yet. Play a game!</Text>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newGameButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newGameText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  entryContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  entryDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
})

export default LeaderboardScreen

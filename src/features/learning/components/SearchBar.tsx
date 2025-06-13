import React from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'components/index'
import { Theme } from 'theme/constants'

interface SearchBarProps {
  placeholder?: string
  onSearchChange: (text: string) => void
  value: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search countries...',
  onSearchChange,
  value
}) => {
  const clearSearch = () => {
    onSearchChange('')
  }

  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onSearchChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Icon name="close" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    borderColor: Theme.colors.breakLine,
    borderWidth: 1
  },

  searchIcon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  clearButton: {
    marginLeft: 8
  }
})

export default SearchBar

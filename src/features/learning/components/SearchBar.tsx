import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Box } from 'components/Box'
import { AntDesignIcon } from 'components/Icon'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search countries...',
}) => {
  return (
    <Box
      row
      centerItems
      marginHorizontal="ml"
      marginBottom="m"
      backgroundColor="#f5f5f5"
      borderRadius="sm"
      paddingHorizontal="m"
      paddingVertical="sm"
    >
      <AntDesignIcon name="search1" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <AntDesignIcon name="close" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
  },
})

export default SearchBar

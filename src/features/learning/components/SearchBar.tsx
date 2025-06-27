import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'components/index'
import { Box } from 'components/index'

import { useTheme } from '../../../theme'

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
  const { theme } = useTheme()
  const clearSearch = () => {
    onSearchChange('')
  }

  return (
    <Box
      row
      centerItems
      backgroundColor="parchment"
      borderRadius="md"
      padding="s"
      marginHorizontal="m"
      marginVertical="m"
      borderColor="breakLine"
      borderWidth={1}
    >
      <Icon name="search" size="md" color="subText" marginRight="s" />
      <TextInput
        style={{
          flex: 1,
          fontSize: 16,
          color: theme.colors.text
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subText}
        value={value}
        onChangeText={onSearchChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={{ marginLeft: theme.spacing.xs }}>
          <Icon name="close" size="md" color="subText" />
        </TouchableOpacity>
      )}
    </Box>
  )
}

export default SearchBar

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      components: path.resolve(__dirname, 'src/components'),
      features: path.resolve(__dirname, 'src/features'),
      utils: path.resolve(__dirname, 'src/utils'),
      types: path.resolve(__dirname, 'src/types'),
      services: path.resolve(__dirname, 'src/services'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      navigation: path.resolve(__dirname, 'src/navigation'),
      screens: path.resolve(__dirname, 'src/screens'),
      stores: path.resolve(__dirname, 'src/stores'),
      theme: path.resolve(__dirname, 'src/theme'),
      assets: path.resolve(__dirname, 'src/assets'),
      constants: path.resolve(__dirname, 'src/constants'),
    },
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)

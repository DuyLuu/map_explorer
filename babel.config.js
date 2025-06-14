module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          components: './src/components',
          features: './src/features',
          utils: './src/utils',
          types: './src/types',
          services: './src/services',
          hooks: './src/hooks',
          navigation: './src/navigation',
          screens: './src/screens',
          stores: './src/stores',
          theme: './src/theme',
          assets: './src/assets',
          constants: './src/constants'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
}

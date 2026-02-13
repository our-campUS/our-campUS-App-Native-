module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@api': './src/api',
          '@style': './src/style',
          '@constants': './src/constants',
          '@assets': './assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

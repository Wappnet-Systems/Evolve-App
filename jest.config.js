// module.exports = {
//   preset: "react-native",
//   setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
//   testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
//   transformIgnorePatterns: [
//     "node_modules/(?!(@react-native|react-native|react-native-.*|@react-navigation|@react-native-async-storage|firebase)/)",
//     "node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation)"
//   ],
//   transform: {
//     "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
//   },
//   moduleNameMapper: {
//     '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
//   },
//   setupFiles: [
//     "./jest.setup.js",
//     '@react-native-async-storage/async-storage/jest/async-storage-mock'
//   ],
//   globals: {
//     'ts-jest': {
//       isolatedModules: true,
//     },
//   },
// };
module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation|@react-native-async-storage|firebase|@firebase.*|react-native-reanimated)",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // If you're explicitly mocking Reanimated in some tests, keep this.
    // Otherwise, the transformIgnorePatterns should handle it.
    // 'react-native-reanimated': require.resolve('react-native-reanimated/mock'),
  },
  setupFiles: [
    "./jest.setup.js",
    '@react-native-async-storage/async-storage/jest/async-storage-mock'
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  // It's generally better to let Babel handle module transformation for React Native
  // Remove this unless you have specific reasons and know what you're doing.
  // env: {
  //   test: {
  //     plugins: ['@babel/plugin-transform-modules-commonjs'],
  //   },
  // },
};
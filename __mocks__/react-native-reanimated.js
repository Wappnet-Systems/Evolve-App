const Reanimated = require('react-native-reanimated/mock');

module.exports = {
  ...Reanimated,
  call: jest.fn(),
};

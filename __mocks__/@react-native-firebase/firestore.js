// export default jest.fn(() => ({
//     collection: jest.fn(() => ({
//       where: jest.fn().mockReturnThis(),
//       get: jest.fn().mockResolvedValue({
//         docs: [
//           {
//             id: 'habit1',
//             data: () => ({
//               name: 'Morning Jog',
//               emoji: '🏃‍♂️',
//               description: 'Jog for 30 minutes',
//               time: new Date(),
//               duration: { hours: '0', minutes: '30' },
//               lastCompleted: null,
//               streak: 3,
//             }),
//           },
//         ],
//       }),
//     })),
//   }));
  
jest.mock('@react-native-firebase/firestore', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      collection: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: 'habit1',
              data: () => ({
                name: 'Morning Jog',
                emoji: '🏃‍♂️',
                description: 'Jog for 30 minutes',
                time: new Date(),
                duration: { hours: '0', minutes: '30' },
                lastCompleted: null,
                streak: 3,
              }),
            },
          ],
        }),
      })),
    })),
  }));
  
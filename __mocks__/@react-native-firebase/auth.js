export default () => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { email: 'test@test.com' } })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { email: 'test@test.com' } })),
    signOut: jest.fn(() => Promise.resolve()),
  });
  
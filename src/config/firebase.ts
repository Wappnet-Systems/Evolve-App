import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBUxnH76ZXW5KF5xF9RmGWtbY1xPGVmO0s',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'evolve-3cb23.firebaseapp.com',
        projectId: process.env.FIREBASE_PROJECT_ID || 'evolve-3cb23',
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://evolve-3cb23-default-rtdb.firebaseio.com/',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '1013020519727',
        appId: process.env.FIREBASE_APP_ID || '1:1013020519727:android:cb35cf21140ce9aeea85da',
    });
}

export const db = firestore();

// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY || 'test-api-key',
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'test-auth-domain',
//   projectId: process.env.FIREBASE_PROJECT_ID || 'test-project-id',
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'test-storage-bucket',
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'test-sender-id',
//   appId: process.env.FIREBASE_APP_ID || 'test-app-id',
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app); 

// import { initializeApp, getApps } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {  
//   apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBUxnH76ZXW5KF5xF9RmGWtbY1xPGVmO0s',
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'evolve-3cb23.firebaseapp.com',
//   projectId: process.env.FIREBASE_PROJECT_ID || 'evolve-3cb23',
//   databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://evolve-3cb23-default-rtdb.firebaseio.com/',
//   // storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '1013020519727',
//   appId: process.env.FIREBASE_APP_ID || '1:1013020519727:android:cb35cf21140ce9aeea85da',
// };

// // Ensure Firebase initializes only once
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// export const db = getFirestore(app);


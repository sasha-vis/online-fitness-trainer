import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: import.meta.env.API_KEY,
//   authDomain: import.meta.env.AUTH_DOMAIN,
//   databaseURL: import.meta.env.DATABASE_URL,
//   projectId: import.meta.env.PROJECT_ID,
//   storageBucket: import.meta.env.STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
//   appId: import.meta.env.APP_ID,
// };

const firebaseConfig = {
    apiKey: 'AIzaSyC53tsdLmxYcL7b5cQVsmJkRq2DSpmV-tA',
    authDomain: 'online-fitness-trainer-59d9b.firebaseapp.com',
    databaseURL: 'https://online-fitness-trainer-59d9b-default-rtdb.firebaseio.com',
    projectId: 'online-fitness-trainer-59d9b',
    storageBucket: 'online-fitness-trainer-59d9b.firebasestorage.app',
    messagingSenderId: '569192859632',
    appId: '1:569192859632:web:384db9017bcf4f9358ff35',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

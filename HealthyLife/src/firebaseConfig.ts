import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
   apiKey: "AIzaSyAIKvfL4nuhW3aPYXZJc45lFfAzXflfC7A",
   authDomain: "contador-de-calorias-a94ec.firebaseapp.com",
   projectId: "contador-de-calorias-a94ec",
   storageBucket: "contador-de-calorias-a94ec.firebasestorage.app",
   messagingSenderId: "15378216218",
   appId: "1:15378216218:web:1fce40eba5d8eabfed28a3",
   databaseURL: "https://contador-de-calorias-a94ec-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
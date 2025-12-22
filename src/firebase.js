// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCymcIyz2LsSuVWYZLDjcMZ84SHiLg08vE",
  authDomain: "akademeia-99c61.firebaseapp.com",
  projectId: "akademeia-99c61",
  storageBucket: "akademeia-99c61.firebasestorage.app",
  messagingSenderId: "382963959006",
  appId: "1:382963959006:web:eac46a53895cf67ef96e4f"
};


// ▼▼▼ 수정: app 객체를 export 하도록 변경합니다. ▼▼▼
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// ▲▲▲▲▲▲

// 다른 서비스들은 초기화된 app을 사용하여 설정하고 export 합니다.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
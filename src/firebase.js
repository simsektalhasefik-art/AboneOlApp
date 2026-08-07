import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "BURAYA_KENDİ_API_KEY_DEĞERİNİZİ_YAZIN",
  authDomain: "cebin-pro.firebaseapp.com",
  projectId: "cebin-pro",
  storageBucket: "cebin-pro.appspot.com",
  messagingSenderId: "BURAYA_SENDER_ID",
  appId: "BURAYA_APP_ID"
};

export const app = initializeApp(firebaseConfig);

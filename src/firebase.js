import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCEwn9-z_WS1tZgwv1fCgBe-MBJeu85fU4',
  authDomain: 'cebin-pro.firebaseapp.com',
  projectId: 'cebin-pro',
  storageBucket: 'cebin-pro.firebasestorage.app',
  messagingSenderId: '1046340307501',
  appId: '1:1046340307501:web:ccf2f8c428c6d71efdc6a4'
};

export const app = initializeApp(firebaseConfig);

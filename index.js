import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// Uygulamayı doğrudan web DOM'una kaydet
AppRegistry.registerComponent('main', () => App);
AppRegistry.runApplication('main', {
  rootTag: document.getElementById('root') || document.getElementById('main'),
});

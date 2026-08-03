import { registerRootComponent } from 'expo';
import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('main', { rootTag });
} else {
  registerRootComponent(App);
}

import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  if (App.element) {
    // Web için doğrudan React DOM render tetiklemesi
  }
}

registerRootComponent(App);

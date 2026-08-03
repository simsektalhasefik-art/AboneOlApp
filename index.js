import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent, hem Expo Go/Native hem de Web modunda
// AppEntry ve registerWebModule çakışmalarını engelleyen en güvenli yöntemdir.
registerRootComponent(App);

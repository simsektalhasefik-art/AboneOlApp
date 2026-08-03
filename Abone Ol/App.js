import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import AddModal from './src/components/AddModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [subscriptions, setSubscriptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('@subscriptions');
      if (saved) setSubscriptions(JSON.parse(saved));
    } catch (e) {
      console.log('Veri yükleme hatası', e);
    }
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('@subscriptions', JSON.stringify(data));
    } catch (e) {
      console.log('Veri kaydetme hatası', e);
    }
  };

  const handleAdd = (item) => {
    const updated = [...subscriptions, item];
    setSubscriptions(updated);
    saveData(updated);
  };

  const handleDelete = (id) => {
    const updated = subscriptions.filter(s => s.id !== id);
    setSubscriptions(updated);
    saveData(updated);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {activeTab === 'home' ? (
        <HomeScreen 
          subscriptions={subscriptions} 
          onDelete={handleDelete} 
          onOpenModal={() => setModalVisible(true)} 
        />
      ) : (
        <TimelineScreen subscriptions={subscriptions} />
      )}

      {/* Alt Sekme Navigasyonu */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>📋 Listem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('timeline')}>
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.activeTabText]}>🗺️ Ödeme Haritası</Text>
        </TouchableOpacity>
      </View>

      <AddModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAdd={handleAdd} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1E293B', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#334155' },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { color: '#64748B', fontWeight: 'bold', fontSize: 13 },
  activeTabText: { color: '#38BDF8' }
});
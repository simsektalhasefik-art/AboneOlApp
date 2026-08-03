import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import SubscriptionCard from '../components/SubscriptionCard';
import SummaryCards from '../components/SummaryCards';
import AddModal from '../components/AddModal';
import { servicesData } from '../data/servicesData';

export default function HomeScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, period: 'monthly' },
    { id: '2', name: 'Spotify', price: 45, category: 'Müzik', billingDay: 8, period: 'monthly' },
  ]);

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'analytics'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Aylık Toplam Hesaplama (Yıllık olanları 12'ye böler)
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    const cost = item.period === 'yearly' ? Number(item.price) / 12 : Number(item.price);
    return sum + cost;
  }, 0);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveSubscription = (newSub) => {
    if (editingItem) {
      setSubscriptions(subscriptions.map(s => s.id === editingItem.id ? { ...newSub, id: editingItem.id } : s));
    } else {
      setSubscriptions([...subscriptions, { ...newSub, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AboneOl</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddModal}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SEKME 1: LİSTEM */}
        {activeTab === 'list' && (
          <>
            {/* Özet Kartı */}
            <SummaryCards monthlyTotal={monthlyTotal} />

            <Text style={styles.sectionTitle}>Abonelikleriniz ({subscriptions.length})</Text>

            {/* Abonelik Listesi */}
            {subscriptions.map((item) => (
              <SubscriptionCard
                key={item.id}
                item={item}
                onEdit={() => handleOpenEditModal(item)}
                onDelete={() => handleDeleteSubscription(item.id)}
              />
            ))}
          </>
        )}

        {/* SEKME 2: TASARRUF ANALİZİ */}
        {activeTab === 'analytics' && (
          <View style={styles.analyticsContainer}>
            <Text style={styles.analyticsTitle}>💡 Akıllı Tasarruf Analizi</Text>
            
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsText}>
                • Toplam <Text style={styles.highlight}>{subscriptions.length} aktif aboneliğiniz</Text> bulunuyor.
              </Text>
              <Text style={styles.analyticsText}>
                • Tahmini Yıllık Toplam Harcamanız: <Text style={styles.dangerText}>{(monthlyTotal * 12).toFixed(2)} ₺</Text>
              </Text>
              <Text style={styles.analyticsText}>
                • <Text style={{fontWeight:'bold'}}>Öneri:</Text> Birden fazla dizi/film veya müzik platformu kullanıyorsunuz. Kullanmadıklarınızı dondurarak yılda ortalama <Text style={styles.successText}>~2.000 ₺ - 3.500 ₺</Text> tasarruf edebilirsiniz.
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Alt Sekme Menüsü (Footer Navigation) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.navText, activeTab === 'list' && styles.navTextActive]}>📋 Listem</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>💡 Tasarruf Analizi</Text>
        </TouchableOpacity>
      </View>

      {/* Ekle / Düzenle Modalı */}
      <AddModal
        visible={isModalOpen}
        initialData={editingItem}
        servicesData={servicesData}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSubscription}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1329' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginVertical: 12 },
  
  // Analytics Styles
  analyticsContainer: { marginTop: 20 },
  analyticsTitle: { fontSize: 20, fontWeight: 'bold', color: '#fbbf24', marginBottom: 16 },
  analyticsCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 20 },
  analyticsText: { color: '#cbd5e1', fontSize: 15, lineHeight: 24, marginBottom: 12 },
  highlight: { color: '#38bdf8', fontWeight: 'bold' },
  dangerText: { color: '#ef4444', fontWeight: 'bold' },
  successText: { color: '#4ade80', fontWeight: 'bold' },

  // Bottom Navigation
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  navItem: { paddingHorizontal: 20 },
  navText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  navTextActive: { color: '#38bdf8', fontWeight: 'bold' }
});

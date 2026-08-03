import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, period: 'monthly' },
    { id: '2', name: 'Spotify', price: 45, category: 'Müzik', billingDay: 8, period: 'monthly' },
  ]);

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'analytics'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDay, setFormDay] = useState('');
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPeriod, setFormPeriod] = useState('monthly');

  // Toplam Hesaplama
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    const cost = item.period === 'yearly' ? Number(item.price) / 12 : Number(item.price);
    return sum + cost;
  }, 0);

  const dailyAvg = (monthlyTotal / 30).toFixed(2);
  const weeklyAvg = (monthlyTotal / 4).toFixed(2);

  const openForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name);
      setFormPrice(String(item.price));
      setFormDay(String(item.billingDay));
      setFormCategory(item.category || 'Eğlence');
      setFormPeriod(item.period || 'monthly');
    } else {
      setEditingId(null);
      setFormName('');
      setFormPrice('');
      setFormDay('');
      setFormCategory('Eğlence');
      setFormPeriod('monthly');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;

    if (editingId) {
      setSubscriptions(subscriptions.map(s => s.id === editingId ? {
        ...s,
        name: formName,
        price: Number(formPrice),
        billingDay: Number(formDay) || 1,
        category: formCategory,
        period: formPeriod
      } : s));
    } else {
      setSubscriptions([...subscriptions, {
        id: Date.now().toString(),
        name: formName,
        price: Number(formPrice),
        billingDay: Number(formDay) || 1,
        category: formCategory,
        period: formPeriod
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => setSubscriptions(subscriptions.filter(s => s.id !== id));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Üst Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AboneOl</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SEKME 1: LİSTEM */}
        {activeTab === 'list' && (
          <>
            {/* Özet Paneli */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Aylık Toplam Harcama</Text>
              <Text style={styles.summaryValue}>{monthlyTotal.toFixed(2)} ₺</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Günlük Ort.</Text>
                  <Text style={styles.statValue}>{dailyAvg} ₺</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Haftalık Ort.</Text>
                  <Text style={styles.statValue}>{weeklyAvg} ₺</Text>
                </View>
              </View>
            </View>

            {/* Abonelik Listesi */}
            <Text style={styles.sectionTitle}>Abonelikleriniz ({subscriptions.length})</Text>

            {subscriptions.map((item) => {
              const isYearly = item.period === 'yearly';
              const monthlyDisplayPrice = isYearly ? (Number(item.price) / 12).toFixed(2) : item.price;

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                      <Text style={{ fontSize: 20 }}>💳</Text>
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {item.category || 'Eğlence'} • Ayın {item.billingDay || '1'}. günü
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightSection}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{item.price} ₺</Text>
                      <Text style={styles.periodBadge}>{isYearly ? '/ yıl' : '/ ay'}</Text>
                    </View>
                    
                    {isYearly && (
                      <Text style={styles.monthlyEquivalent}>({monthlyDisplayPrice} ₺/ay)</Text>
                    )}

                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => openForm(item)}>
                        <Text style={{ color: '#60a5fa', fontSize: 12 }}>✏️ Düzenle</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => alert("İptal hatırlatıcı eklendi!")}>
                        <Text style={styles.cancelText}>İptal Et</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                        <Text style={{ color: '#ef4444', fontSize: 12 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* SEKME 2: TASARRUF ANALİZİ */}
        {activeTab === 'analytics' && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fbbf24', marginBottom: 16 }}>💡 Akıllı Tasarruf Analizi</Text>
            <View style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 20 }}>
              <Text style={styles.insightPoint}>
                • Toplam <Text style={{ fontWeight: 'bold', color: '#38bdf8' }}>{subscriptions.length} aktif aboneliğiniz</Text> bulunuyor.
              </Text>
              <Text style={styles.insightPoint}>
                • Yıllık tahmini harcamanız: <Text style={{ fontWeight: 'bold', color: '#ef4444' }}>{(monthlyTotal * 12).toFixed(2)} ₺</Text>
              </Text>
              <Text style={styles.insightPoint}>
                • <Text style={{ fontWeight: 'bold' }}>Öneri:</Text> Birden fazla eğlence veya müzik platformunuz var. Kullanmadıklarınızı dondurarak yılda yaklaşık <Text style={{ fontWeight: 'bold', color: '#4ade80' }}>~2.500 ₺</Text> tasarruf edebilirsiniz.
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Alt Navigasyon Barı */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('list')}>
          <Text style={[styles.navText, activeTab === 'list' && styles.navTextActive]}>📋 Listem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>💡 Tasarruf Analizi</Text>
        </TouchableOpacity>
      </View>

      {/* Ekle / Düzenle Modalı */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Abonelik Bilgilerini Güncelle' : 'Yeni Abonelik Ekle'}</Text>

            <TextInput 
              placeholder="Abonelik Adı (ör: Netflix)" 
              placeholderTextColor="#64748b" 
              style={styles.input}
              value={formName}
              onChangeText={setFormName}
            />

            {/* Aylık / Yıllık Seçimi */}
            <View style={styles.periodSelector}>
              <TouchableOpacity 
                style={[styles.periodOption, formPeriod === 'monthly' && styles.periodActive]}
                onPress={() => setFormPeriod('monthly')}
              >
                <Text style={[styles.periodText, formPeriod === 'monthly' && styles.periodTextActive]}>Aylık Ödeme</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodOption, formPeriod === 'yearly' && styles.periodActive]}
                onPress={() => setFormPeriod('yearly')}
              >
                <Text style={[styles.periodText, formPeriod === 'yearly' && styles.periodTextActive]}>Yıllık Ödeme</Text>
              </TouchableOpacity>
            </View>

            <TextInput 
              placeholder={formPeriod === 'yearly' ? "Yıllık Tutar (₺)" : "Aylık Tutar (₺)"} 
              placeholderTextColor="#64748b" 
              keyboardType="numeric"
              style={styles.input}
              value={formPrice}
              onChangeText={setFormPrice}
            />

            <TextInput 
              placeholder="Ödeme Günü (1-31)" 
              placeholderTextColor="#64748b" 
              keyboardType="numeric"
              style={styles.input}
              value={formDay}
              onChangeText={setFormDay}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setIsModalOpen(false)}>
                <Text style={{ color: '#fff' }}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1329' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  summaryCard: { backgroundColor: '#4f46e5', borderRadius: 16, padding: 20, marginBottom: 16 },
  summaryLabel: { color: '#c7d2fe', fontSize: 14 },
  summaryValue: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 8 },
  statLabel: { color: '#e0e7ff', fontSize: 11 },
  statValue: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  
  // Card
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  periodBadge: { color: '#94a3b8', fontSize: 11 },
  monthlyEquivalent: { color: '#38bdf8', fontSize: 10, marginBottom: 4 },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  editBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },
  cancelBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { color: '#fbbf24', fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },

  // Bottom Navigation
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  navItem: { paddingHorizontal: 20 },
  navText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  navTextActive: { color: '#38bdf8', fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodOption: { flex: 1, padding: 10, backgroundColor: '#0f172a', borderRadius: 8, alignItems: 'center' },
  periodActive: { backgroundColor: '#4f46e5' },
  periodText: { color: '#94a3b8', fontSize: 12 },
  periodTextActive: { color: '#fff', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelModalBtn: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' },
  insightPoint: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, marginBottom: 12 }
});

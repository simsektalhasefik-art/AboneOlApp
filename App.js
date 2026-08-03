import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import SubscriptionCard from './src/components/SubscriptionCard';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 5, period: 'monthly' },
    { id: '2', name: 'Spotify', price: 456, category: 'Müzik', billingDay: 6, period: 'monthly' },
    { id: '3', name: 'Exxen', price: 56, category: 'Eğlence', billingDay: 7, period: 'monthly' },
    { id: '4', name: 'YouTube Premium', price: 567, category: 'Eğlence', billingDay: 15, period: 'monthly' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDay, setFormDay] = useState('');
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPeriod, setFormPeriod] = useState('monthly'); // 'monthly' | 'yearly'

  // Toplam Hesaplama (Yıllık ödemeleri aylığa dönüştürür)
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    const cost = item.period === 'yearly' ? Number(item.price) / 12 : Number(item.price);
    return sum + cost;
  }, 0);

  const dailyAvg = (monthlyTotal / 30).toFixed(2);
  const weeklyAvg = (monthlyTotal / 4).toFixed(2);

  // Ekle veya Düzenle Aç
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
  const handleCancel = (id) => alert("İptal hatırlatıcısı takviminize eklendi!");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Üst Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AboneOl</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.insightBtn} onPress={() => setIsInsightModalOpen(true)}>
            <Ionicons name="analytics" size={18} color="#fbbf24" />
            <Text style={styles.insightBtnText}>Tasarruf Analizi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
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

        {/* Liste */}
        <Text style={styles.sectionTitle}>Abonelikleriniz ({subscriptions.length})</Text>

        {subscriptions.map((item) => (
          <SubscriptionCard 
            key={item.id} 
            item={item} 
            onDelete={handleDelete}
            onCancel={handleCancel}
            onEdit={openForm}
          />
        ))}

      </ScrollView>

      {/* 📝 Ekleme / Güncelleme Modalı */}
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

            {/* Ödeme Periyodu Seçimi */}
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
                <Text style={{color: '#fff'}}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 💡 Tasarruf Analizi Modalı */}
      <Modal visible={isInsightModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{flexDirection:'row', alignItems:'center', gap: 8, marginBottom: 12}}>
              <Ionicons name="bulb" size={24} color="#fbbf24" />
              <Text style={styles.modalTitle}>Akıllı Tasarruf Analizi</Text>
            </View>

            <Text style={styles.insightPoint}>
              • Toplam <Text style={{fontWeight:'bold', color:'#38bdf8'}}>{subscriptions.length} aktif aboneliğiniz</Text> bulunuyor.
            </Text>

            <Text style={styles.insightPoint}>
              • Yıllık toplam harcamanız yaklaşık <Text style={{fontWeight:'bold', color:'#ef4444'}}>{(monthlyTotal * 12).toFixed(2)} ₺</Text> seviyesinde.
            </Text>

            <Text style={styles.insightPoint}>
              • Dizi/Film platformlarına (Netflix, Exxen vb.) aylık yüksek bütçe ayırıyorsunuz. Kullanmadıklarınızı dondurarak yılda <Text style={{fontWeight:'bold', color:'#4ade80'}}>~2.500 ₺</Text> tasarruf edebilirsiniz.
            </Text>

            <TouchableOpacity style={styles.closeInsightBtn} onPress={() => setIsInsightModalOpen(false)}>
              <Text style={{color:'#fff', fontWeight:'bold'}}>Anlaşıldı</Text>
            </TouchableOpacity>
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
  headerActions: { flexDirection: 'row', gap: 8 },
  insightBtn: { backgroundColor: '#1e1b4b', borderColor: '#4338ca', borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  insightBtnText: { color: '#fbbf24', fontWeight: '600', fontSize: 12 },
  addBtn: { backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  addBtnText: { color: '#ffffff', fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryCard: { backgroundColor: '#4f46e5', borderRadius: 16, padding: 20, marginBottom: 16 },
  summaryLabel: { color: '#c7d2fe', fontSize: 14 },
  summaryValue: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 8 },
  statLabel: { color: '#e0e7ff', fontSize: 11 },
  statValue: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 12 },
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
  insightPoint: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  closeInsightBtn: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 }
});

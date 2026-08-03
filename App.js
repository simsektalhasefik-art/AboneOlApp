import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, period: 'monthly' },
    { id: '2', name: 'Spotify', price: 45, category: 'Müzik', billingDay: 8, period: 'monthly' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
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

  // Dinamik Logo Çekici
  const renderLogo = (name) => {
    const cleanName = (name || '').toLowerCase().trim();

    if (cleanName.includes('spotify')) {
      return <FontAwesome5 name="spotify" size={24} color="#1DB954" />;
    }
    if (cleanName.includes('netflix')) {
      return <MaterialCommunityIcons name="netflix" size={28} color="#E50914" />;
    }
    if (cleanName.includes('youtube')) {
      return <FontAwesome5 name="youtube" size={22} color="#FF0000" />;
    }
    if (cleanName.includes('exxen')) {
      return <MaterialCommunityIcons name="play-box" size={26} color="#FACC15" />;
    }
    if (cleanName.includes('amazon') || cleanName.includes('prime')) {
      return <FontAwesome5 name="amazon" size={22} color="#00A8E1" />;
    }
    if (cleanName.includes('icloud') || cleanName.includes('apple')) {
      return <FontAwesome5 name="apple" size={24} color="#A2AAAD" />;
    }

    return <Ionicons name="card-outline" size={24} color="#6366f1" />;
  };

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

        {subscriptions.map((item) => {
          const isYearly = item.period === 'yearly';
          const monthlyDisplayPrice = isYearly ? (Number(item.price) / 12).toFixed(2) : item.price;

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                  {renderLogo(item.name)}
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {item.category || 'Genel'} • Ayın {item.billingDay || '1'}. günü
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
                    <Ionicons name="pencil-outline" size={16} color="#60a5fa" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => alert("İptal hatırlatıcısı eklendi!")}>
                    <Text style={styles.cancelText}>İptal Et</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

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

            {/* Ödeme Periyodu Seçimi (Aylık / Yıllık) */}
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
  
  // Card
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 46, height: 46, borderRadius: 10, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  periodBadge: { color: '#94a3b8', fontSize: 11 },
  monthlyEquivalent: { color: '#38bdf8', fontSize: 10, marginBottom: 4 },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  editBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },
  cancelBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { color: '#fbbf24', fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },

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
  insightPoint: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  closeInsightBtn: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 }
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Linking, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Popüler Servis Tanımları (Logo, Kategori ve İptal Sayfası Linkleri ile)
const POPULAR_SERVICES = [
  { name: 'Netflix', price: 345, category: 'Eğlence', logo: 'https://logo.clearbit.com/netflix.com', cancelUrl: 'https://www.netflix.com/youraccount' },
  { name: 'Exxen', price: 160, category: 'Eğlence', logo: 'https://logo.clearbit.com/exxen.com', cancelUrl: 'https://www.exxen.com/tr/account' },
  { name: 'YouTube Premium', price: 79, category: 'Eğlence', logo: 'https://logo.clearbit.com/youtube.com', cancelUrl: 'https://www.youtube.com/paid_memberships' },
  { name: 'Spotify', price: 59, category: 'Müzik', logo: 'https://logo.clearbit.com/spotify.com', cancelUrl: 'https://www.spotify.com/account/overview/' },
  { name: 'Prime Video', price: 39, category: 'Eğlence', logo: 'https://logo.clearbit.com/primevideo.com', cancelUrl: 'https://www.amazon.com.tr/mc/manage' },
  { name: 'iCloud', price: 30, category: 'Depolama', logo: 'https://logo.clearbit.com/apple.com', cancelUrl: 'https://support.apple.com/HT207594' },
  { name: 'ChatGPT Plus', price: 650, category: 'Yapay Zeka', logo: 'https://logo.clearbit.com/openai.com', cancelUrl: 'https://chatgpt.com/#settings' },
];

const CATEGORIES = ['Eğlence', 'Müzik', 'Depolama', 'Yazılım & AI', 'Spor', 'Diğer'];

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, period: 'monthly', cancelUrl: 'https://www.netflix.com/youraccount', logo: 'https://logo.clearbit.com/netflix.com' },
    { id: '2', name: 'YouTube Premium', price: 79, category: 'Eğlence', billingDay: 15, period: 'monthly', cancelUrl: 'https://www.youtube.com/paid_memberships', logo: 'https://logo.clearbit.com/youtube.com' },
  ]);

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'calendar' | 'analytics'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDay, setFormDay] = useState('1');
  const [formMonth, setFormMonth] = useState('1');
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [formCancelUrl, setFormCancelUrl] = useState('');
  const [formLogo, setFormLogo] = useState('');

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];

  // Aylık Toplam Harcama Hesaplama
  const monthlyTotal = safeList.reduce((sum, item) => {
    if (!item) return sum;
    const cost = item.period === 'yearly' ? Number(item.price || 0) / 12 : Number(item.price || 0);
    return sum + cost;
  }, 0);

  const dailyAvg = (monthlyTotal / 30).toFixed(2);
  const weeklyAvg = (monthlyTotal / 4).toFixed(2);

  const openForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');
      setFormPrice(String(item.price || ''));
      setFormDay(String(item.billingDay || '1'));
      setFormMonth(String(item.billingMonth || '1'));
      setFormCategory(item.category || 'Eğlence');
      setFormPeriod(item.period || 'monthly');
      setFormCancelUrl(item.cancelUrl || '');
      setFormLogo(item.logo || '');
    } else {
      setEditingId(null);
      setFormName('');
      setFormPrice('');
      setFormDay('1');
      setFormMonth('1');
      setFormCategory('Eğlence');
      setFormPeriod('monthly');
      setFormCancelUrl('');
      setFormLogo('');
    }
    setIsModalOpen(true);
  };

  const selectPopularService = (service) => {
    setFormName(service.name);
    setFormPrice(String(service.price));
    setFormCategory(service.category);
    setFormCancelUrl(service.cancelUrl);
    setFormLogo(service.logo);
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;

    const logoUrl = formLogo || `https://logo.clearbit.com/${formName.toLowerCase().replace(/\s+/g, '')}.com`;

    const subData = {
      name: formName,
      price: Number(formPrice),
      billingDay: Number(formDay) || 1,
      billingMonth: Number(formMonth) || 1,
      category: formCategory,
      period: formPeriod,
      cancelUrl: formCancelUrl || `https://www.google.com/search?q=${formName}+iptal+et`,
      logo: logoUrl,
    };

    if (editingId) {
      setSubscriptions(safeList.map(s => s.id === editingId ? { ...subData, id: editingId } : s));
    } else {
      setSubscriptions([...safeList, { ...subData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => setSubscriptions(safeList.filter(s => s.id !== id));

  const handleOpenCancelPage = (url) => {
    if (url) Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AboneOl</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* TAB 1: LİSTEM */}
        {activeTab === 'list' && (
          <>
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

            <Text style={styles.sectionTitle}>Abonelikleriniz ({safeList.length})</Text>

            {safeList.map((item) => {
              const isYearly = item.period === 'yearly';
              const monthlyDisplayPrice = isYearly ? (Number(item.price) / 12).toFixed(2) : item.price;

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.leftSection}>
                    <Image 
                      source={{ uri: item.logo }} 
                      style={styles.logoImage}
                      defaultSource={{ uri: 'https://via.placeholder.com/40' }}
                    />
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {item.category || 'Eğlence'} • {isYearly ? `${item.billingDay}/${item.billingMonth} Tarihinde` : `Ayın ${item.billingDay}. günü`}
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
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => handleOpenCancelPage(item.cancelUrl)}>
                        <Text style={styles.cancelText}>İptal Et 🔗</Text>
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

        {/* TAB 2: TAKVİM EKRANI */}
        {activeTab === 'calendar' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#38bdf8', marginBottom: 16 }}>📅 Ödeme Takvimi</Text>
            <View style={styles.calendarGrid}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const daySubs = safeList.filter(s => Number(s.billingDay) === day);
                return (
                  <View key={day} style={[styles.calendarDayBox, daySubs.length > 0 && styles.activeDayBox]}>
                    <Text style={styles.dayNumber}>{day}</Text>
                    {daySubs.map(s => (
                      <View key={s.id} style={styles.daySubBadge}>
                        <Text style={styles.daySubText} numberOfLines={1}>{s.name}</Text>
                        <Text style={styles.daySubPrice}>{s.price}₺</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 3: TASARRUF ANALİZİ */}
        {activeTab === 'analytics' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fbbf24', marginBottom: 16 }}>💡 Akıllı Tasarruf Analizi</Text>
            <View style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 20 }}>
              <Text style={styles.insightPoint}>
                • Toplam <Text style={{ fontWeight: 'bold', color: '#38bdf8' }}>{safeList.length} aktif aboneliğiniz</Text> bulunuyor.
              </Text>
              <Text style={styles.insightPoint}>
                • Yıllık tahmini harcamanız: <Text style={{ fontWeight: 'bold', color: '#ef4444' }}>{(monthlyTotal * 12).toFixed(2)} ₺</Text>
              </Text>
              <Text style={styles.insightPoint}>
                • <Text style={{ fontWeight: 'bold' }}>Öneri:</Text> Birden fazla platform aboneliğiniz var. Kullanmadıklarınızı dondurarak yılda yaklaşık <Text style={{ fontWeight: 'bold', color: '#4ade80' }}>~2.500 ₺</Text> tasarruf edebilirsiniz.
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
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('calendar')}>
          <Text style={[styles.navText, activeTab === 'calendar' && styles.navTextActive]}>📅 Takvim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>💡 Analiz</Text>
        </TouchableOpacity>
      </View>

      {/* Ekle / Düzenle Modalı */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Abonelik Bilgilerini Güncelle' : 'Yeni Abonelik Ekle'}</Text>

            {/* Hızlı Servis Önerileri */}
            {!editingId && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.fieldLabel}>Hızlı Ekle (Popüler Servisler):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  {POPULAR_SERVICES.map((s, idx) => (
                    <TouchableOpacity key={idx} style={styles.chipBtn} onPress={() => selectPopularService(s)}>
                      <Text style={styles.chipText}>{s.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.fieldLabel}>Abonelik Adı:</Text>
            <TextInput 
              placeholder="ör: Netflix" 
              placeholderTextColor="#64748b" 
              style={styles.input}
              value={formName}
              onChangeText={setFormName}
            />

            {/* Kategori Seçim Listesi */}
            <Text style={styles.fieldLabel}>Kategori:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryChip, formCategory === cat && styles.categoryChipActive]}
                  onPress={() => setFormCategory(cat)}
                >
                  <Text style={[styles.categoryText, formCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Aylık / Yıllık Ödeme Periyodu */}
            <Text style={styles.fieldLabel}>Ödeme Periyodu:</Text>
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

            <Text style={styles.fieldLabel}>{formPeriod === 'yearly' ? "Yıllık Tutar (₺):" : "Aylık Tutar (₺):"}</Text>
            <TextInput 
              placeholder="0.00" 
              placeholderTextColor="#64748b" 
              keyboardType="numeric"
              style={styles.input}
              value={formPrice}
              onChangeText={setFormPrice}
            />

            {/* Yenileme Tarihi / Ödeme Günü */}
            {formPeriod === 'monthly' ? (
              <>
                <Text style={styles.fieldLabel}>Ödeme Günü (Ayın kaçıncı günü: 1-31):</Text>
                <TextInput 
                  placeholder="ör: 15" 
                  placeholderTextColor="#64748b" 
                  keyboardType="numeric"
                  style={styles.input}
                  value={formDay}
                  onChangeText={setFormDay}
                />
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Yenileme Tarihi (Gün ve Ay):</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput 
                    placeholder="Gün (1-31)" 
                    placeholderTextColor="#64748b" 
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                    value={formDay}
                    onChangeText={setFormDay}
                  />
                  <TextInput 
                    placeholder="Ay (1-12)" 
                    placeholderTextColor="#64748b" 
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                    value={formMonth}
                    onChangeText={setFormMonth}
                  />
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setIsModalOpen(false)}>
                <Text style={{ color: '#fff' }}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  
  // Card Styles
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoImage: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#0f172a' },
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

  // Calendar
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calendarDayBox: { width: '13%', height: 75, backgroundColor: '#1e293b', borderRadius: 6, padding: 4 },
  activeDayBox: { borderWidth: 1, borderColor: '#6366f1', backgroundColor: '#1e1b4b' },
  dayNumber: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  daySubBadge: { backgroundColor: '#4f46e5', borderRadius: 4, padding: 2, marginTop: 2 },
  daySubText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  daySubPrice: { color: '#38bdf8', fontSize: 8 },

  // Bottom Navigation
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  navItem: { paddingHorizontal: 16 },
  navText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  navTextActive: { color: '#38bdf8', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginVertical: 40 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  fieldLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  chipBtn: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  chipText: { color: '#38bdf8', fontSize: 12, fontWeight: '600' },
  categoryChip: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#6366f1' },
  categoryText: { color: '#94a3b8', fontSize: 12 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodOption: { flex: 1, padding: 10, backgroundColor: '#0f172a', borderRadius: 8, alignItems: 'center' },
  periodActive: { backgroundColor: '#4f46e5' },
  periodText: { color: '#94a3b8', fontSize: 12 },
  periodTextActive: { color: '#fff', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelModalBtn: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' },
  insightPoint: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, marginBottom: 12 }
});

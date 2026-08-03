import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Linking, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.netflix.com/youraccount', logo: 'https://logo.clearbit.com/netflix.com' },
    { id: '2', name: 'YouTube Premium', price: 79, category: 'Eğlence', billingDay: 15, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.youtube.com/paid_memberships', logo: 'https://logo.clearbit.com/youtube.com' },
    { id: '3', name: 'ChatGPT Plus', price: 1250, category: 'Yazılım & AI', billingDay: 12, billingMonth: 8, billingYear: 2026, period: 'yearly', cancelUrl: 'https://chatgpt.com/#settings', logo: 'https://logo.clearbit.com/openai.com' }
  ]);

  const [activeTab, setActiveTab] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Takvim Gezinme State'leri (Başlangıç: Ağustos 2026)
  const [calMonth, setCalMonth] = useState(7); // 0-indexed (7 = Ağustos)
  const [calYear, setCalYear] = useState(2026);
  const [calendarViewMode, setCalendarViewMode] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'
  const [selectedDayForDaily, setSelectedDayForDaily] = useState(1);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDay, setFormDay] = useState('1');
  const [formMonth, setFormMonth] = useState('8');
  const [formYear, setFormYear] = useState('2026');
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [formCancelUrl, setFormCancelUrl] = useState('');
  const [formLogo, setFormLogo] = useState('');

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];

  // Aylık Toplam Harcama
  const monthlyTotal = safeList.reduce((sum, item) => {
    if (!item) return sum;
    const cost = item.period === 'yearly' ? Number(item.price || 0) / 12 : Number(item.price || 0);
    return sum + cost;
  }, 0);

  // Yıllık Harcama & Kategori Kırılımı Hesaplama
  const yearlyCategoryStats = safeList.reduce((acc, item) => {
    const cat = item.category || 'Diğer';
    const yearlyCost = item.period === 'yearly' ? Number(item.price || 0) : Number(item.price || 0) * 12;
    acc[cat] = (acc[cat] || 0) + yearlyCost;
    return acc;
  }, {});

  const totalYearlyExpense = Object.values(yearlyCategoryStats).reduce((a, b) => a + b, 0);

  // Takvim Okları İle Gezinme (Ocak 2025 - Aralık 2030)
  const handlePrevMonth = () => {
    if (calYear === 2025 && calMonth === 0) return; // Sınır: Jan 2025
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calYear === 2030 && calMonth === 11) return; // Sınır: Dec 2030
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const openForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');
      setFormPrice(String(item.price || ''));
      setFormDay(String(item.billingDay || '1'));
      setFormMonth(String(item.billingMonth || '8'));
      setFormYear(String(item.billingYear || '2026'));
      setFormCategory(item.category || 'Eğlence');
      setFormPeriod(item.period || 'monthly');
      setFormCancelUrl(item.cancelUrl || '');
      setFormLogo(item.logo || '');
    } else {
      setEditingId(null);
      setFormName('');
      setFormPrice('');
      setFormDay('1');
      setFormMonth('8');
      setFormYear('2026');
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
      billingYear: Number(formYear) || 2026,
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

  // Takvim filtreleme mantığı
  const isSubActiveOnDay = (sub, day) => {
    if (sub.period === 'monthly') {
      return Number(sub.billingDay) === day;
    } else {
      // Yıllık ise sadece ilgili ay ve yılda veya seçili ayın o gününde
      return Number(sub.billingDay) === day && (Number(sub.billingMonth) === (calMonth + 1));
    }
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
                  <Text style={styles.statValue}>{(monthlyTotal / 30).toFixed(2)} ₺</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Haftalık Ort.</Text>
                  <Text style={styles.statValue}>{(monthlyTotal / 4).toFixed(2)} ₺</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Abonelikleriniz ({safeList.length})</Text>

            {safeList.map((item) => {
              const isYearly = item.period === 'yearly';
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.leftSection}>
                    <Image source={{ uri: item.logo }} style={styles.logoImage} />
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {item.category} • {isYearly ? `${item.billingDay}/${item.billingMonth}/${item.billingYear}` : `Ayın ${item.billingDay}. günü`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightSection}>
                    <Text style={styles.price}>{item.price} ₺ {isYearly ? '/ yıl' : '/ ay'}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => openForm(item)}>
                        <Text style={{ color: '#60a5fa', fontSize: 11 }}>✏️ Düzenle</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => item.cancelUrl && Linking.openURL(item.cancelUrl)}>
                        <Text style={styles.cancelText}>İptal Et 🔗</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                        <Text style={{ color: '#ef4444', fontSize: 11 }}>🗑️</Text>
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
            {/* Ay/Yıl Başlığı ve Oklar */}
            <View style={styles.calendarHeaderNav}>
              <TouchableOpacity style={styles.arrowBtn} onPress={handlePrevMonth}>
                <Text style={styles.arrowText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.calendarTitleText}>
                📅 {MONTH_NAMES[calMonth]} {calYear}
              </Text>
              <TouchableOpacity style={styles.arrowBtn} onPress={handleNextMonth}>
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Görünüm Modu Seçici (Günlük / Haftalık / Aylık) */}
            <View style={styles.viewModeContainer}>
              {['daily', 'weekly', 'monthly'].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.viewModeBtn, calendarViewMode === mode && styles.viewModeBtnActive]}
                  onPress={() => setCalendarViewMode(mode)}
                >
                  <Text style={[styles.viewModeText, calendarViewMode === mode && styles.viewModeTextActive]}>
                    {mode === 'daily' ? 'Günlük' : mode === 'weekly' ? 'Haftalık' : 'Aylık'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* AYLIK GÖRÜNÜM */}
            {calendarViewMode === 'monthly' && (
              <View style={styles.calendarGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));
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
            )}

            {/* HAFTALIK GÖRÜNÜM */}
            {calendarViewMode === 'weekly' && (
              <View style={{ gap: 8 }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>1 - 7 {MONTH_NAMES[calMonth]} Haftası Ödemeleri:</Text>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
                  const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));
                  return (
                    <View key={day} style={styles.weeklyRow}>
                      <Text style={styles.weeklyDayText}>{day} {MONTH_NAMES[calMonth]}</Text>
                      <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
                        {daySubs.length > 0 ? daySubs.map(s => (
                          <View key={s.id} style={styles.daySubBadge}>
                            <Text style={styles.daySubText}>{s.name} ({s.price}₺)</Text>
                          </View>
                        )) : <Text style={{ color: '#475569', fontSize: 11 }}>Ödeme yok</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* GÜNLÜK GÖRÜNÜM */}
            {calendarViewMode === 'daily' && (
              <View>
                <Text style={{ color: '#94a3b8', marginBottom: 8 }}>Gün Seçin:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <TouchableOpacity
                      key={day}
                      style={[styles.daySelectorChip, selectedDayForDaily === day && styles.daySelectorChipActive]}
                      onPress={() => setSelectedDayForDaily(day)}
                    >
                      <Text style={{ color: '#fff', fontSize: 12 }}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={{ backgroundColor: '#1e293b', padding: 16, borderRadius: 12 }}>
                  <Text style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: 10 }}>
                    {selectedDayForDaily} {MONTH_NAMES[calMonth]} {calYear} Detayı:
                  </Text>
                  {safeList.filter(s => isSubActiveOnDay(s, selectedDayForDaily)).map(s => (
                    <View key={s.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                      <Text style={{ color: '#fff' }}>{s.name} ({s.category})</Text>
                      <Text style={{ color: '#4ade80', fontWeight: 'bold' }}>{s.price} ₺</Text>
                    </View>
                  ))}
                  {safeList.filter(s => isSubActiveOnDay(s, selectedDayForDaily)).length === 0 && (
                    <Text style={{ color: '#64748b' }}>Bu gün için planlanmış ödeme bulunmuyor.</Text>
                  )}
                </View>
              </View>
            )}

          </View>
        )}

        {/* TAB 3: TASARRUF & YILLIK KATEGORİ ANALİZİ */}
        {activeTab === 'analytics' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fbbf24', marginBottom: 16 }}>📊 Yıllık & Kategori Harcama Analizi</Text>

            {/* Toplam Yıllık Özet */}
            <View style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>Toplam Tahmini Yıllık Harcama</Text>
              <Text style={{ color: '#4ade80', fontSize: 28, fontWeight: 'bold', marginVertical: 4 }}>
                {totalYearlyExpense.toFixed(2)} ₺ / yıl
              </Text>
            </View>

            {/* Kategorilere Göre Dağılım */}
            <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Kategori Bazlı Yıllık Harcamalar:</Text>
            {Object.keys(yearlyCategoryStats).map((cat) => {
              const amount = yearlyCategoryStats[cat];
              const percentage = totalYearlyExpense > 0 ? ((amount / totalYearlyExpense) * 100).toFixed(1) : 0;

              return (
                <View key={cat} style={styles.categoryCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{cat}</Text>
                    <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>{amount.toFixed(2)} ₺ (%{percentage})</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                  </View>
                </View>
              );
            })}
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
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>📊 Analiz</Text>
        </TouchableOpacity>
      </View>

      {/* Ekle / Düzenle Modalı */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Abonelik Bilgilerini Güncelle' : 'Yeni Abonelik Ekle'}</Text>

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

            {/* Gün, Ay ve Yıl Kutucukları */}
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
                <Text style={styles.fieldLabel}>Yenileme Tarihi (Gün, Ay ve Yıl):</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
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
                  <TextInput 
                    placeholder="Yıl (ör: 2026)" 
                    placeholderTextColor="#64748b" 
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                    value={formYear}
                    onChangeText={setFormYear}
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
  
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoImage: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#0f172a' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  price: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  editBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },
  cancelBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { color: '#fbbf24', fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },

  // Calendar Header Nav
  calendarHeaderNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calendarTitleText: { fontSize: 18, fontWeight: 'bold', color: '#38bdf8' },
  arrowBtn: { backgroundColor: '#1e293b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  arrowText: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' },

  // View Mode
  viewModeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  viewModeBtn: { flex: 1, paddingVertical: 8, backgroundColor: '#1e293b', borderRadius: 8, alignItems: 'center' },
  viewModeBtnActive: { backgroundColor: '#6366f1' },
  viewModeText: { color: '#94a3b8', fontSize: 12 },
  viewModeTextActive: { color: '#fff', fontWeight: 'bold' },

  // Calendar Monthly Grid
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calendarDayBox: { width: '13%', height: 70, backgroundColor: '#1e293b', borderRadius: 6, padding: 4 },
  activeDayBox: { borderWidth: 1, borderColor: '#6366f1', backgroundColor: '#1e1b4b' },
  dayNumber: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  daySubBadge: { backgroundColor: '#4f46e5', borderRadius: 4, padding: 2, marginTop: 2 },
  daySubText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  daySubPrice: { color: '#38bdf8', fontSize: 8 },

  // Weekly & Daily
  weeklyRow: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  weeklyDayText: { color: '#94a3b8', fontSize: 12, width: 80 },
  daySelectorChip: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 6 },
  daySelectorChipActive: { backgroundColor: '#6366f1' },

  // Analytics Categories
  categoryCard: { backgroundColor: '#1e293b', padding: 12, borderRadius: 10, marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: '#0f172a', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#38bdf8', borderRadius: 3 },

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
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' }
});

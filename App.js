import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const POPULAR_SERVICES = [
  { name: 'Netflix', price: 345, category: 'Eğlence', color: '#E50914', cancelUrl: 'https://www.netflix.com/youraccount' },
  { name: 'Exxen', price: 160, category: 'Eğlence', color: '#FACC15', cancelUrl: 'https://www.exxen.com/tr/account' },
  { name: 'YouTube Premium', price: 79, category: 'Eğlence', color: '#FF0000', cancelUrl: 'https://www.youtube.com/paid_memberships' },
  { name: 'Spotify', price: 59, category: 'Müzik', color: '#1DB954', cancelUrl: 'https://www.spotify.com/account/overview/' },
  { name: 'Prime Video', price: 39, category: 'Eğlence', color: '#00A8E1', cancelUrl: 'https://www.amazon.com.tr/mc/manage' },
  { name: 'iCloud', price: 30, category: 'Depolama', color: '#38BDF8', cancelUrl: 'https://support.apple.com/HT207594' },
  { name: 'ChatGPT Plus', price: 650, category: 'Yazılım & AI', color: '#10A37F', cancelUrl: 'https://chatgpt.com/#settings' },
];

const CATEGORIES = ['Eğlence', 'Müzik', 'Depolama', 'Yazılım & AI', 'Spor', 'Diğer'];

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const getServiceColor = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('netflix')) return '#E50914';
  if (lower.includes('spotify')) return '#1DB954';
  if (lower.includes('youtube')) return '#FF0000';
  if (lower.includes('exxen')) return '#FACC15';
  if (lower.includes('chatgpt') || lower.includes('openai')) return '#10A37F';
  if (lower.includes('prime') || lower.includes('amazon')) return '#00A8E1';
  if (lower.includes('icloud') || lower.includes('apple')) return '#38BDF8';
  return '#6366F1';
};

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.netflix.com/youraccount', color: '#E50914' },
    { id: '2', name: 'YouTube Premium', price: 79, category: 'Eğlence', billingDay: 15, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.youtube.com/paid_memberships', color: '#FF0000' },
    { id: '3', name: 'ChatGPT Plus', price: 650, category: 'Yazılım & AI', billingDay: 12, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://chatgpt.com/#settings', color: '#10A37F' },
    { id: '4', name: 'Spotify', price: 59, category: 'Müzik', billingDay: 1, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.spotify.com/account/overview/', color: '#1DB954' }
  ]);

  const [activeTab, setActiveTab] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [calMonth, setCalMonth] = useState(7); // Ağustos
  const [calYear, setCalYear] = useState(2026);
  const [calendarViewMode, setCalendarViewMode] = useState('daily');

  const [selectedAnalysisYear, setSelectedAnalysisYear] = useState(2026);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDay, setFormDay] = useState('1');
  const [formMonth, setFormMonth] = useState('8');
  const [formYear, setFormYear] = useState('2026');
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [formCancelUrl, setFormCancelUrl] = useState('');
  const [formColor, setFormColor] = useState('#6366F1');

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];

  const monthlyTotal = safeList.reduce((sum, item) => {
    if (!item) return sum;
    const cost = item.period === 'yearly' ? Number(item.price || 0) / 12 : Number(item.price || 0);
    return sum + cost;
  }, 0);

  const calculateMonthTotal = (monthIndex, year) => {
    return safeList.reduce((sum, item) => {
      if (item.period === 'monthly') {
        return sum + Number(item.price || 0);
      } else if (item.period === 'yearly') {
        const subMonth = Number(item.billingMonth || 1) - 1;
        const subYear = Number(item.billingYear || 2026);
        if (subMonth === monthIndex && subYear === year) {
          return sum + Number(item.price || 0);
        }
      }
      return sum;
    }, 0);
  };

  const currentCalMonthTotal = calculateMonthTotal(calMonth, calYear);

  const getMonthlyBreakdownForYear = (targetYear) => {
    const monthlyData = Array(12).fill(0);
    safeList.forEach(sub => {
      const price = Number(sub.price || 0);
      if (sub.period === 'monthly') {
        for (let m = 0; m < 12; m++) monthlyData[m] += price;
      } else if (sub.period === 'yearly') {
        const subMonthIndex = Number(sub.billingMonth || 1) - 1;
        const subYear = Number(sub.billingYear || 2026);
        if (subYear === targetYear) monthlyData[subMonthIndex] += price;
      }
    });
    return monthlyData;
  };

  const monthlyBreakdown = getMonthlyBreakdownForYear(selectedAnalysisYear);
  const totalYearlyExpenseForSelectedYear = monthlyBreakdown.reduce((a, b) => a + b, 0);
  const maxMonthlyExpense = Math.max(...monthlyBreakdown, 1); // Grafik ölçeklendirmesi için

  const yearlyCategoryStats = safeList.reduce((acc, item) => {
    const cat = item.category || 'Diğer';
    const price = Number(item.price || 0);
    if (item.period === 'monthly') {
      acc[cat] = (acc[cat] || 0) + (price * 12);
    } else if (item.period === 'yearly' && Number(item.billingYear || 2026) === selectedAnalysisYear) {
      acc[cat] = (acc[cat] || 0) + price;
    }
    return acc;
  }, {});

  // TASARRUF ÖNERİLERİ ALGORİTMASI
  const generateInsights = () => {
    const insights = [];

    // Öneri 1: Yıllık ödemeye geçiş fırsatı
    const monthlySubs = safeList.filter(s => s.period === 'monthly');
    if (monthlySubs.length > 0) {
      const potentialSavings = monthlySubs.reduce((sum, s) => sum + (Number(s.price) * 12 * 0.15), 0);
      insights.push({
        type: 'warning',
        title: '💡 Yıllık Plan İndirimi Fırsatı',
        desc: `Aylık ödediğiniz abonelikleri yıllık plana geçirerek yılda yaklaşık ${potentialSavings.toFixed(0)} ₺ (%15) tasarruf edebilirsiniz.`
      });
    }

    // Öneri 2: Aynı kategoride çok abonelik var mı?
    const eglenveSubs = safeList.filter(s => s.category === 'Eğlence');
    if (eglenveSubs.length >= 2) {
      insights.push({
        type: 'info',
        title: '🎬 Eğlence Harcaması Yüksek',
        desc: `Şu an ${eglenveSubs.length} adet dijital yayın servisine (Netflix, Exxen vb.) abonesiniz. Aktif izlemediğinizi dondurarak ayda ${eglenveSubs[0].price} ₺ cebinizde kalabilir.`
      });
    }

    // Öneri 3: Genel Yüksek Harcama Uyarısı
    if (monthlyTotal > 1000) {
      insights.push({
        type: 'danger',
        title: '⚠️ Aylık 1.000 ₺ Sınırı Aşıldı',
        desc: `Sabit abonelik giderleriniz aylık ${monthlyTotal.toFixed(0)} ₺ tutarına ulaştı. Yılda toplam ${(monthlyTotal * 12).toFixed(0)} ₺ cebinizden çıkıyor.`
      });
    }

    return insights;
  };

  const insightsList = generateInsights();

  const handlePrevMonth = () => {
    if (calYear === 2025 && calMonth === 0) return;
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calYear === 2030 && calMonth === 11) return;
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
      setFormColor(item.color || getServiceColor(item.name));
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
      setFormColor('#6366F1');
    }
    setIsModalOpen(true);
  };

  const selectPopularService = (service) => {
    setFormName(service.name);
    setFormPrice(String(service.price));
    setFormCategory(service.category);
    setFormCancelUrl(service.cancelUrl);
    setFormColor(service.color);
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;

    const subData = {
      name: formName,
      price: Number(formPrice),
      billingDay: Number(formDay) || 1,
      billingMonth: Number(formMonth) || 1,
      billingYear: Number(formYear) || 2026,
      category: formCategory,
      period: formPeriod,
      cancelUrl: formCancelUrl || `https://www.google.com/search?q=${formName}+iptal+et`,
      color: formColor || getServiceColor(formName),
    };

    if (editingId) {
      setSubscriptions(safeList.map(s => s.id === editingId ? { ...subData, id: editingId } : s));
    } else {
      setSubscriptions([...safeList, { ...subData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => setSubscriptions(safeList.filter(s => s.id !== id));

  const isSubActiveOnDay = (sub, day) => {
    if (sub.period === 'monthly') {
      return Number(sub.billingDay) === day;
    } else {
      return Number(sub.billingDay) === day && (Number(sub.billingMonth) === (calMonth + 1)) && (Number(sub.billingYear) === calYear);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header - Corporate & Premium Look */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.headerTitle}>Cebin</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>FINANCE</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Abonelik & Ödeme Asistanı</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
          <Text style={styles.addBtnText}>+ Yeni Abonelik</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* TAB 1: ABONELİKLER */}
        {activeTab === 'list' && (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Toplam Aylık Taahhüt</Text>
              <Text style={styles.summaryValue}>{monthlyTotal.toFixed(2)} ₺</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Günlük Yük</Text>
                  <Text style={styles.statValue}>{(monthlyTotal / 30).toFixed(2)} ₺</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Yıllık Tahmini</Text>
                  <Text style={styles.statValue}>{(monthlyTotal * 12).toFixed(2)} ₺</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Aktif Servisler ({safeList.length})</Text>
            </View>

            {safeList.map((item) => {
              const isYearly = item.period === 'yearly';
              const serviceColor = item.color || getServiceColor(item.name);

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.leftSection}>
                    <View style={[styles.brandIconBox, { backgroundColor: serviceColor }]}>
                      <Text style={styles.brandIconText}>{item.name ? item.name.charAt(0).toUpperCase() : 'C'}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {item.category} • {isYearly ? `${item.billingDay}/${item.billingMonth}/${item.billingYear}` : `Her ayın ${item.billingDay}. günü`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightSection}>
                    <Text style={styles.price}>{item.price} ₺ {isYearly ? '/yıl' : '/ay'}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => openForm(item)}>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>Düzenle</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => item.cancelUrl && Linking.openURL(item.cancelUrl)}>
                        <Text style={styles.cancelText}>İptal Bağlantısı 🔗</Text>
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

        {/* TAB 2: ÖDEME TAKVİMİ */}
        {activeTab === 'calendar' && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.calendarHeaderNav}>
              <TouchableOpacity style={styles.arrowBtn} onPress={handlePrevMonth}>
                <Text style={styles.arrowText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.calendarTitleText}>
                {MONTH_NAMES[calMonth]} {calYear}
              </Text>
              <TouchableOpacity style={styles.arrowBtn} onPress={handleNextMonth}>
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[styles.viewModeBtn, calendarViewMode === 'daily' && styles.viewModeBtnActive]}
                onPress={() => setCalendarViewMode('daily')}
              >
                <Text style={[styles.viewModeText, calendarViewMode === 'daily' && styles.viewModeTextActive]}>Günlük Akış</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeBtn, calendarViewMode === 'monthly' && styles.viewModeBtnActive]}
                onPress={() => setCalendarViewMode('monthly')}
              >
                <Text style={[styles.viewModeText, calendarViewMode === 'monthly' && styles.viewModeTextActive]}>Aylık Matris</Text>
              </TouchableOpacity>
            </View>

            {calendarViewMode === 'daily' && (
              <View style={{ gap: 8 }}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));

                  return (
                    <View key={day} style={styles.dailyRow}>
                      <Text style={styles.dailyDayText}>{day} {MONTH_NAMES[calMonth]}</Text>
                      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        {daySubs.length > 0 ? daySubs.map(s => {
                          const sColor = s.color || getServiceColor(s.name);
                          return (
                            <View key={s.id} style={[styles.brandBadge, { backgroundColor: sColor }]}>
                              <Text style={styles.brandBadgeText}>{s.name} ({s.price}₺)</Text>
                            </View>
                          );
                        }) : (
                          <Text style={{ color: '#475569', fontSize: 12 }}>Ödeme planı yok</Text>
                        )}
                      </View>
                    </View>
                  );
                })}

                <View style={styles.monthTotalFooterCard}>
                  <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600' }}>
                    {MONTH_NAMES[calMonth]} {calYear} Dönemi Toplam Ödeme:
                  </Text>
                  <Text style={{ color: '#38bdf8', fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
                    {currentCalMonthTotal.toFixed(2)} ₺
                  </Text>
                </View>
              </View>
            )}

            {calendarViewMode === 'monthly' && (
              <View style={styles.calendarGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));
                  return (
                    <View key={day} style={[styles.calendarDayBox, daySubs.length > 0 && styles.activeDayBox]}>
                      <Text style={styles.dayNumber}>{day}</Text>
                      {daySubs.map(s => {
                        const sColor = s.color || getServiceColor(s.name);
                        return (
                          <View key={s.id} style={[styles.daySubBadge, { backgroundColor: sColor }]}>
                            <Text style={styles.daySubText} numberOfLines={1}>{s.name}</Text>
                            <Text style={styles.daySubPrice}>{s.price}₺</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}

          </View>
        )}

        {/* TAB 3: FİNANS & ANALİZ (GRAFİKLER + TASARRUF ÖNERİLERİ) */}
        {activeTab === 'analytics' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 }}>Finansal Analiz & İpuçları</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 16 }}>Harcama alışkanlıklarınız ve Cebin Akıllı İpuçları</Text>

            {/* Yıl Seçimi */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {YEARS.map(y => (
                <TouchableOpacity 
                  key={y} 
                  style={[styles.yearChip, selectedAnalysisYear === y && styles.yearChipActive]}
                  onPress={() => setSelectedAnalysisYear(y)}
                >
                  <Text style={[styles.yearChipText, selectedAnalysisYear === y && styles.yearChipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* GRAFİK BÖLÜMÜ (VISUAL BAR CHART) */}
            <View style={styles.chartContainer}>
              <Text style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: 12 }}>Aylık Harcama Grafiği ({selectedAnalysisYear})</Text>
              <View style={styles.barsArea}>
                {MONTH_NAMES.map((mName, idx) => {
                  const val = monthlyBreakdown[idx];
                  const heightPercent = maxMonthlyExpense > 0 ? (val / maxMonthlyExpense) * 100 : 0;
                  return (
                    <View key={mName} style={styles.barItemContainer}>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { height: `${Math.max(heightPercent, 4)}%`, backgroundColor: val > 0 ? '#6366f1' : '#334155' }]} />
                      </View>
                      <Text style={styles.barLabel}>{mName.substr(0, 3)}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Yıllık Toplam:</Text>
                <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>{totalYearlyExpenseForSelectedYear.toFixed(2)} ₺</Text>
              </View>
            </View>

            {/* CEBİN AKILLI TASARRUF ÖNERİLERİ KARTLARI */}
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 12 }}>
              💡 Cebin Akıllı Tasarruf İpuçları
            </Text>

            {insightsList.length > 0 ? (
              insightsList.map((insight, index) => (
                <View key={index} style={[styles.insightCard, insight.type === 'warning' && { borderLeftColor: '#f59e0b' }, insight.type === 'danger' && { borderLeftColor: '#ef4444' }]}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDesc}>{insight.desc}</Text>
                </View>
              ))
            ) : (
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>✅ Harcamalarınız İdeal Durumda</Text>
                <Text style={styles.insightDesc}>Şu anda aboneliklerinizde kritik bir tasarruf uyarısı bulunmuyor.</Text>
              </View>
            )}

            {/* KATEGORİ DAĞILIMI */}
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 12 }}>
              🏷️ Kategori Bazlı Dağılım
            </Text>
            {Object.keys(yearlyCategoryStats).map((cat) => {
              const amount = yearlyCategoryStats[cat];
              const percentage = totalYearlyExpenseForSelectedYear > 0 ? ((amount / totalYearlyExpenseForSelectedYear) * 100).toFixed(1) : 0;

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

      {/* Corporate Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('list')}>
          <Text style={[styles.navText, activeTab === 'list' && styles.navTextActive]}>💳 Abonelikler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('calendar')}>
          <Text style={[styles.navText, activeTab === 'calendar' && styles.navTextActive]}>📅 Ödeme Takvimi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navTextActive]}>📊 Finans & Analiz</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Abonelik Bilgilerini Düzenle' : 'Yeni Abonelik Tanımla'}</Text>

            {!editingId && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.fieldLabel}>Hızlı Ekle (Popüler Servisler):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  {POPULAR_SERVICES.map((s, idx) => (
                    <TouchableOpacity key={idx} style={[styles.chipBtn, { borderColor: s.color, borderWidth: 1 }]} onPress={() => selectPopularService(s)}>
                      <Text style={{ color: s.color, fontSize: 12, fontWeight: 'bold' }}>{s.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.fieldLabel}>Servis Adı:</Text>
            <TextInput 
              placeholder="ör: Netflix" 
              placeholderTextColor="#64748b" 
              style={styles.input}
              value={formName}
              onChangeText={(txt) => {
                setFormName(txt);
                setFormColor(getServiceColor(txt));
              }}
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
  container: { flex: 1, backgroundColor: '#090d16' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  headerSubtitle: { color: '#64748b', fontSize: 11, marginTop: 2 },
  proBadge: { backgroundColor: '#6366f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  proBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 16 },
  
  summaryCard: { backgroundColor: '#1e1b4b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#312e81' },
  summaryLabel: { color: '#a5b4fc', fontSize: 13, fontWeight: '500' },
  summaryValue: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 10, borderRadius: 8 },
  statLabel: { color: '#c7d2fe', fontSize: 11 },
  statValue: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  
  card: { backgroundColor: '#151f30', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIconBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  brandIconText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { color: '#64748b', fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  price: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  editBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },
  cancelBtn: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 4, backgroundColor: '#0f172a', borderRadius: 6 },

  // Calendar
  calendarHeaderNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calendarTitleText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  arrowBtn: { backgroundColor: '#151f30', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  arrowText: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' },
  viewModeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  viewModeBtn: { flex: 1, paddingVertical: 8, backgroundColor: '#151f30', borderRadius: 8, alignItems: 'center' },
  viewModeBtnActive: { backgroundColor: '#6366f1' },
  viewModeText: { color: '#94a3b8', fontSize: 12 },
  viewModeTextActive: { color: '#fff', fontWeight: 'bold' },

  dailyRow: { backgroundColor: '#151f30', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dailyDayText: { color: '#94a3b8', fontSize: 12, width: 85, fontWeight: '600' },
  brandBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  brandBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  monthTotalFooterCard: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: 1, padding: 16, borderRadius: 12, marginTop: 12, alignItems: 'center' },

  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calendarDayBox: { width: '13%', height: 70, backgroundColor: '#151f30', borderRadius: 6, padding: 4 },
  activeDayBox: { borderWidth: 1, borderColor: '#6366f1', backgroundColor: '#1e1b4b' },
  dayNumber: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  daySubBadge: { borderRadius: 4, padding: 2, marginTop: 2 },
  daySubText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  daySubPrice: { color: '#ffffff', fontSize: 8, opacity: 0.9 },

  // Analytics & Visual Chart
  yearChip: { backgroundColor: '#151f30', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  yearChipActive: { backgroundColor: '#6366f1' },
  yearChipText: { color: '#94a3b8', fontWeight: '600' },
  yearChipTextActive: { color: '#ffffff', fontWeight: 'bold' },

  chartContainer: { backgroundColor: '#151f30', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  barsArea: { flexDirection: 'row', height: 120, alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 20 },
  barItemContainer: { flex: 1, alignItems: 'center' },
  barTrack: { width: 12, height: '100%', backgroundColor: '#0f172a', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { color: '#64748b', fontSize: 9, marginTop: 6 },

  // Insight Cards
  insightCard: { backgroundColor: '#151f30', padding: 14, borderRadius: 10, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#38bdf8' },
  insightTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 13, marginBottom: 4 },
  insightDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 16 },

  categoryCard: { backgroundColor: '#151f30', padding: 12, borderRadius: 10, marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: '#0f172a', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#38bdf8', borderRadius: 3 },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  navItem: { paddingHorizontal: 12 },
  navText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  navTextActive: { color: '#6366f1', fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#151f30', borderRadius: 16, padding: 20, marginVertical: 40 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  fieldLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  chipBtn: { backgroundColor: '#151f30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  categoryChip: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#6366f1' },
  categoryText: { color: '#94a3b8', fontSize: 12 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodOption: { flex: 1, padding: 10, backgroundColor: '#0f172a', borderRadius: 8, alignItems: 'center' },
  periodActive: { backgroundColor: '#6366f1' },
  periodText: { color: '#94a3b8', fontSize: 12 },
  periodTextActive: { color: '#fff', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelModalBtn: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' }
});

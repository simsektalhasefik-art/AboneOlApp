import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = '@cebin_subscriptions_v1';

const CATEGORY_COLORS = {
  'Eğlence': '#ef4444',     // Kırmızı
  'Müzik': '#10b981',       // Yeşil
  'Depolama': '#3b82f6',    // Mavi
  'Yazılım & AI': '#8b5cf6', // Mor
  'Spor': '#f59e0b',        // Turuncu
  'Diğer': '#64748b'        // Gri
};

const DEFAULT_SUBSCRIPTIONS = [
  { id: '1', name: 'Netflix', price: 345, category: 'Eğlence', billingDay: 7, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.netflix.com/youraccount', color: '#E50914' },
  { id: '2', name: 'YouTube Premium', price: 79, category: 'Eğlence', billingDay: 15, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.youtube.com/paid_memberships', color: '#FF0000' },
  { id: '3', name: 'ChatGPT Plus', price: 650, category: 'Yazılım & AI', billingDay: 12, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://chatgpt.com/#settings', color: '#10A37F' }
];

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

const formatTL = (amount) => {
  const val = Number(amount) || 0;
  return val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
};

const formatShortTL = (amount) => {
  const val = Number(amount) || 0;
  if (val === 0) return '0 ₺';
  return val.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺';
};

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [calMonth, setCalMonth] = useState(7);
  const [calYear, setCalYear] = useState(2026);
  const [calendarViewMode, setCalendarViewMode] = useState('monthly');
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

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        let savedData = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          savedData = window.localStorage.getItem(STORAGE_KEY);
        }
        
        if (savedData) {
          setSubscriptions(JSON.parse(savedData));
        } else {
          setSubscriptions(DEFAULT_SUBSCRIPTIONS);
        }
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        setSubscriptions(DEFAULT_SUBSCRIPTIONS);
      } finally {
        setIsLoaded(true);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // İlk yükleme bitmeden kaydetme yapma

    const saveStoredData = async () => {
      try {
        const jsonValue = JSON.stringify(subscriptions);
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, jsonValue);
        }
      } catch (error) {
        console.error('Veriler kaydedilirken hata oluştu:', error);
      }
    };

    saveStoredData();
  }, [subscriptions, isLoaded]);

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];

  const theme = {
    bg: isDarkMode ? '#090d16' : '#f8fafc',
    headerBg: isDarkMode ? '#0f172a' : '#ffffff',
    cardBg: isDarkMode ? '#151f30' : '#ffffff',
    summaryBg: isDarkMode ? '#1e1b4b' : '#4f46e5', // Gündüz modunda göz yormayan açık indigo/mavi
    summaryBorder: isDarkMode ? '#312e81' : '#4338ca',
    cardBorder: isDarkMode ? '#1e293b' : '#e2e8f0',
    textPrimary: isDarkMode ? '#ffffff' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#475569',
    inputBg: isDarkMode ? '#0f172a' : '#f1f5f9',
    accent: isDarkMode ? '#38bdf8' : '#0284c7',
  };

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

  const getDetailedMonthlyBreakdown = (targetYear) => {
    const monthlyCategoryData = Array(12).fill(null).map(() => ({}));
    const monthlyTotals = Array(12).fill(0);

    safeList.forEach(sub => {
      const price = Number(sub.price || 0);
      const cat = sub.category || 'Diğer';

      if (sub.period === 'monthly') {
        for (let m = 0; m < 12; m++) {
          monthlyCategoryData[m][cat] = (monthlyCategoryData[m][cat] || 0) + price;
          monthlyTotals[m] += price;
        }
      } else if (sub.period === 'yearly') {
        const subMonthIndex = Number(sub.billingMonth || 1) - 1;
        const subYear = Number(sub.billingYear || 2026);
        if (subYear === targetYear) {
          monthlyCategoryData[subMonthIndex][cat] = (monthlyCategoryData[subMonthIndex][cat] || 0) + price;
          monthlyTotals[subMonthIndex] += price;
        }
      }
    });

    return { monthlyCategoryData, monthlyTotals };
  };

  const { monthlyCategoryData, monthlyTotals } = getDetailedMonthlyBreakdown(selectedAnalysisYear);
  const totalYearlyExpenseForSelectedYear = monthlyTotals.reduce((a, b) => a + b, 0);
  const maxMonthlyExpense = Math.max(...monthlyTotals, 1);

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

    const normalizedPrice = Number(formPrice.replace(',', '.'));

    const subData = {
      name: formName,
      price: isNaN(normalizedPrice) ? 0 : normalizedPrice,
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

  const handleDelete = (id) => {
    setSubscriptions(safeList.filter(s => s.id !== id));
  };

  const isSubActiveOnDay = (sub, day) => {
    if (sub.period === 'monthly') {
      return Number(sub.billingDay) === day;
    } else {
      return Number(sub.billingDay) === day && (Number(sub.billingMonth) === (calMonth + 1)) && (Number(sub.billingYear) === calYear);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.cardBorder }]}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>FINANCE</Text>
            </View>
          </View>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Abonelik & Ödeme Asistanı</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity 
            style={[styles.themeToggleBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]} 
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <Text style={{ fontSize: 16 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
            <Text style={styles.addBtnText}>+ Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* TAB 1: ABONELİKLER LİSTESİ */}
        {activeTab === 'list' && (
          <>
            {/* YENİLENMİŞ GÜNDÜZ/GECE UYUMLU ÖZET KARTI */}
            <View style={[styles.summaryCard, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }]}>
              <Text style={styles.summaryLabel}>Toplam Aylık Taahhüt</Text>
              <Text style={styles.summaryValue}>{formatTL(monthlyTotal)}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Günlük Maliyet</Text>
                  <Text style={styles.statValue}>{formatTL(monthlyTotal / 30)}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Yıllık Toplam Maliyet</Text>
                  <Text style={styles.statValue}>{formatTL(monthlyTotal * 12)}</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Aktif Abonelikler ({safeList.length})</Text>

            {safeList.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>Henüz kayıtlı aboneliğiniz yok.</Text>
              </View>
            ) : (
              safeList.map((item) => {
                const isYearly = item.period === 'yearly';
                const serviceColor = item.color || getServiceColor(item.name);

                return (
                  <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <View style={styles.leftSection}>
                      <View style={[styles.brandIconBox, { backgroundColor: serviceColor }]}>
                        <Text style={styles.brandIconText}>{item.name ? item.name.charAt(0).toUpperCase() : 'C'}</Text>
                      </View>
                      <View>
                        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.name}</Text>
                        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                          {item.category} • {isYearly ? `${item.billingDay}/${item.billingMonth}/${item.billingYear}` : `Her ayın ${item.billingDay}. günü`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rightSection}>
                      <Text style={[styles.price, { color: theme.textPrimary }]}>{formatTL(item.price)} {isYearly ? '/yıl' : '/ay'}</Text>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.inputBg }]} onPress={() => openForm(item)}>
                          <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: theme.inputBg }]} onPress={() => item.cancelUrl && Linking.openURL(item.cancelUrl)}>
                          <Text style={styles.cancelText}>İptal 🔗</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.deleteBtn, { backgroundColor: theme.inputBg }]}>
                          <Text style={{ color: '#ef4444', fontSize: 11 }}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* TAB 2: ÖDEME TAKVİMİ */}
        {}
        {activeTab === 'calendar' && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.calendarHeaderNav}>
              <TouchableOpacity style={[styles.arrowBtn, { backgroundColor: theme.cardBg }]} onPress={handlePrevMonth}>
                <Text style={styles.arrowText}>◀</Text>
              </TouchableOpacity>
              <Text style={[styles.calendarTitleText, { color: theme.textPrimary }]}>
                {MONTH_NAMES[calMonth]} {calYear}
              </Text>
              <TouchableOpacity style={[styles.arrowBtn, { backgroundColor: theme.cardBg }]} onPress={handleNextMonth}>
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[styles.viewModeBtn, { backgroundColor: theme.cardBg }, calendarViewMode === 'daily' && styles.viewModeBtnActive]}
                onPress={() => setCalendarViewMode('daily')}
              >
                <Text style={[styles.viewModeText, { color: theme.textSecondary }, calendarViewMode === 'daily' && styles.viewModeTextActive]}>Günlük Akış</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeBtn, { backgroundColor: theme.cardBg }, calendarViewMode === 'monthly' && styles.viewModeBtnActive]}
                onPress={() => setCalendarViewMode('monthly')}
              >
                <Text style={[styles.viewModeText, { color: theme.textSecondary }, calendarViewMode === 'monthly' && styles.viewModeTextActive]}>Aylık Matris</Text>
              </TouchableOpacity>
            </View>

            {calendarViewMode === 'daily' && (
              <View style={{ gap: 8 }}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));

                  return (
                    <View key={day} style={[styles.dailyRow, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                      <Text style={[styles.dailyDayText, { color: theme.textSecondary }]}>{day} {MONTH_NAMES[calMonth]}</Text>
                      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        {daySubs.length > 0 ? daySubs.map(s => {
                          const sColor = s.color || getServiceColor(s.name);
                          return (
                            <View key={s.id} style={[styles.brandBadge, { backgroundColor: sColor }]}>
                              <Text style={styles.brandBadgeText}>{s.name} ({formatTL(s.price)})</Text>
                            </View>
                          );
                        }) : (
                          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Ödeme planı yok</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {calendarViewMode === 'monthly' && (
              <View style={styles.calendarGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));
                  return (
                    <View key={day} style={[styles.calendarDayBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, daySubs.length > 0 && styles.activeDayBox]}>
                      <Text style={[styles.dayNumber, { color: theme.textSecondary }]}>{day}</Text>
                      {daySubs.map(s => {
                        const sColor = s.color || getServiceColor(s.name);
                        return (
                          <View key={s.id} style={[styles.daySubBadge, { backgroundColor: sColor }]}>
                            <Text style={styles.daySubText} numberOfLines={1}>{s.name}</Text>
                            <Text style={styles.daySubPrice}>{formatTL(s.price)}</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}

            <View style={[styles.monthTotalFooterCard, { backgroundColor: theme.headerBg, borderColor: theme.cardBorder }]}>
              <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '600' }}>
                {MONTH_NAMES[calMonth]} {calYear} Dönemi Toplam Ödeme:
              </Text>
              <Text style={{ color: theme.accent, fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
                {formatTL(currentCalMonthTotal)}
              </Text>
            </View>

          </View>
        )}

        {/* TAB 3: FİNANS & ANALİZ */}
        {}
        {activeTab === 'analytics' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 4 }}>Finansal Analiz & Grafikler</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 16 }}>Aylık harcama dağılımları</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {YEARS.map(y => (
                <TouchableOpacity 
                  key={y} 
                  style={[styles.yearChip, { backgroundColor: theme.cardBg }, selectedAnalysisYear === y && styles.yearChipActive]}
                  onPress={() => setSelectedAnalysisYear(y)}
                >
                  <Text style={[styles.yearChipText, { color: theme.textSecondary }, selectedAnalysisYear === y && styles.yearChipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[styles.chartContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 16, marginBottom: 14 }}>
                Aylık Harcama Grafiği ({selectedAnalysisYear})
              </Text>
              
              <View style={styles.legendContainer}>
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <View key={cat} style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: CATEGORY_COLORS[cat] }]} />
                    <Text style={[styles.legendText, { color: theme.textSecondary }]}>{cat}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.barsAreaContainer}>
                {MONTH_NAMES.map((mName, idx) => {
                  const totalVal = monthlyTotals[idx];
                  const catBreakdown = monthlyCategoryData[idx];
                  const heightPercent = maxMonthlyExpense > 0 ? (totalVal / maxMonthlyExpense) * 100 : 0;
                  const finalBarHeight = Math.max(heightPercent, totalVal > 0 ? 8 : 2);

                  return (
                    <View key={mName} style={styles.barColumn}>
                      <View style={[styles.barTrack, { backgroundColor: isDarkMode ? '#0f172a' : '#e2e8f0' }]}>
                        <View style={{ width: '100%', height: `${finalBarHeight}%`, borderRadius: 6, overflow: 'hidden', flexDirection: 'column-reverse' }}>
                          {Object.keys(catBreakdown).map(cat => {
                            const catAmount = catBreakdown[cat];
                            const catRatio = totalVal > 0 ? (catAmount / totalVal) * 100 : 0;
                            return (
                              <View 
                                key={cat} 
                                style={{ 
                                  width: '100%', 
                                  height: `${catRatio}%`, 
                                  backgroundColor: CATEGORY_COLORS[cat] || '#64748b' 
                                }} 
                              />
                            );
                          })}
                        </View>
                      </View>

                      {/* Büyütülmüş Ay İsimleri */}
                      <Text style={[styles.barLabel, { color: theme.textPrimary }]}>{mName.substr(0, 3)}</Text>
                      
                      {/* Büyütülmüş Tutar Rakamları */}
                      <Text style={[styles.barAmountText, { color: totalVal > 0 ? theme.accent : theme.textSecondary }]}>
                        {formatShortTL(totalVal)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder }]}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Yıllık Toplam:</Text>
                <Text style={{ color: theme.accent, fontSize: 22, fontWeight: 'bold' }}>{formatTL(totalYearlyExpenseForSelectedYear)}</Text>
              </View>
            </View>

            <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 12 }}>
              🏷️ Kategori Bazlı Dağılım
            </Text>
            {Object.keys(yearlyCategoryStats).map((cat) => {
              const amount = yearlyCategoryStats[cat];
              const percentage = totalYearlyExpenseForSelectedYear > 0 ? ((amount / totalYearlyExpenseForSelectedYear) * 100).toFixed(1) : 0;
              const catColor = CATEGORY_COLORS[cat] || '#38bdf8';

              return (
                <View key={cat} style={[styles.categoryCard, { backgroundColor: theme.cardBg }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: catColor }} />
                      <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>{cat}</Text>
                    </View>
                    <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{formatTL(amount)} (%{percentage})</Text>
                  </View>
                  <View style={[styles.progressBarBg, { backgroundColor: theme.inputBg }]}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: catColor }]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

      </ScrollView>

      {}
      <View style={[styles.bottomNav, { backgroundColor: theme.headerBg, borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('list')}>
          <Text style={[styles.navText, { color: theme.textSecondary }, activeTab === 'list' && styles.navTextActive]}>💳 Abonelikler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('calendar')}>
          <Text style={[styles.navText, { color: theme.textSecondary }, activeTab === 'calendar' && styles.navTextActive]}>📅 Takvim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.navText, { color: theme.textSecondary }, activeTab === 'analytics' && styles.navTextActive]}>📊 Analiz</Text>
        </TouchableOpacity>
      </View>

      {}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{editingId ? 'Abonelik Bilgilerini Düzenle' : 'Yeni Abonelik Tanımla'}</Text>

            {!editingId && (
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Hızlı Ekle (Popüler Servisler):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  {POPULAR_SERVICES.map((s, idx) => (
                    <TouchableOpacity key={idx} style={[styles.chipBtn, { borderColor: s.color, borderWidth: 1 }]} onPress={() => selectPopularService(s)}>
                      <Text style={{ color: s.color, fontSize: 12, fontWeight: 'bold' }}>{s.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Servis Adı:</Text>
            <TextInput 
              placeholder="ör: Netflix" 
              placeholderTextColor="#64748b" 
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary }]}
              value={formName}
              onChangeText={(txt) => {
                setFormName(txt);
                setFormColor(getServiceColor(txt));
              }}
            />

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Kategori:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryChip, { backgroundColor: theme.inputBg }, formCategory === cat && styles.categoryChipActive]}
                  onPress={() => setFormCategory(cat)}
                >
                  <Text style={[styles.categoryText, { color: theme.textSecondary }, formCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Ödeme Periyodu:</Text>
            <View style={styles.periodSelector}>
              <TouchableOpacity 
                style={[styles.periodOption, { backgroundColor: theme.inputBg }, formPeriod === 'monthly' && styles.periodActive]}
                onPress={() => setFormPeriod('monthly')}
              >
                <Text style={[styles.periodText, { color: theme.textSecondary }, formPeriod === 'monthly' && styles.periodTextActive]}>Aylık Ödeme</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodOption, { backgroundColor: theme.inputBg }, formPeriod === 'yearly' && styles.periodActive]}
                onPress={() => setFormPeriod('yearly')}
              >
                <Text style={[styles.periodText, { color: theme.textSecondary }, formPeriod === 'yearly' && styles.periodTextActive]}>Yıllık Ödeme</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{formPeriod === 'yearly' ? "Yıllık Tutar (₺):" : "Aylık Tutar (₺):"}</Text>
            <TextInput 
              placeholder="0,00" 
              placeholderTextColor="#64748b" 
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary }]}
              value={formPrice}
              onChangeText={(txt) => setFormPrice(txt.replace(/[^0-9,.]/g, ''))}
            />

            {formPeriod === 'monthly' ? (
              <>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Ödeme Günü (Ayın kaçıncı günü: 1-31):</Text>
                <TextInput 
                  placeholder="ör: 15" 
                  placeholderTextColor="#64748b" 
                  keyboardType="numeric"
                  style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary }]}
                  value={formDay}
                  onChangeText={(txt) => setFormDay(txt.replace(/[^0-9]/g, ''))}
                />
              </>
            ) : (
              <>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Yenileme Tarihi (Gün, Ay ve Yıl):</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput 
                    placeholder="Gün (1-31)" 
                    placeholderTextColor="#64748b" 
                    keyboardType="numeric"
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary, flex: 1 }]}
                    value={formDay}
                    onChangeText={(txt) => setFormDay(txt.replace(/[^0-9]/g, ''))}
                  />
                  <TextInput 
                    placeholder="Ay (1-12)" 
                    placeholderTextColor="#64748b" 
                    keyboardType="numeric"
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary, flex: 1 }]}
                    value={formMonth}
                    onChangeText={(txt) => setFormMonth(txt.replace(/[^0-9]/g, ''))}
                  />
                  <TextInput 
                    placeholder="Yıl (ör: 2026)" 
                    placeholderTextColor="#64748b" 
                    keyboardType="numeric"
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary, flex: 1 }]}
                    value={formYear}
                    onChangeText={(txt) => setFormYear(txt.replace(/[^0-9]/g, ''))}
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
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  proBadge: { backgroundColor: '#6366f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  proBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  themeToggleBtn: { padding: 8, borderRadius: 8, borderWidth: 1 },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 16 },
  
  emptyCard: { borderRadius: 12, padding: 20, borderWidth: 1, alignItems: 'center' },
  summaryCard: { borderRadius: 16, padding: 22, marginBottom: 16, borderWidth: 1 },
  summaryLabel: { color: '#ffffff', fontSize: 13, fontWeight: '600', opacity: 0.9 },
  summaryValue: { color: '#ffffff', fontSize: 34, fontWeight: 'bold', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 12, borderRadius: 10 },
  statLabel: { color: '#ffffff', fontSize: 11, opacity: 0.9 },
  statValue: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  
  card: { borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIconBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  brandIconText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  price: { fontSize: 15, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  editBtn: { padding: 4, borderRadius: 6 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 4, borderRadius: 6 },

  // Calendar
  calendarHeaderNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calendarTitleText: { fontSize: 18, fontWeight: 'bold' },
  arrowBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  arrowText: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' },
  viewModeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  viewModeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  viewModeBtnActive: { backgroundColor: '#6366f1' },
  viewModeText: { fontSize: 12 },
  viewModeTextActive: { color: '#fff', fontWeight: 'bold' },

  dailyRow: { padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
  dailyDayText: { fontSize: 12, width: 85, fontWeight: '600' },
  brandBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  brandBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  monthTotalFooterCard: { borderWidth: 1, padding: 16, borderRadius: 12, marginTop: 12, alignItems: 'center' },

  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calendarDayBox: { width: '13.5%', minHeight: 82, borderRadius: 8, padding: 6, borderWidth: 1 },
  activeDayBox: { borderColor: '#6366f1', borderWidth: 1.5 },
  dayNumber: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  daySubBadge: { borderRadius: 4, padding: 4, marginTop: 3 },
  daySubText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  daySubPrice: { color: '#ffffff', fontSize: 11, fontWeight: '600', marginTop: 1 },

  yearChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  yearChipActive: { backgroundColor: '#6366f1' },
  yearChipText: { fontWeight: '600' },
  yearChipTextActive: { color: '#ffffff', fontWeight: 'bold' },

  chartContainer: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColorBox: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, fontWeight: '600' },

  barsAreaContainer: { flexDirection: 'row', height: 180, alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 10 },
  barColumn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  barTrack: { width: 16, height: 120, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barLabel: { fontSize: 12, marginTop: 6, fontWeight: 'bold' },
  barAmountText: { fontSize: 9, marginTop: 2, fontWeight: 'bold' },

  chartFooter: { borderTopWidth: 1, paddingTop: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  categoryCard: { padding: 12, borderRadius: 10, marginBottom: 8 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  navItem: { paddingHorizontal: 12 },
  navText: { fontSize: 12, fontWeight: '600' },
  navTextActive: { color: '#6366f1', fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 16, padding: 20, marginVertical: 40 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  input: { padding: 12, borderRadius: 8, marginBottom: 12 },
  chipBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#6366f1' },
  categoryText: { fontSize: 12 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodOption: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  periodActive: { backgroundColor: '#6366f1' },
  periodText: { fontSize: 12 },
  periodTextActive: { color: '#fff', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelModalBtn: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' }
});

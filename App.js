import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Linking
} from 'react-native';

const DEFAULT_RATES = { USD: 47.56, EUR: 54.77 };

const CATEGORY_COLORS = {
  'Eğlence': '#ef4444',
  'Yazılım & AI': '#8b5cf6',
  'Müzik': '#10b981',
  'Eğitim': '#f59e0b',
  'Bulut & Depolama': '#3b82f6',
  'Spor & Sağlık': '#ec4899',
  'Diğer': '#64748b',
};

const PAYMENT_METHODS = [
  'Garanti Bonus',
  'Enpara Kart',
  'Papara',
  'İş Bankası Maximum',
  'Yapı Kredi World',
  'Nakit / Diğer'
];

const DEFAULT_POPULAR_SERVICES = [
  { name: 'Netflix', price: '299', currency: 'TRY', category: 'Eğlence', color: '#E50914' },
  { name: 'Spotify', price: '89', currency: 'TRY', category: 'Müzik', color: '#1DB954' },
  { name: 'YouTube Premium', price: '115', currency: 'TRY', category: 'Eğlence', color: '#FF0000' },
  { name: 'ChatGPT Plus', price: '20', currency: 'USD', category: 'Yazılım & AI', color: '#10A37F' },
  { name: 'iCloud+', price: '49.99', currency: 'TRY', category: 'Bulut & Depolama', color: '#007AFF' },
  { name: 'Amazon Prime', price: '49', currency: 'TRY', category: 'Eğlence', color: '#00A8E1' },
];

const NOTIFICATION_OPTIONS = [
  { label: 'Bildirim Yok', badgeLabel: null, value: -1 },
  { label: 'Aynı Gün', badgeLabel: '🔔 Aynı Gün', value: 0 },
  { label: '1 Gün Önce', badgeLabel: '🔔 Hatırlatma: 1 Gün Önce', value: 1 },
  { label: '2 Gün Önce', badgeLabel: '🔔 Hatırlatma: 2 Gün Önce', value: 2 },
  { label: '3 Gün Önce', badgeLabel: '🔔 Hatırlatma: 3 Gün Önce', value: 3 },
  { label: '1 Hafta Önce', badgeLabel: '🔔 Hatırlatma: 1 Hafta Önce', value: 7 },
];

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const formatCurrency = (val, currency = 'TRY') => {
  const num = Number(val) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
};

const formatShortCurrency = (val, currency = 'TRY') => {
  const num = Number(val) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  return `${Math.round(num).toLocaleString('tr-TR')} ${symbol}`;
};

const convertToTL = (price, currency, rates = DEFAULT_RATES) => {
  const p = Number(price) || 0;
  if (currency === 'USD') return p * (rates.USD || 47.56);
  if (currency === 'EUR') return p * (rates.EUR || 54.77);
  return p;
};

const getServiceColor = (name) => {
  const match = DEFAULT_POPULAR_SERVICES.find(s => s.name.toLowerCase() === (name || '').toLowerCase());
  return match ? match.color : '#6366f1';
};

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [exchangeRates] = useState(DEFAULT_RATES);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  const [paymentMethodsList] = useState(PAYMENT_METHODS);
  const [popularServicesList] = useState(DEFAULT_POPULAR_SERVICES);

  const [activeTab, setActiveTab] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [calMonth, setCalMonth] = useState(7);
  const [calYear, setCalYear] = useState(2026);
  const [selectedAnalysisYear, setSelectedAnalysisYear] = useState(2026);

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCurrency, setFormCurrency] = useState('TRY');
  const [formDay, setFormDay] = useState('1');
  const [formMonth, setFormMonth] = useState('8');
  const [formYear, setFormYear] = useState('2026');
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPaymentMethod, setFormPaymentMethod] = useState('Garanti Bonus');
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [formCancelUrl, setFormCancelUrl] = useState('');
  const [formColor, setFormColor] = useState('#6366F1');
  const [formNotificationDays, setFormNotificationDays] = useState(2);

  useEffect(() => {
    try {
      const savedSubs = localStorage.getItem('cebin_subscriptions_v5');
      if (savedSubs) {
        setSubscriptions(JSON.parse(savedSubs));
      } else {
        setSubscriptions([
          { id: '1', name: 'Netflix', price: '299', currency: 'TRY', category: 'Eğlence', paymentMethod: 'Garanti Bonus', period: 'monthly', billingDay: '15', billingMonth: '8', billingYear: '2026', notificationDays: 2, cancelUrl: 'https://www.netflix.com/youraccount', color: '#E50914' },
          { id: '2', name: 'ChatGPT Plus', price: '20', currency: 'USD', category: 'Yazılım & AI', paymentMethod: 'Enpara Kart', period: 'monthly', billingDay: '28', billingMonth: '8', billingYear: '2026', notificationDays: 1, cancelUrl: 'https://chatgpt.com', color: '#10A37F' },
          { id: '3', name: 'Spotify', price: '89', currency: 'TRY', category: 'Müzik', paymentMethod: 'Papara', period: 'monthly', billingDay: '10', billingMonth: '8', billingYear: '2026', notificationDays: 3, cancelUrl: 'https://www.spotify.com/account/overview', color: '#1DB954' },
        ]);
      }
    } catch (e) {
      console.log('Localstorage hata:', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cebin_subscriptions_v5', JSON.stringify(subscriptions));
      } catch (e) {
        console.log('Kaydetme hatası:', e);
      }
    }
  }, [subscriptions, isLoaded]);

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];

  // --- THEME: contrast-audited for both modes -----------------------------
  // textSecondary / textMuted were previously too close to the background
  // color in one mode or the other (slate-400 on a light card, slate-500 on
  // a near-black input). Values below keep dark-mode text bright enough and
  // light-mode text dark enough to stay readable (~4.5:1+ contrast).
  const theme = {
    bg: isDarkMode ? '#090d16' : '#f8fafc',
    headerBg: isDarkMode ? '#131b2e' : '#ffffff',
    cardBg: isDarkMode ? '#131b2e' : '#ffffff',
    summaryBg: isDarkMode ? '#312e81' : '#4f46e5',
    summaryBorder: isDarkMode ? '#4338ca' : '#6366f1',
    cardBorder: isDarkMode ? '#222f49' : '#cbd5e1',
    textPrimary: isDarkMode ? '#f8fafc' : '#0b1220',
    textSecondary: isDarkMode ? '#cbd5e1' : '#334155',
    textMuted: isDarkMode ? '#94a3b8' : '#64748b',
    inputBg: isDarkMode ? '#0b111d' : '#e9edf3',
    accent: isDarkMode ? '#38bdf8' : '#0284c7',
  };

  const handleDelete = (id) => {
    setSubscriptions(safeList.filter(s => s.id !== id));
  };

  const handleExportCSV = () => {
    if (safeList.length === 0) return;
    let csvContent = "\uFEFFServis Adi;Fiyat;Para Birimi;Kategori;Odeme Yontemi;Periyot;Gonderim Gunu\n";
    safeList.forEach(s => {
      csvContent += `"${s.name}";${s.price};"${s.currency}";"${s.category}";"${s.paymentMethod}";"${s.period}";${s.billingDay}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cebin_abonelikler_${calYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subscriptions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `cebin_yedek_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const filteredSubscriptions = safeList.filter(sub => {
    const matchPayment = selectedPaymentFilter === 'ALL' || sub.paymentMethod === selectedPaymentFilter;
    const matchCat = selectedCategoryFilter === 'ALL' || sub.category === selectedCategoryFilter;
    return matchPayment && matchCat;
  });

  const monthlyTotalTL = safeList.reduce((sum, item) => {
    if (!item) return sum;
    const priceTL = convertToTL(item.price, item.currency || 'TRY', exchangeRates);
    const cost = item.period === 'yearly' ? priceTL / 12 : priceTL;
    return sum + cost;
  }, 0);

  const getDetailedMonthlyBreakdown = (targetYear) => {
    const monthlyTotals = Array(12).fill(0);
    const monthlyDominantColor = Array(12).fill('#6366f1');

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      let monthSum = 0;
      const categorySumsInMonth = {};

      safeList.forEach(item => {
        const priceTL = convertToTL(item.price, item.currency || 'TRY', exchangeRates);
        const itemCat = item.category || 'Diğer';

        if (item.period === 'monthly') {
          monthSum += priceTL;
          categorySumsInMonth[itemCat] = (categorySumsInMonth[itemCat] || 0) + priceTL;
        } else if (item.period === 'yearly') {
          const bMonth = Number(item.billingMonth || 1) - 1;
          const bYear = Number(item.billingYear || targetYear);
          if (bMonth === monthIdx && bYear === targetYear) {
            monthSum += priceTL;
            categorySumsInMonth[itemCat] = (categorySumsInMonth[itemCat] || 0) + priceTL;
          }
        }
      });

      monthlyTotals[monthIdx] = monthSum;

      let maxCatAmount = 0;
      let dominantCat = 'Eğlence';
      Object.entries(categorySumsInMonth).forEach(([cat, amt]) => {
        if (amt > maxCatAmount) {
          maxCatAmount = amt;
          dominantCat = cat;
        }
      });
      if (maxCatAmount > 0) {
        monthlyDominantColor[monthIdx] = CATEGORY_COLORS[dominantCat] || '#6366f1';
      }
    }

    return { monthlyTotals, monthlyDominantColor };
  };

  const { monthlyTotals, monthlyDominantColor } = getDetailedMonthlyBreakdown(selectedAnalysisYear);
  const totalYearlyExpenseForSelectedYear = monthlyTotals.reduce((a, b) => a + b, 0);
  const maxMonthlyExpense = Math.max(...monthlyTotals, 1);
  const monthsWithSpending = monthlyTotals.filter(v => v > 0).length;
  const averageMonthlyExpense = monthsWithSpending > 0 ? totalYearlyExpenseForSelectedYear / monthsWithSpending : 0;

  const yearlyPaymentMethodStats = safeList.reduce((acc, item) => {
    const method = item.paymentMethod || 'Diğer';
    const priceTL = convertToTL(item.price, item.currency || 'TRY', exchangeRates);
    const annualCost = item.period === 'monthly' ? priceTL * 12 : priceTL;
    acc[method] = (acc[method] || 0) + annualCost;
    return acc;
  }, {});

  const yearlyCategoryStats = safeList.reduce((acc, item) => {
    const cat = item.category || 'Diğer';
    const priceTL = convertToTL(item.price, item.currency || 'TRY', exchangeRates);
    const annualCost = item.period === 'monthly' ? priceTL * 12 : priceTL;
    acc[cat] = (acc[cat] || 0) + annualCost;
    return acc;
  }, {});

  // Sort both breakdowns descending so the biggest expense is always on top.
  const sortedPaymentMethodEntries = Object.entries(yearlyPaymentMethodStats).sort((a, b) => b[1] - a[1]);
  const sortedCategoryEntries = Object.entries(yearlyCategoryStats).sort((a, b) => b[1] - a[1]);
  const topCategoryLabel = sortedCategoryEntries[0]?.[0] || '-';

  const openForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');
      setFormPrice(String(item.price || ''));
      setFormCurrency(item.currency || 'TRY');
      setFormDay(String(item.billingDay || '1'));
      setFormMonth(String(item.billingMonth || '8'));
      setFormYear(String(item.billingYear || '2026'));
      setFormCategory(item.category || 'Eğlence');
      setFormPaymentMethod(item.paymentMethod || paymentMethodsList[0]);
      setFormPeriod(item.period || 'monthly');
      setFormCancelUrl(item.cancelUrl || '');
      setFormColor(item.color || getServiceColor(item.name));
      setFormNotificationDays(item.notificationDays !== undefined ? item.notificationDays : 2);
    } else {
      setEditingId(null);
      setFormName('');
      setFormPrice('');
      setFormCurrency('TRY');
      setFormDay('1');
      setFormMonth('8');
      setFormYear(String(calYear));
      setFormCategory('Eğlence');
      setFormPaymentMethod(paymentMethodsList[0] || 'Garanti Bonus');
      setFormPeriod('monthly');
      setFormCancelUrl('');
      setFormColor('#6366F1');
      setFormNotificationDays(2);
    }
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      alert("Lütfen servis adını giriniz.");
      return;
    }
    if (!formPrice || isNaN(formPrice)) {
      alert("Lütfen geçerli bir fiyat giriniz.");
      return;
    }

    const payload = {
      id: editingId || String(Date.now()),
      name: formName.trim(),
      price: formPrice,
      currency: formCurrency,
      billingDay: formDay,
      billingMonth: formMonth,
      billingYear: formYear,
      category: formCategory,
      paymentMethod: formPaymentMethod,
      period: formPeriod,
      cancelUrl: formCancelUrl,
      color: formColor,
      notificationDays: formNotificationDays,
    };

    if (editingId) {
      setSubscriptions(safeList.map(s => s.id === editingId ? payload : s));
    } else {
      setSubscriptions([...safeList, payload]);
    }
    setIsModalOpen(false);
  };

  const daysInCurrentMonth = getDaysInMonth(calMonth, calYear);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={[styles.appWrapper, isDesktop && styles.appWrapperDesktop]}>

        {/* MASAÜSTÜ SIDEBAR */}
        {isDesktop && (
          <View style={[styles.sidebarContainer, { backgroundColor: theme.headerBg, borderRightColor: theme.cardBorder }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary, marginBottom: 24 }]}>
              Akıllı Abonelik & Bütçe Asistanı
            </Text>

            <View style={styles.sidebarNavGroup}>
              <TouchableOpacity
                style={[styles.sidebarNavBtn, activeTab === 'list' && styles.sidebarNavBtnActive]}
                onPress={() => setActiveTab('list')}
              >
                <Text style={{ fontSize: 18 }}>💳</Text>
                <Text style={[styles.sidebarNavText, { color: activeTab === 'list' ? '#6366f1' : theme.textSecondary }]}>
                  Abonelikler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sidebarNavBtn, activeTab === 'calendar' && styles.sidebarNavBtnActive]}
                onPress={() => setActiveTab('calendar')}
              >
                <Text style={{ fontSize: 18 }}>📅</Text>
                <Text style={[styles.sidebarNavText, { color: activeTab === 'calendar' ? '#6366f1' : theme.textSecondary }]}>
                  Takvim
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sidebarNavBtn, activeTab === 'analytics' && styles.sidebarNavBtnActive]}
                onPress={() => setActiveTab('analytics')}
              >
                <Text style={{ fontSize: 18 }}>📊</Text>
                <Text style={[styles.sidebarNavText, { color: activeTab === 'analytics' ? '#6366f1' : theme.textSecondary }]}>
                  Analiz & Raporlar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 'auto', gap: 8 }}>
              <TouchableOpacity style={[styles.exportBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={handleExportCSV}>
                <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: 'bold' }}>📄 CSV Excel İndir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.exportBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={handleExportJSON}>
                <Text style={{ color: theme.accent, fontSize: 12, fontWeight: 'bold' }}>💾 JSON Yedek Al</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
                <Text style={styles.addBtnText}>+ Yeni Abonelik Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ANA İÇERİK KONTROL ALANI */}
        <View style={styles.responsiveWrapper}>

          <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.cardBorder }]}>
            <View>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Abonelik & Sabit Gider Takibi</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={[styles.themeToggleIconBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
                onPress={() => setIsDarkMode(!isDarkMode)}
                title="Tema Değiştir"
              >
                <Text style={{ fontSize: 18 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>

              {!isDesktop && (
                <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
                  <Text style={styles.addBtnText}>+ Ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={[styles.scrollContent, isDesktop && { paddingBottom: 40 }]}>

            <View style={[styles.currencyBar, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={[styles.currencyBarTitle, { color: theme.textSecondary }]}>💱 Güncel Kurlar:</Text>
              <View style={styles.currencyBadgeGroup}>
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyBadgeText}>USD: {exchangeRates.USD} ₺</Text>
                </View>
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyBadgeText}>EUR: {exchangeRates.EUR} ₺</Text>
                </View>
              </View>
            </View>

            {activeTab === 'list' && (
              <>
                <View style={[styles.summaryCard, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }]}>
                  <Text style={styles.summaryLabel}>Toplam Aylık Taahhüt</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(monthlyTotalTL, 'TRY')}</Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Günlük Tahmini Maliyet</Text>
                      <Text style={styles.statValue}>{formatCurrency(monthlyTotalTL / 30, 'TRY')}</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Yıllık Projeksiyon</Text>
                      <Text style={styles.statValue}>{formatCurrency(monthlyTotalTL * 12, 'TRY')}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>
                    💳 Ödeme Yöntemine Göre Filtrele:
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    <TouchableOpacity
                      style={[styles.filterChip, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, selectedPaymentFilter === 'ALL' && styles.filterChipActive]}
                      onPress={() => setSelectedPaymentFilter('ALL')}
                    >
                      <Text style={[styles.filterChipText, { color: theme.textSecondary }, selectedPaymentFilter === 'ALL' && styles.filterChipTextActive]}>Tüm Kartlar</Text>
                    </TouchableOpacity>
                    {paymentMethodsList.map(method => (
                      <TouchableOpacity
                        key={method}
                        style={[styles.filterChip, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, selectedPaymentFilter === method && styles.filterChipActive]}
                        onPress={() => setSelectedPaymentFilter(method)}
                      >
                        <Text style={[styles.filterChipText, { color: theme.textSecondary }, selectedPaymentFilter === method && styles.filterChipTextActive]}>{method}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Kayıtlı Abonelikler ({filteredSubscriptions.length})
                </Text>

                {filteredSubscriptions.length === 0 ? (
                  <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>💳</Text>
                    <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 16 }}>Abonelik Bulunamadı</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                      Seçilen filtre kriterlerine uygun abonelik kaydı bulunmuyor.
                    </Text>
                  </View>
                ) : (
                  filteredSubscriptions.map((item) => {
                    const priceInTL = convertToTL(item.price, item.currency || 'TRY', exchangeRates);
                    const isYearly = item.period === 'yearly';
                    const notifOpt = NOTIFICATION_OPTIONS.find(o => o.value === item.notificationDays) || NOTIFICATION_OPTIONS[3];
                    const serviceColor = item.color || getServiceColor(item.name);

                    return (
                      <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.leftSection}>
                          <View style={[styles.brandIconBox, { backgroundColor: serviceColor }]}>
                            <Text style={styles.brandIconText}>{item.name ? item.name.charAt(0).toUpperCase() : 'C'}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.name}</Text>
                              {item.paymentMethod && (
                                <View style={[styles.cardTag, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                                  <Text style={[styles.cardTagText, { color: theme.textSecondary }]}>💳 {item.paymentMethod}</Text>
                                </View>
                              )}
                              {notifOpt.value !== -1 && (
                                <View style={[styles.cardTag, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                                  <Text style={[styles.cardTagText, { color: theme.accent }]}>
                                    {notifOpt.badgeLabel}
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                              {item.category} • {isYearly ? `${item.billingDay}/${item.billingMonth}/${item.billingYear}` : `Her ayın ${item.billingDay}. günü`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.rightSection}>
                          <Text style={[styles.price, { color: theme.textPrimary }]}>
                            {formatCurrency(item.price, item.currency || 'TRY')} {isYearly ? '/yıl' : '/ay'}
                          </Text>
                          {item.currency !== 'TRY' && (
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.accent, marginTop: 1 }}>
                              ≈ {formatCurrency(priceInTL, 'TRY')}
                            </Text>
                          )}
                          <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={() => openForm(item)}>
                              <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: 'bold' }}>Düzenle</Text>
                            </TouchableOpacity>
                            {item.cancelUrl ? (
                              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={() => Linking.openURL(item.cancelUrl)}>
                                <Text style={[styles.cancelText, { color: theme.accent }]}>İptal 🔗</Text>
                              </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.deleteBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                              <Text style={{ color: '#ef4444', fontSize: 12 }}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'calendar' && (
              <View style={{ marginTop: 10 }}>
                <View style={styles.calendarHeaderNav}>
                  <TouchableOpacity
                    style={[styles.arrowBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]}
                    onPress={() => {
                      if (calMonth === 0) { setCalMonth(11); setCalYear(Math.max(2025, calYear - 1)); }
                      else { setCalMonth(calMonth - 1); }
                    }}
                  >
                    <Text style={[styles.arrowText, { color: theme.accent }]}>◀ Önceki</Text>
                  </TouchableOpacity>

                  <Text style={[styles.calendarTitleText, { color: theme.textPrimary }]}>
                    {MONTH_NAMES[calMonth]} {calYear} ({daysInCurrentMonth} Gün)
                  </Text>

                  <TouchableOpacity
                    style={[styles.arrowBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]}
                    onPress={() => {
                      if (calMonth === 11) { setCalMonth(0); setCalYear(Math.min(2030, calYear + 1)); }
                      else { setCalMonth(calMonth + 1); }
                    }}
                  >
                    <Text style={[styles.arrowText, { color: theme.accent }]}>Sonraki ▶</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {YEARS.map(y => (
                    <TouchableOpacity
                      key={y}
                      style={[styles.yearChip, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1 }, calYear === y && styles.yearChipActive]}
                      onPress={() => setCalYear(y)}
                    >
                      <Text style={[styles.yearChipText, { color: theme.textSecondary }, calYear === y && styles.yearChipTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.calendarWrapper}>
                  <View style={styles.weekHeaderRow}>
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
                      <View key={i} style={styles.weekHeaderCell}>
                        <Text style={[styles.weekHeaderText, { color: theme.textSecondary }]}>{d}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.calendarGrid}>
                    {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const subsOnDay = safeList.filter(s => {
                        if (s.period === 'monthly') return Number(s.billingDay) === dayNum;
                        if (s.period === 'yearly') {
                          return Number(s.billingDay) === dayNum && Number(s.billingMonth) === (calMonth + 1) && Number(s.billingYear) === calYear;
                        }
                        return false;
                      });

                      return (
                        <View
                          key={dayNum}
                          style={[
                            styles.calendarDayBox,
                            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
                            subsOnDay.length > 0 && styles.activeDayBox
                          ]}
                        >
                          <Text style={[styles.dayNumber, { color: theme.textPrimary }]}>{dayNum}</Text>
                          {subsOnDay.map((sub, sIdx) => (
                            <View key={sIdx} style={[styles.daySubBadge, { backgroundColor: sub.color || getServiceColor(sub.name) }]}>
                              <Text style={styles.daySubText} numberOfLines={1}>{sub.name}</Text>
                              <Text style={styles.daySubPrice}>{formatShortCurrency(convertToTL(sub.price, sub.currency, exchangeRates))}</Text>
                            </View>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'analytics' && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 4 }}>
                  Finansal Analiz & Raporlar
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 16 }}>
                  Aylık harcama dağılımları, ödeme yöntemi analizi ve trendler (2025 - 2030)
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  {YEARS.map(y => (
                    <TouchableOpacity
                      key={y}
                      style={[styles.yearChip, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1 }, selectedAnalysisYear === y && styles.yearChipActive]}
                      onPress={() => setSelectedAnalysisYear(y)}
                    >
                      <Text style={[styles.yearChipText, { color: theme.textSecondary }, selectedAnalysisYear === y && styles.yearChipTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Quick summary row so the user sees the big picture before the bar chart */}
                <View style={styles.summaryMiniRow}>
                  <View style={[styles.summaryMiniCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.summaryMiniLabel, { color: theme.textSecondary }]}>Aylık Ortalama</Text>
                    <Text style={[styles.summaryMiniValue, { color: theme.textPrimary }]} numberOfLines={1}>
                      {formatShortCurrency(averageMonthlyExpense, 'TRY')}
                    </Text>
                  </View>
                  <View style={[styles.summaryMiniCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.summaryMiniLabel, { color: theme.textSecondary }]}>En Yüksek Kategori</Text>
                    <Text style={[styles.summaryMiniValue, { color: theme.textPrimary }]} numberOfLines={1}>
                      {topCategoryLabel}
                    </Text>
                  </View>
                </View>

                <View style={[styles.chartContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 14 }}>
                    {selectedAnalysisYear} Aylık Harcama Grafiği (TL)
                  </Text>

                  <View style={styles.barsAreaContainer}>
                    {monthlyTotals.map((tot, mIdx) => {
                      const heightPercent = maxMonthlyExpense > 0 ? (tot / maxMonthlyExpense) * 100 : 0;
                      const barColor = tot > 0 ? monthlyDominantColor[mIdx] : 'transparent';

                      return (
                        <View key={mIdx} style={styles.barColumn}>
                          <View style={[styles.barTrack, { backgroundColor: theme.inputBg }]}>
                            <View style={[styles.barFill, { height: `${Math.max(heightPercent, 6)}%`, backgroundColor: barColor }]} />
                          </View>
                          <Text style={[styles.barLabel, { color: theme.textPrimary }]}>{MONTH_NAMES[mIdx].substring(0, 3)}</Text>
                          <Text style={[styles.barAmountText, { color: theme.textSecondary }]}>{tot > 0 ? formatShortCurrency(tot, 'TRY') : '-'}</Text>
                        </View>
                      );
                    })}
                  </View>

                  <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder }]}>
                    <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 'bold' }}>
                      Yıllık Toplam Harcama ({selectedAnalysisYear}):
                    </Text>
                    <Text style={{ color: theme.accent, fontSize: 18, fontWeight: 'bold' }}>
                      {formatCurrency(totalYearlyExpenseForSelectedYear, 'TRY')}
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textPrimary, marginTop: 18, marginBottom: 10 }}>
                  💳 Ödeme Yöntemine Göre Harcama Dağılımı ({selectedAnalysisYear})
                </Text>

                {sortedPaymentMethodEntries.length === 0 ? (
                  <Text style={{ color: theme.textSecondary, fontStyle: 'italic', fontSize: 12 }}>Kayıtlı ödeme yöntemi verisi bulunamadı.</Text>
                ) : (
                  sortedPaymentMethodEntries.map(([method, amount]) => {
                    const percentage = totalYearlyExpenseForSelectedYear > 0
                      ? ((amount / totalYearlyExpenseForSelectedYear) * 100).toFixed(1)
                      : 0;

                    return (
                      <View key={method} style={[styles.categoryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 13 }}>💳 {method}</Text>
                          <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 13 }}>{formatCurrency(amount, 'TRY')} (%{percentage})</Text>
                        </View>
                        <View style={[styles.progressBarBg, { backgroundColor: theme.inputBg }]}>
                          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: theme.accent }]} />
                        </View>
                      </View>
                    );
                  })
                )}

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textPrimary, marginTop: 18, marginBottom: 10 }}>
                  📂 Kategori Bazlı Dağılım ({selectedAnalysisYear})
                </Text>

                {sortedCategoryEntries.length === 0 ? (
                  <Text style={{ color: theme.textSecondary, fontStyle: 'italic', fontSize: 12 }}>Kayıtlı veri bulunamadı.</Text>
                ) : (
                  sortedCategoryEntries.map(([cat, amount]) => {
                    const catColor = CATEGORY_COLORS[cat] || '#6366f1';
                    const percentage = totalYearlyExpenseForSelectedYear > 0
                      ? ((amount / totalYearlyExpenseForSelectedYear) * 100).toFixed(1)
                      : 0;

                    return (
                      <View key={cat} style={[styles.categoryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 13 }}>{cat}</Text>
                          <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 13 }}>{formatCurrency(amount, 'TRY')} (%{percentage})</Text>
                        </View>
                        <View style={[styles.progressBarBg, { backgroundColor: theme.inputBg }]}>
                          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: catColor }]} />
                        </View>
                      </View>
                    );
                  })
                )}

                <View style={[styles.backupPanel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, marginTop: 20 }]}>
                  <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>💾 Veri Yedekleme & Dışa Aktar</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 12 }}>Abonelik verilerinizi Excel (CSV) veya JSON formatında bilgisayarınıza indirebilirsiniz.</Text>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={[styles.exportBtn, { flex: 1, backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={handleExportCSV}>
                      <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: 'bold' }}>📄 CSV İndir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.exportBtn, { flex: 1, backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={handleExportJSON}>
                      <Text style={{ color: theme.accent, fontSize: 12, fontWeight: 'bold' }}>💾 JSON Yedek Al</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            )}

          </ScrollView>

          {!isDesktop && (
            <View style={[styles.bottomNav, { backgroundColor: theme.headerBg, borderTopColor: theme.cardBorder }]}>
              <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('list')}>
                <Text style={{ fontSize: 18 }}>💳</Text>
                <Text style={[styles.navText, { color: activeTab === 'list' ? '#6366f1' : theme.textSecondary }]}>Abonelikler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('calendar')}>
                <Text style={{ fontSize: 18 }}>📅</Text>
                <Text style={[styles.navText, { color: activeTab === 'calendar' ? '#6366f1' : theme.textSecondary }]}>Takvim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('analytics')}>
                <Text style={{ fontSize: 18 }}>📊</Text>
                <Text style={[styles.navText, { color: activeTab === 'analytics' ? '#6366f1' : theme.textSecondary }]}>Analiz</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

      </View>

      {/* FORM MODAL */}
      <Modal visible={isModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              {editingId ? 'Abonelik Düzenle' : 'Yeni Abonelik Ekle'}
            </Text>

            <ScrollView style={{ maxHeight: 440 }} showsVerticalScrollIndicator={false}>
              {!editingId && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>HIZLI ŞABLON SEÇ:</Text>
                  {/* Was a horizontal ScrollView — chips got clipped off-screen.
                      flexWrap lets them wrap to as many rows as needed instead. */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {popularServicesList.map((srv, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.templateChip, { backgroundColor: srv.color }]}
                        onPress={() => {
                          setFormName(srv.name);
                          setFormPrice(srv.price);
                          setFormCurrency(srv.currency);
                          setFormCategory(srv.category);
                          setFormColor(srv.color);
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{srv.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Servis / Abonelik Adı</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                placeholder="Örn: Netflix, Spotify"
                placeholderTextColor={theme.textMuted}
                value={formName}
                onChangeText={setFormName}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Tutar / Fiyat</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={formPrice}
                    onChangeText={setFormPrice}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Para Birimi</Text>
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                    {['TRY', 'USD', 'EUR'].map(curr => (
                      <TouchableOpacity
                        key={curr}
                        style={[styles.currBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }, formCurrency === curr && styles.currBtnActive]}
                        onPress={() => setFormCurrency(curr)}
                      >
                        <Text style={[styles.currBtnText, { color: theme.textSecondary }, formCurrency === curr && styles.currBtnTextActive]}>{curr}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 8 }]}>Ödeme Periyodu</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                <TouchableOpacity
                  style={[styles.periodBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }, formPeriod === 'monthly' && styles.periodBtnActive]}
                  onPress={() => setFormPeriod('monthly')}
                >
                  <Text style={[styles.periodBtnText, { color: theme.textSecondary }, formPeriod === 'monthly' && styles.periodBtnTextActive]}>Aylık</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.periodBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }, formPeriod === 'yearly' && styles.periodBtnActive]}
                  onPress={() => setFormPeriod('yearly')}
                >
                  <Text style={[styles.periodBtnText, { color: theme.textSecondary }, formPeriod === 'yearly' && styles.periodBtnTextActive]}>Yıllık</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 8 }]}>Ödeme Yapılan Kart / Hesap</Text>
              {/* Was a horizontal ScrollView — same clipping issue as the template chips. */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {paymentMethodsList.map(pm => (
                  <TouchableOpacity
                    key={pm}
                    style={[styles.filterChip, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPaymentMethod === pm && styles.filterChipActive]}
                    onPress={() => setFormPaymentMethod(pm)}
                  >
                    <Text style={[styles.filterChipText, { color: theme.textSecondary }, formPaymentMethod === pm && styles.filterChipTextActive]}>{pm}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 8 }]}>Hatırlatıcı Kuralı</Text>
              {/* Was a horizontal ScrollView — "3 Gün Ö..." was getting cut off here. */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {NOTIFICATION_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.filterChip, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationDays === opt.value && styles.filterChipActive]}
                    onPress={() => setFormNotificationDays(opt.value)}
                  >
                    <Text style={[styles.filterChipText, { color: theme.textSecondary }, formNotificationDays === opt.value && styles.filterChipTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooterButtons}>
              <TouchableOpacity style={[styles.modalCancelBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={() => setIsModalOpen(false)}>
                <Text style={{ color: theme.textSecondary, fontWeight: 'bold' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveForm}>
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appWrapper: { flex: 1 },
  appWrapperDesktop: { flexDirection: 'row' },
  sidebarContainer: {
    width: 250,
    borderRightWidth: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  sidebarNavGroup: { gap: 8, marginTop: 12 },
  sidebarNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sidebarNavBtnActive: {
    backgroundColor: '#6366f120',
  },
  sidebarNavText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exportBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  responsiveWrapper: {
    maxWidth: 820,
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
    flex: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  proBadge: { backgroundColor: '#6366f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  proBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  themeToggleIconBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 90, paddingTop: 14 },

  currencyBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  currencyBarTitle: { fontSize: 12, fontWeight: 'bold' },
  currencyBadgeGroup: { flexDirection: 'row', gap: 8 },
  currencyBadge: { backgroundColor: '#6366f122', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  currencyBadgeText: { color: '#6366f1', fontSize: 11, fontWeight: 'bold' },

  summaryCard: { borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1 },
  summaryLabel: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', opacity: 0.9 },
  summaryValue: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 8, borderRadius: 8 },
  statLabel: { color: '#ffffff', fontSize: 11, opacity: 0.9 },
  statValue: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 10 },

  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  filterChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  filterChipText: { fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#ffffff', fontWeight: 'bold' },

  emptyCard: { borderRadius: 12, padding: 20, borderWidth: 1, alignItems: 'center' },
  card: { borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  brandIconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  brandIconText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardTagText: { fontSize: 11, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  rightSection: { alignItems: 'flex-end' },
  price: { fontSize: 14, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  editBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { fontSize: 11, fontWeight: 'bold' },
  deleteBtn: { padding: 4, borderRadius: 6 },

  calendarHeaderNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calendarTitleText: { fontSize: 16, fontWeight: 'bold' },
  arrowBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  arrowText: { fontSize: 12, fontWeight: 'bold' },

  calendarWrapper: { width: '100%' },
  weekHeaderRow: { flexDirection: 'row', marginBottom: 6 },
  weekHeaderCell: { width: '14.28%', alignItems: 'center' },
  weekHeaderText: { fontSize: 12, fontWeight: 'bold' },

  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDayBox: { width: '14.28%', minHeight: 74, borderRadius: 6, padding: 3, borderWidth: 1, marginBottom: 4 },
  activeDayBox: { borderColor: '#6366f1', borderWidth: 1.5 },
  dayNumber: { fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  daySubBadge: { borderRadius: 4, padding: 2, marginTop: 2 },
  daySubText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  daySubPrice: { color: '#ffffff', fontSize: 7, fontWeight: '600' },

  yearChip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 16, marginRight: 6, borderWidth: 1 },
  yearChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  yearChipText: { fontWeight: '600', fontSize: 12 },
  yearChipTextActive: { color: '#ffffff', fontWeight: 'bold' },

  summaryMiniRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryMiniCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1 },
  summaryMiniLabel: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  summaryMiniValue: { fontSize: 15, fontWeight: 'bold' },

  chartContainer: { borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1 },
  barsAreaContainer: { flexDirection: 'row', height: 160, alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 8 },
  barColumn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  barTrack: { width: 16, height: 100, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 11, marginTop: 6, fontWeight: 'bold' },
  barAmountText: { fontSize: 9, marginTop: 2, fontWeight: '600' },

  chartFooter: { borderTopWidth: 1, paddingTop: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  categoryCard: { padding: 10, borderRadius: 8, marginBottom: 6, borderWidth: 1 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  backupPanel: { padding: 12, borderRadius: 10, borderWidth: 1 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', height: 56, borderTopWidth: 1, justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { width: '100%', maxWidth: 480, maxHeight: '88%', borderRadius: 14, padding: 16, borderWidth: 1 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 3 },
  textInput: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, fontSize: 13, marginBottom: 8 },
  currBtn: { flex: 1, paddingVertical: 6, borderRadius: 6, alignItems: 'center', borderWidth: 1 },
  currBtnActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  currBtnText: { fontSize: 11, fontWeight: 'bold' },
  currBtnTextActive: { color: '#fff' },
  periodBtn: { flex: 1, paddingVertical: 6, borderRadius: 6, alignItems: 'center', borderWidth: 1 },
  periodBtnActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  periodBtnText: { fontSize: 11, fontWeight: 'bold' },
  periodBtnTextActive: { color: '#fff' },
  templateChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },

  modalFooterButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

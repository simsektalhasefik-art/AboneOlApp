import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = '@cebin_subscriptions_v2';

const CATEGORY_COLORS = {
  'Eğlence': '#ef4444',     // Kırmızı
  'Müzik': '#10b981',       // Yeşil
  'Depolama': '#3b82f6',    // Mavi
  'Yazılım & AI': '#8b5cf6', // Mor
  'Spor': '#f59e0b',        // Turuncu
  'Diğer': '#64748b'        // Gri
};

const PAYMENT_METHODS = [
  'Garanti Bonus', 'Enpara', 'Papara', 'İş Bankası', 'Yapı Kredi', 'Nays', 'QNB', 'Nakit/Diğer'
];

const CURRENCY_SYMBOLS = {
  TRY: '₺',
  USD: '$',
  EUR: '€'
};

// Güncellenmiş Döviz Kurları (TL karşılığı)
const DEFAULT_RATES = {
  TRY: 1,
  USD: 36.40,
  EUR: 39.80
};

const NOTIFICATION_OPTIONS = [
  { label: '🚫 Bildirim Yok', value: -1 },
  { label: '⚡ Ödeme Günü (Aynı Gün)', value: 0 },
  { label: '🔔 1 Gün Önce', value: 1 },
  { label: '🔔 2 Gün Önce', value: 2 },
  { label: '🔔 3 Gün Önce', value: 3 },
  { label: '🔔 5 Gün Önce', value: 5 },
  { label: '🔔 7 Gün (1 Hafta) Önce', value: 7 },
];

const DEFAULT_SUBSCRIPTIONS = [
  { id: '1', name: 'Netflix', price: 345, currency: 'TRY', category: 'Eğlence', paymentMethod: 'Garanti Bonus', billingDay: 7, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.netflix.com/youraccount', color: '#E50914', notificationDays: 2 },
  { id: '2', name: 'YouTube Premium', price: 79, currency: 'TRY', category: 'Eğlence', paymentMethod: 'Enpara', billingDay: 15, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://www.youtube.com/paid_memberships', color: '#FF0000', notificationDays: 1 },
  { id: '3', name: 'ChatGPT Plus', price: 20, currency: 'USD', category: 'Yazılım & AI', paymentMethod: 'Papara', billingDay: 12, billingMonth: 8, billingYear: 2026, period: 'monthly', cancelUrl: 'https://chatgpt.com/#settings', color: '#10A37F', notificationDays: 3 }
];

const DEFAULT_POPULAR_SERVICES = [
  { name: 'Netflix', price: 345, currency: 'TRY', category: 'Eğlence', color: '#E50914', cancelUrl: 'https://www.netflix.com/youraccount' },
  { name: 'Exxen', price: 160, currency: 'TRY', category: 'Eğlence', color: '#FACC15', cancelUrl: 'https://www.exxen.com/tr/account' },
  { name: 'YouTube Premium', price: 79, currency: 'TRY', category: 'Eğlence', color: '#FF0000', cancelUrl: 'https://www.youtube.com/paid_memberships' },
  { name: 'Spotify', price: 59, currency: 'TRY', category: 'Müzik', color: '#1DB954', cancelUrl: 'https://www.spotify.com/account/overview/' },
  { name: 'Prime Video', price: 39, currency: 'TRY', category: 'Eğlence', color: '#00A8E1', cancelUrl: 'https://www.amazon.com.tr/mc/manage' },
  { name: 'iCloud', price: 2.99, currency: 'USD', category: 'Depolama', color: '#38BDF8', cancelUrl: 'https://support.apple.com/HT207594' },
  { name: 'ChatGPT Plus', price: 20, currency: 'USD', category: 'Yazılım & AI', color: '#10A37F', cancelUrl: 'https://chatgpt.com/#settings' },
];

const CATEGORIES = ['Eğlence', 'Müzik', 'Depolama', 'Yazılım & AI', 'Spor', 'Diğer'];

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const getDaysInMonth = (monthIndex, year) => {
  return new Date(Number(year) || 2026, (Number(monthIndex) || 0) + 1, 0).getDate();
};

// Ayın 1. gününün haftanın hangi günü olduğunu hesaplar (0: Pazartesi ... 6: Pazar)
const getFirstDayOffset = (monthIndex, year) => {
  const day = new Date(Number(year) || 2026, Number(monthIndex) || 0, 1).getDay();
  return day === 0 ? 6 : day - 1; 
};

const formatCurrency = (amount, currency = 'TRY') => {
  const val = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '₺';
  return `${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
};

const formatShortCurrency = (amount, currency = 'TRY') => {
  const val = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '₺';
  if (val === 0) return `0 ${symbol}`;
  return `${val.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ${symbol}`;
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
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Kullanıcı tarafından eklenebilen liste durumları
  const [paymentMethodsList, setPaymentMethodsList] = useState(PAYMENT_METHODS);
  const [popularServicesList, setPopularServicesList] = useState(DEFAULT_POPULAR_SERVICES);
  const [isAddingNewPaymentMethod, setIsAddingNewPaymentMethod] = useState(false);
  const [newCustomPaymentMethod, setNewCustomPaymentMethod] = useState('');
  const [isAddingNewService, setIsAddingNewService] = useState(false);
  const [newCustomServiceName, setNewCustomServiceName] = useState('');
  const [newCustomServicePrice, setNewCustomServicePrice] = useState('');

  const [activeTab, setActiveTab] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  const [calMonth, setCalMonth] = useState(7); // Ağustos (0-indexed 7)
  const [calYear, setCalYear] = useState(2026);
  const [calendarViewMode, setCalendarViewMode] = useState('monthly');
  const [selectedAnalysisYear, setSelectedAnalysisYear] = useState(2026);

  // Bildirim izni durumu
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Form State
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
  const [formNotificationDays, setFormNotificationDays] = useState(2); // Varsayılan: 2 Gün Önce

  // Canlı Döviz Kuru Çekme
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.TRY) {
          const usdTry = data.rates.TRY;
          const eurTry = data.rates.TRY / (data.rates.EUR || 0.92);
          setExchangeRates({
            TRY: 1,
            USD: Number(usdTry.toFixed(2)),
            EUR: Number(eurTry.toFixed(2))
          });
        }
      } catch (e) {
        console.log('Canlı kur çekilemedi, varsayılan kurlar kullanılıyor:', e);
      }
    };

    fetchRates();
  }, []);

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

        // Web Notification Izni Kontrolu
        if (typeof window !== 'undefined' && 'Notification' in window) {
          setNotificationPermission(Notification.permission);
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
    if (!isLoaded) return;

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

  const requestNotificationAccess = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification("Cebin Finance", {
          body: "Hatırlatıcı bildirimleri başarıyla aktifleştirildi!",
          icon: "https://fav.farm/💳"
        });
      }
    }
  };

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];

  // Tutar TL Çevirici Yardımcı Fonksiyon
  const convertToTL = (price, currency) => {
    const rate = exchangeRates[currency] || 1;
    return (Number(price) || 0) * rate;
  };

  const theme = {
    bg: isDarkMode ? '#090d16' : '#f1f5f9',
    headerBg: isDarkMode ? '#0f172a' : '#ffffff',
    cardBg: isDarkMode ? '#151f30' : '#ffffff',
    summaryBg: isDarkMode ? '#1e1b4b' : '#4f46e5',
    summaryBorder: isDarkMode ? '#312e81' : '#4338ca',
    cardBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    textPrimary: isDarkMode ? '#ffffff' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
    inputBg: isDarkMode ? '#0f172a' : '#f8fafc',
    accent: isDarkMode ? '#38bdf8' : '#0284c7',
  };

  // Toplam Aylık Taahhüt (Tüm para birimleri TL'ye dönüştürülerek hesaplanır)
  const monthlyTotalTL = safeList.reduce((sum, item) => {
    if (!item) return sum;
    const priceTL = convertToTL(item.price, item.currency || 'TRY');
    const cost = item.period === 'yearly' ? priceTL / 12 : priceTL;
    return sum + cost;
  }, 0);

  const calculateMonthTotalTL = (monthIndex, year) => {
    return safeList.reduce((sum, item) => {
      const priceTL = convertToTL(item.price, item.currency || 'TRY');
      if (item.period === 'monthly') {
        return sum + priceTL;
      } else if (item.period === 'yearly') {
        const subMonth = Number(item.billingMonth || 1) - 1;
        const subYear = Number(item.billingYear || 2026);
        if (subMonth === monthIndex && subYear === year) {
          return sum + priceTL;
        }
      }
      return sum;
    }, 0);
  };

  const currentCalMonthTotalTL = calculateMonthTotalTL(calMonth, calYear);

  // Yaklaşan Ödemeler (Her aboneliğin kendi bildirim gününe göre hesaplama)
  const getUpcomingPayments = () => {
    const todayDay = 8; // Örnek referans gün
    return safeList.filter(s => {
      const notifDays = s.notificationDays !== undefined ? s.notificationDays : 2;
      if (notifDays === -1) return false; // Bildirim yok
      const dayDiff = Number(s.billingDay) - todayDay;
      return dayDiff >= 0 && dayDiff <= notifDays;
    });
  };

  const upcomingPayments = getUpcomingPayments();

  const getDetailedMonthlyBreakdown = (targetYear) => {
    const monthlyCategoryData = Array(12).fill(null).map(() => ({}));
    const monthlyTotals = Array(12).fill(0);

    safeList.forEach(sub => {
      const priceTL = convertToTL(sub.price, sub.currency || 'TRY');
      const cat = sub.category || 'Diğer';

      if (sub.period === 'monthly') {
        for (let m = 0; m < 12; m++) {
          monthlyCategoryData[m][cat] = (monthlyCategoryData[m][cat] || 0) + priceTL;
          monthlyTotals[m] += priceTL;
        }
      } else if (sub.period === 'yearly') {
        const subMonthIndex = Number(sub.billingMonth || 1) - 1;
        const subYear = Number(sub.billingYear || 2026);
        if (subYear === targetYear) {
          monthlyCategoryData[subMonthIndex][cat] = (monthlyCategoryData[subMonthIndex][cat] || 0) + priceTL;
          monthlyTotals[subMonthIndex] += priceTL;
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
    const priceTL = convertToTL(item.price, item.currency || 'TRY');
    if (item.period === 'monthly') {
      acc[cat] = (acc[cat] || 0) + (priceTL * 12);
    } else if (item.period === 'yearly' && Number(item.billingYear || 2026) === selectedAnalysisYear) {
      acc[cat] = (acc[cat] || 0) + priceTL;
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
    setDuplicateWarning('');
    setIsNotificationDropdownOpen(false);
    setIsAddingNewPaymentMethod(false);
    setIsAddingNewService(false);

    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');
      setFormPrice(String(item.price || ''));
      setFormCurrency(item.currency || 'TRY');
      setFormDay(String(item.billingDay || '1'));
      setFormMonth(String(item.billingMonth || '8'));
      setFormYear(String(item.billingYear || '2026'));
      setFormCategory(item.category || 'Eğlence');
      setFormPaymentMethod(item.paymentMethod || 'Garanti Bonus');
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
      setFormYear('2026');
      setFormCategory('Eğlence');
      setFormPaymentMethod('Garanti Bonus');
      setFormPeriod('monthly');
      setFormCancelUrl('');
      setFormColor('#6366F1');
      setFormNotificationDays(2);
    }
    setIsModalOpen(true);
  };

  const handleAddCustomPaymentMethod = () => {
    if (!newCustomPaymentMethod.trim()) return;
    const addedName = newCustomPaymentMethod.trim();
    if (!paymentMethodsList.includes(addedName)) {
      setPaymentMethodsList([...paymentMethodsList, addedName]);
    }
    setFormPaymentMethod(addedName);
    setNewCustomPaymentMethod('');
    setIsAddingNewPaymentMethod(false);
  };

  const handleAddCustomService = () => {
    if (!newCustomServiceName.trim()) return;
    const name = newCustomServiceName.trim();
    const price = Number(newCustomServicePrice) || 0;
    const newService = {
      name,
      price,
      currency: 'TRY',
      category: 'Diğer',
      color: getServiceColor(name),
      cancelUrl: ''
    };
    setPopularServicesList([...popularServicesList, newService]);
    selectPopularService(newService);
    setNewCustomServiceName('');
    setNewCustomServicePrice('');
    setIsAddingNewService(false);
  };

  const selectPopularService = (service) => {
    setFormName(service.name);
    setFormPrice(String(service.price));
    setFormCurrency(service.currency || 'TRY');
    setFormCategory(service.category || 'Eğlence');
    setFormCancelUrl(service.cancelUrl || '');
    setFormColor(service.color || getServiceColor(service.name));
    checkDuplicate(service.name);
  };

  const checkDuplicate = (name) => {
    const exists = safeList.some(
      s => s.name.toLowerCase().trim() === name.toLowerCase().trim() && s.id !== editingId
    );
    if (exists) {
      setDuplicateWarning(`⚠️ "${name}" adında bir abonelik zaten mevcut! Tekrar eklemek istediğinize emin misiniz?`);
    } else {
      setDuplicateWarning('');
    }
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;

    const normalizedPrice = Number(formPrice.replace(',', '.'));
    const parsedMonth = Math.min(Math.max(Number(formMonth) || 1, 1), 12);
    const parsedYear = Number(formYear) || 2026;

    const maxDaysInSelectedMonth = formPeriod === 'yearly' 
      ? getDaysInMonth(parsedMonth - 1, parsedYear)
      : 31;
    
    const rawDay = Number(formDay) || 1;
    const clampedDay = Math.min(Math.max(rawDay, 1), maxDaysInSelectedMonth);

    const subData = {
      name: formName.trim(),
      price: isNaN(normalizedPrice) ? 0 : normalizedPrice,
      currency: formCurrency,
      billingDay: clampedDay,
      billingMonth: parsedMonth,
      billingYear: parsedYear,
      category: formCategory,
      paymentMethod: formPaymentMethod,
      period: formPeriod,
      notificationDays: formNotificationDays,
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Desktop Responsive Kapsayıcı Container */}
      <View style={styles.responsiveWrapper}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.cardBorder }]}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>FINANCE 2.0</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik & Bütçe Asistanı</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity 
              style={[
                styles.iconBtn, 
                { backgroundColor: notificationPermission === 'granted' ? '#10b98122' : theme.cardBg, borderColor: theme.cardBorder }
              ]} 
              onPress={requestNotificationAccess}
              title="Bildirimleri Yönet"
            >
              <Text style={{ fontSize: 16 }}>{notificationPermission === 'granted' ? '🔔' : '🔕'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.themeToggleBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]} 
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={{ fontSize: 16 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={() => openForm()}>
              <Text style={styles.addBtnText}>+ Yeni Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* DÖVİZ KURLARI BİLGİ BARI */}
          <View style={[styles.currencyBar, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.currencyBarTitle, { color: theme.textSecondary }]}>Güncel Canlı Kurlar (TL):</Text>
            <View style={styles.currencyBadgeGroup}>
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyBadgeText}>USD: {exchangeRates.USD} ₺</Text>
              </View>
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyBadgeText}>EUR: {exchangeRates.EUR} ₺</Text>
              </View>
            </View>
          </View>

          {/* YAKLAŞAN ÖDEMELER / BİLDİRİM BANNER'I */}
          {upcomingPayments.length > 0 && (
            <View style={[styles.reminderBanner, { backgroundColor: '#f59e0b15', borderColor: '#f59e0b' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>⏰</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 13 }}>Hatırlatma: Yaklaşan Ödemeleriniz Var!</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                    {upcomingPayments.map(p => {
                      const notifText = p.notificationDays === 0 ? 'Bugün' : `${p.notificationDays || 2} gün içinde`;
                      return `${p.name} (${p.billingDay} Ağs - ${notifText})`;
                    }).join(', ')} için son ödeme yaklaşıyor.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ... existing code tabs ... */}
          {activeTab === 'list' && (
            <>
              {/* ÖZET KARTI */}
              <View style={[styles.summaryCard, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }]}>
                <Text style={styles.summaryLabel}>Toplam Aylık Taahhüt (TL Karşılığı)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(monthlyTotalTL, 'TRY')}</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Günlük Tahmini</Text>
                    <Text style={styles.statValue}>{formatCurrency(monthlyTotalTL / 30, 'TRY')}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Yıllık Toplam Projeksiyon</Text>
                    <Text style={styles.statValue}>{formatCurrency(monthlyTotalTL * 12, 'TRY')}</Text>
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
                  const priceInTL = convertToTL(item.price, item.currency || 'TRY');
                  const notifOpt = NOTIFICATION_OPTIONS.find(o => o.value === item.notificationDays) || NOTIFICATION_OPTIONS[2];

                  return (
                    <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                      <View style={styles.leftSection}>
                        <View style={[styles.brandIconBox, { backgroundColor: serviceColor }]}>
                          <Text style={styles.brandIconText}>{item.name ? item.name.charAt(0).toUpperCase() : 'C'}</Text>
                        </View>
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.name}</Text>
                            {item.paymentMethod && (
                              <View style={[styles.cardTag, { backgroundColor: theme.inputBg }]}>
                                <Text style={[styles.cardTagText, { color: theme.textSecondary }]}>💳 {item.paymentMethod}</Text>
                              </View>
                            )}
                            <View style={[styles.cardTag, { backgroundColor: theme.inputBg }]}>
                              <Text style={[styles.cardTagText, { color: theme.accent }]}>{notifOpt.label}</Text>
                            </View>
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
                          <Text style={{ fontSize: 11, color: theme.accent, marginTop: 1 }}>
                            ≈ {formatCurrency(priceInTL, 'TRY')}
                          </Text>
                        )}
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

          {activeTab === 'calendar' && (
            /* ... existing calendar content ... */
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
                  {Array.from({ length: getDaysInMonth(calMonth, calYear) }, (_, i) => i + 1).map((day) => {
                    const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));

                    return (
                      <View key={day} style={[styles.dailyRow, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <Text style={[styles.dailyDayText, { color: theme.textSecondary }]}>{day} {MONTH_NAMES[calMonth]}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                          {daySubs.length > 0 ? daySubs.map(s => {
                            const sColor = s.color || getServiceColor(s.name);
                            return (
                              <View key={s.id} style={[styles.brandBadge, { backgroundColor: sColor }]}>
                                <Text style={styles.brandBadgeText}>{s.name} ({formatCurrency(s.price, s.currency)})</Text>
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
                <View style={styles.calendarWrapper}>
                  <View style={styles.weekHeaderRow}>
                    {WEEK_DAYS.map(wd => (
                      <View key={wd} style={styles.weekHeaderCell}>
                        <Text style={[styles.weekHeaderText, { color: theme.textSecondary }]}>{wd}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.calendarGrid}>
                    {Array.from({ length: getFirstDayOffset(calMonth, calYear) }).map((_, idx) => (
                      <View key={`offset-${idx}`} style={[styles.calendarDayBox, styles.emptyDayBox, { backgroundColor: 'transparent' }]} />
                    ))}

                    {Array.from({ length: getDaysInMonth(calMonth, calYear) }, (_, i) => i + 1).map((day) => {
                      const daySubs = safeList.filter(s => isSubActiveOnDay(s, day));
                      return (
                        <View key={day} style={[styles.calendarDayBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, daySubs.length > 0 && styles.activeDayBox]}>
                          <Text style={[styles.dayNumber, { color: theme.textSecondary }]}>{day}</Text>
                          {daySubs.map(s => {
                            const sColor = s.color || getServiceColor(s.name);
                            return (
                              <View key={s.id} style={[styles.daySubBadge, { backgroundColor: sColor }]}>
                                <Text style={styles.daySubText} numberOfLines={1}>{s.name}</Text>
                                <Text style={styles.daySubPrice}>{formatShortCurrency(s.price, s.currency)}</Text>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={[styles.monthTotalFooterCard, { backgroundColor: theme.headerBg, borderColor: theme.cardBorder }]}>
                <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '600' }}>
                  {MONTH_NAMES[calMonth]} {calYear} Dönemi Toplam Ödeme (TL):
                </Text>
                <Text style={{ color: theme.accent, fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
                  {formatCurrency(currentCalMonthTotalTL, 'TRY')}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'analytics' && (
            /* ... existing analytics content ... */
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 4 }}>Finansal Analiz & Grafikler</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 16 }}>Aylık harcama dağılımları ve yıllık trendler</Text>

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

                        <Text style={[styles.barLabel, { color: theme.textPrimary }]}>{mName.substr(0, 3)}</Text>
                        <Text style={[styles.barAmountText, { color: totalVal > 0 ? theme.accent : theme.textSecondary }]}>
                          {formatShortCurrency(totalVal, 'TRY')}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder }]}>
                  <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Yıllık Toplam Harcama:</Text>
                  <Text style={{ color: theme.accent, fontSize: 22, fontWeight: 'bold' }}>{formatCurrency(totalYearlyExpenseForSelectedYear, 'TRY')}</Text>
                </View>
              </View>

              <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 12 }}>
                🏷️ Kategori Bazlı Dağılım
              </Text>
              {Object.keys(yearlyCategoryStats).map((cat) => {
                const amountTL = yearlyCategoryStats[cat];
                const percentage = totalYearlyExpenseForSelectedYear > 0 ? ((amountTL / totalYearlyExpenseForSelectedYear) * 100).toFixed(1) : 0;
                const catColor = CATEGORY_COLORS[cat] || '#38bdf8';

                return (
                  <View key={cat} style={[styles.categoryCard, { backgroundColor: theme.cardBg }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: catColor }} />
                        <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>{cat}</Text>
                      </View>
                      <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{formatCurrency(amountTL, 'TRY')} (%{percentage})</Text>
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

        {/* YENİLENMİŞ YÜKSEK GÖRSEL AÇILIMLI ALT NAVİGASYON BAR (RESİM 2 DÜZELTMESİ) */}
        <View style={[styles.bottomNavContainer, { backgroundColor: theme.headerBg, borderTopColor: theme.cardBorder }]}>
          <TouchableOpacity 
            style={[styles.navTabBtn, activeTab === 'list' && styles.navTabBtnActive]} 
            onPress={() => setActiveTab('list')}
            activeOpacity={0.7}
          >
            <View style={[styles.navIconCircle, activeTab === 'list' && styles.navIconCircleActive]}>
              <Text style={{ fontSize: 22 }}>💳</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === 'list' ? '#6366f1' : theme.textSecondary }]}>
              Abonelikler
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTabBtn, activeTab === 'calendar' && styles.navTabBtnActive]} 
            onPress={() => setActiveTab('calendar')}
            activeOpacity={0.7}
          >
            <View style={[styles.navIconCircle, activeTab === 'calendar' && styles.navIconCircleActive]}>
              <Text style={{ fontSize: 22 }}>📅</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === 'calendar' ? '#6366f1' : theme.textSecondary }]}>
              Takvim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTabBtn, activeTab === 'analytics' && styles.navTabBtnActive]} 
            onPress={() => setActiveTab('analytics')}
            activeOpacity={0.7}
          >
            <View style={[styles.navIconCircle, activeTab === 'analytics' && styles.navIconCircleActive]}>
              <Text style={{ fontSize: 22 }}>📊</Text>
            </View>
            <Text style={[styles.navTabText, { color: activeTab === 'analytics' ? '#6366f1' : theme.textSecondary }]}>
              Analiz
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* DÜZELTİLMİŞ VE KULLANICI EKLEMELİ FORM MODALI */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{editingId ? 'Abonelik Bilgilerini Düzenle' : 'Yeni Abonelik Tanımla'}</Text>

            {/* MÜKERRER KAYIT UYARISI BANNER'I */}
            {duplicateWarning ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>{duplicateWarning}</Text>
              </View>
            ) : null}

            {/* HIZLI EKLE (POPÜLER SERVİSLER) - DÜZELTİLMİŞ TAŞMA SIZDIRMASIZ SCROLL + KULLANICI EKLEME */}
            {!editingId && (
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary, marginBottom: 0 }]}>Hızlı Ekle (Popüler Servisler):</Text>
                  <TouchableOpacity onPress={() => setIsAddingNewService(!isAddingNewService)}>
                    <Text style={{ color: theme.accent, fontSize: 12, fontWeight: 'bold' }}>
                      {isAddingNewService ? '✕ Kapat' : '+ Özel Servis Ekle'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isAddingNewService && (
                  <View style={[styles.inlineAddBox, { backgroundColor: theme.inputBg }]}>
                    <TextInput 
                      placeholder="Servis Adı (ör: Disney+)" 
                      placeholderTextColor="#64748b" 
                      style={[styles.input, { backgroundColor: theme.cardBg, color: theme.textPrimary, marginBottom: 8 }]}
                      value={newCustomServiceName}
                      onChangeText={setNewCustomServiceName}
                    />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput 
                        placeholder="Fiyat (₺)" 
                        placeholderTextColor="#64748b" 
                        keyboardType="numeric"
                        style={[styles.input, { backgroundColor: theme.cardBg, color: theme.textPrimary, flex: 1, marginBottom: 0 }]}
                        value={newCustomServicePrice}
                        onChangeText={setNewCustomServicePrice}
                      />
                      <TouchableOpacity style={styles.inlineSaveBtn} onPress={handleAddCustomService}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Ekle</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={{ paddingRight: 24, gap: 8, alignItems: 'center' }}
                  style={{ flexDirection: 'row', marginTop: 4 }}
                >
                  {popularServicesList.map((s, idx) => (
                    <TouchableOpacity key={idx} style={[styles.chipBtn, { borderColor: s.color || '#6366F1', borderWidth: 1 }]} onPress={() => selectPopularService(s)}>
                      <Text style={{ color: s.color || '#6366F1', fontSize: 12, fontWeight: 'bold' }}>{s.name}</Text>
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
                checkDuplicate(txt);
              }}
            />

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Kategori:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingRight: 24, gap: 8 }}
              style={{ flexDirection: 'row', marginBottom: 12 }}
            >
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

            {/* ÖDEME YAPILAN KART / YÖNTEM - TAŞMA DÜZELTİLMİŞ + ÖZEL KART EKLEME */}
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary, marginBottom: 0 }]}>Ödeme Yapılan Kart / Yöntem:</Text>
                <TouchableOpacity onPress={() => setIsAddingNewPaymentMethod(!isAddingNewPaymentMethod)}>
                  <Text style={{ color: theme.accent, fontSize: 12, fontWeight: 'bold' }}>
                    {isAddingNewPaymentMethod ? '✕ Kapat' : '+ Özel Kart Ekle'}
                  </Text>
                </TouchableOpacity>
              </View>

              {isAddingNewPaymentMethod && (
                <View style={[styles.inlineAddBox, { backgroundColor: theme.inputBg }]}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput 
                      placeholder="Kart / Yöntem İsmi (ör: DenizBank)" 
                      placeholderTextColor="#64748b" 
                      style={[styles.input, { backgroundColor: theme.cardBg, color: theme.textPrimary, flex: 1, marginBottom: 0 }]}
                      value={newCustomPaymentMethod}
                      onChangeText={setNewCustomPaymentMethod}
                    />
                    <TouchableOpacity style={styles.inlineSaveBtn} onPress={handleAddCustomPaymentMethod}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Kaydet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingRight: 24, gap: 8 }}
                style={{ flexDirection: 'row', marginTop: 4 }}
              >
                {paymentMethodsList.map((method) => (
                  <TouchableOpacity 
                    key={method} 
                    style={[styles.categoryChip, { backgroundColor: theme.inputBg }, formPaymentMethod === method && styles.categoryChipActive]}
                    onPress={() => setFormPaymentMethod(method)}
                  >
                    <Text style={[styles.categoryText, { color: theme.textSecondary }, formPaymentMethod === method && styles.categoryTextActive]}>💳 {method}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* BİLDİRİM / HATIRLATICI ZAMANLAYICI (AÇILIR KAPANIR DROPDOWN LİSTE) */}
            <View style={{ marginBottom: 14 }}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Hatırlatıcı / Bildirim Zamanı:</Text>
              <TouchableOpacity 
                style={[styles.dropdownHeader, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
                onPress={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
              >
                <Text style={{ color: theme.textPrimary, fontWeight: '600', fontSize: 13 }}>
                  {(NOTIFICATION_OPTIONS.find(o => o.value === formNotificationDays) || NOTIFICATION_OPTIONS[2]).label}
                </Text>
                <Text style={{ color: theme.textSecondary }}>{isNotificationDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isNotificationDropdownOpen && (
                <View style={[styles.dropdownBody, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                  {NOTIFICATION_OPTIONS.map((opt) => (
                    <TouchableOpacity 
                      key={opt.value} 
                      style={[
                        styles.dropdownItem, 
                        formNotificationDays === opt.value && { backgroundColor: '#6366f122' }
                      ]}
                      onPress={() => {
                        setFormNotificationDays(opt.value);
                        setIsNotificationDropdownOpen(false);
                      }}
                    >
                      <Text style={{ 
                        color: formNotificationDays === opt.value ? '#6366f1' : theme.textPrimary,
                        fontWeight: formNotificationDays === opt.value ? 'bold' : 'normal',
                        fontSize: 13 
                      }}>
                        {opt.label}
                      </Text>
                      {formNotificationDays === opt.value && <Text style={{ color: '#6366f1' }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

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

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Tutar ve Para Birimi:</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <TextInput 
                placeholder="0,00" 
                placeholderTextColor="#64748b" 
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary, flex: 2, marginBottom: 0 }]}
                value={formPrice}
                onChangeText={(txt) => setFormPrice(txt.replace(/[^0-9,.]/g, ''))}
              />
              {['TRY', 'USD', 'EUR'].map(curr => (
                <TouchableOpacity 
                  key={curr} 
                  style={[
                    styles.currencySelectorBtn, 
                    { backgroundColor: theme.inputBg },
                    formCurrency === curr && styles.currencySelectorBtnActive
                  ]}
                  onPress={() => setFormCurrency(curr)}
                >
                  <Text style={[styles.currencySelectorText, { color: theme.textSecondary }, formCurrency === curr && styles.currencySelectorTextActive]}>
                    {CURRENCY_SYMBOLS[curr]} {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
                {(() => {
                  const m = Math.min(Math.max(Number(formMonth) || 1, 1), 12);
                  const y = Number(formYear) || 2026;
                  const maxDays = getDaysInMonth(m - 1, y);
                  return (
                    <Text style={{ fontSize: 11, color: theme.accent, marginTop: -4, marginBottom: 10 }}>
                      ℹ️ {MONTH_NAMES[m - 1]} {y} dönemi {maxDays} gün çekmektedir.
                    </Text>
                  );
                })()}
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
  // ... existing styles ...
  container: { flex: 1 },
  responsiveWrapper: {
    maxWidth: 1000,
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
    flex: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  proBadge: { backgroundColor: '#6366f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  proBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  iconBtn: { padding: 8, borderRadius: 8, borderWidth: 1 },
  themeToggleBtn: { padding: 8, borderRadius: 8, borderWidth: 1 },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 16 },
  
  currencyBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  currencyBarTitle: { fontSize: 12, fontWeight: '600' },
  currencyBadgeGroup: { flexDirection: 'row', gap: 8 },
  currencyBadge: { backgroundColor: '#6366f122', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  currencyBadgeText: { color: '#6366f1', fontSize: 11, fontWeight: 'bold' },

  reminderBanner: { borderRadius: 10, padding: 12, borderWidth: 1, marginBottom: 16 },

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
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  brandIconBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  brandIconText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardTagText: { fontSize: 10, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  price: { fontSize: 15, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  editBtn: { padding: 4, borderRadius: 6 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cancelText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },
  deleteBtn: { padding: 4, borderRadius: 6 },

  calendarHeaderNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calendarTitleText: { fontSize: 18, fontWeight: 'bold' },
  arrowBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  arrowText: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' },
  viewModeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  viewModeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  viewModeBtnActive: { backgroundColor: '#6366f1' },
  viewModeText: { fontSize: 12 },
  viewModeTextActive: { color: '#fff', fontWeight: 'bold' },

  calendarWrapper: { width: '100%' },
  weekHeaderRow: { flexDirection: 'row', marginBottom: 6 },
  weekHeaderCell: { width: '14.28%', alignItems: 'center' },
  weekHeaderText: { fontSize: 12, fontWeight: 'bold' },

  dailyRow: { padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
  dailyDayText: { fontSize: 12, width: 85, fontWeight: '600' },
  brandBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  brandBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  monthTotalFooterCard: { borderWidth: 1, padding: 16, borderRadius: 12, marginTop: 12, alignItems: 'center' },

  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDayBox: { width: '14.28%', minHeight: 82, borderRadius: 8, padding: 4, borderWidth: 1, marginBottom: 4 },
  emptyDayBox: { borderWidth: 0 },
  activeDayBox: { borderColor: '#6366f1', borderWidth: 1.5 },
  dayNumber: { fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  daySubBadge: { borderRadius: 4, padding: 3, marginTop: 2 },
  daySubText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  daySubPrice: { color: '#ffffff', fontSize: 9, fontWeight: '600' },

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
  barTrack: { width: 18, height: 120, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barLabel: { fontSize: 12, marginTop: 6, fontWeight: 'bold' },
  barAmountText: { fontSize: 10, marginTop: 2, fontWeight: 'bold' },

  chartFooter: { borderTopWidth: 1, paddingTop: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  categoryCard: { padding: 12, borderRadius: 10, marginBottom: 8 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  // GÖRSEL ELEMANLARI BÜYÜTÜLMÜŞ VE ŞIKLAŞTIRILMIŞ ALT NAVİGASYON BAR (RESİM 2 İÇİN)
  bottomNavContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    borderTopWidth: 1, 
    flexDirection: 'row', 
    justify: 'space-around', 
    alignItems: 'center',
    paddingVertical: 10, 
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  navTabBtn: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  navTabBtnActive: {
    backgroundColor: '#6366f115'
  },
  navIconCircle: {
    width: 44,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justify: 'center',
    marginBottom: 2
  },
  navIconCircleActive: {
    backgroundColor: '#6366f125',
  },
  navTabText: { 
    fontSize: 12, 
    fontWeight: 'bold',
    letterSpacing: 0.3
  },

  // Modal & Dropdown Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 16, padding: 20, marginVertical: 40, maxWidth: 600, width: '100%', alignSelf: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  input: { padding: 12, borderRadius: 8, marginBottom: 12 },
  chipBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  categoryChipActive: { backgroundColor: '#6366f1' },
  categoryText: { fontSize: 12 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodOption: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  periodActive: { backgroundColor: '#6366f1' },
  periodText: { fontSize: 12 },
  periodTextActive: { color: '#fff', fontWeight: 'bold' },
  
  currencySelectorBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  currencySelectorBtnActive: { backgroundColor: '#6366f1' },
  currencySelectorText: { fontSize: 12, fontWeight: 'bold' },
  currencySelectorTextActive: { color: '#fff' },

  inlineAddBox: { padding: 10, borderRadius: 10, marginBottom: 10 },
  inlineSaveBtn: { backgroundColor: '#6366f1', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1 },
  dropdownBody: { marginTop: 4, borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  dropdownItem: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#334155' },

  warningBox: { backgroundColor: '#ef444422', borderColor: '#ef4444', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 },
  warningText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },

  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelModalBtn: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' }
});

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput,
  Modal, SafeAreaView, StatusBar, useWindowDimensions, Linking, Platform
} from 'react-native';

const DEFAULT_RATES = { USD: 47.56, EUR: 54.77 };

const CATEGORY_COLORS = {
  Eğlence: '#ef4444',
  'Yazılım & AI': '#8b5cf6',
  Müzik: '#10b981',
  Eğitim: '#f59e0b',
  'Bulut & Depolama': '#3b82f6',
  'Spor & Sağlık': '#ec4899',
  Fatura: '#06b6d4',
  'Ev Giderleri': '#14b8a6',
  Finans: '#8b5cf6',
  Diğer: '#f97316'
};

const DEFAULT_PAYMENT_METHODS = [
  'Garanti Bonus', 'Enpara Kart', 'Papara', 'İş Bankası Maximum', 'Yapı Kredi World', 'Nakit / Diğer'
];

const DEFAULT_TEMPLATES = [
  { name: 'Netflix', price: '299', currency: 'TRY', category: 'Eğlence', color: '#E50914' },
  { name: 'Spotify', price: '89', currency: 'TRY', category: 'Müzik', color: '#1DB954' },
  { name: 'YouTube Premium', price: '115', currency: 'TRY', category: 'Eğlence', color: '#FF0000' },
  { name: 'ChatGPT Plus', price: '20', currency: 'USD', category: 'Yazılım & AI', color: '#10A37F' },
  { name: 'iCloud+', price: '49.99', currency: 'TRY', category: 'Bulut & Depolama', color: '#007AFF' },
  { name: 'Amazon Prime', price: '49', currency: 'TRY', category: 'Eğlence', color: '#00A8E1' }
];

const TEMPLATE_COLOR_PALETTE = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6', '#8b5cf6', '#f97316', '#06b6d4'];

const NOTIFICATION_OPTIONS = [
  { label: 'Bildirim Yok', badgeLabel: null, value: -1 },
  { label: 'Aynı Gün', badgeLabel: '🔔 Aynı Gün', value: 0 },
  { label: '1 Gün Önce', badgeLabel: '🔔 1 Gün Önce', value: 1 },
  { label: '2 Gün Önce', badgeLabel: '🔔 2 Gün Önce', value: 2 },
  { label: '3 Gün Önce', badgeLabel: '🔔 3 Gün Önce', value: 3 },
  { label: '1 Hafta Önce', badgeLabel: '🔔 1 Hafta Önce', value: 7 }
];

const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const VIEW_FILTER_OPTIONS = [
  { key: 'ALL', label: 'Tüm Abonelikler' },
  { key: 'MONTHLY', label: 'Aylık Ödemeler' },
  { key: 'YEARLY', label: 'Yıllık Ödemeler' },
  { key: 'UPCOMING', label: 'Yaklaşan Ödemeler' },
  { key: 'EXPENSIVE', label: 'En Yüksek Tutar' },
  { key: 'NAME', label: 'Ada Göre' }
];

const BACKGROUND_PRESETS = {
  smoke: { label: 'Açık Füme', dark: true, bg: '#30353c', sidebarBg: '#373d45', headerBg: '#3a4048', cardBg: '#414852', inputBg: '#343a42', cardBorder: '#58616d', textPrimary: '#f4f6f8', textSecondary: '#d2d7de', textMuted: '#aeb7c2', summaryBg: '#5b58d6', summaryBorder: '#7470ef', accent: '#63b3ff' },
  anthracite: { label: 'Antrasit', dark: true, bg: '#20242a', sidebarBg: '#272c33', headerBg: '#2a3038', cardBg: '#303741', inputBg: '#252b33', cardBorder: '#434c58', textPrimary: '#f4f5f7', textSecondary: '#cbd1d9', textMuted: '#98a2af', summaryBg: '#4f46c8', summaryBorder: '#6860df', accent: '#55aaff' },
  navy: { label: 'Lacivert', dark: true, bg: '#111827', sidebarBg: '#182131', headerBg: '#1c2636', cardBg: '#222d3d', inputBg: '#172131', cardBorder: '#344154', textPrimary: '#f1f5f9', textSecondary: '#cbd5e1', textMuted: '#94a3b8', summaryBg: '#3730a3', summaryBorder: '#4f46e5', accent: '#60a5fa' },
  light: { label: 'Açık', dark: false, bg: '#edf1f5', sidebarBg: '#ffffff', headerBg: '#ffffff', cardBg: '#ffffff', inputBg: '#f1f4f8', cardBorder: '#d8dee7', textPrimary: '#1f2937', textSecondary: '#566171', textMuted: '#7d8999', summaryBg: '#4f46e5', summaryBorder: '#6366f1', accent: '#2563eb' }
};

const FONT_SCALE_OPTIONS = [
  { key: 'small', label: 'Küçük', scale: 0.9 },
  { key: 'normal', label: 'Normal', scale: 1 },
  { key: 'large', label: 'Büyük', scale: 1.12 }
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const formatCurrency = (value, currency = 'TRY') => {
  const n = Number(value) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  return `${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
};

const formatShortCurrency = (value, currency = 'TRY') => {
  const n = Number(value) || 0;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  return `${Math.round(n).toLocaleString('tr-TR')} ${symbol}`;
};

const convertToTL = (price, currency, rates = DEFAULT_RATES) => {
  const p = Number(price) || 0;
  if (currency === 'USD') return p * (Number(rates.USD) || DEFAULT_RATES.USD);
  if (currency === 'EUR') return p * (Number(rates.EUR) || DEFAULT_RATES.EUR);
  return p;
};

const normalizeText = (value = '') => String(value).toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();

const confirmAction = message => {
  if (typeof window !== 'undefined' && typeof window.confirm === 'function') return window.confirm(message);
  return true;
};

const isValidUrl = value => {
  if (!value) return true;
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol);
  } catch { return false; }
};

const getServiceColor = (name, templates) => {
  const source = Array.isArray(templates) && templates.length > 0 ? templates : DEFAULT_TEMPLATES;
  const matched = source.find(t => normalizeText(t.name) === normalizeText(name));
  return matched?.color || '#6366f1';
};

const getNextRenewal = (item, today) => {
  const day = Number(item.billingDay) || 1;
  if (item.period === 'yearly') {
    const month = Math.max(0, Math.min(11, (Number(item.billingMonth) || 1) - 1));
    let d = new Date(today.getFullYear(), month, day);
    if (d < today) d = new Date(today.getFullYear() + 1, month, day);
    return d;
  }
  let d = new Date(today.getFullYear(), today.getMonth(), day);
  if (d < today) d = new Date(today.getFullYear(), today.getMonth() + 1, day);
  return d;
};

const getCycleKey = (item, today) => {
  const next = getNextRenewal(item, today);
  return `${next.getFullYear()}-${next.getMonth()}`;
};

const getAnnualIncreaseMultiplier = (item, targetYear) => {
  const baseYear = Number(item?.billingYear) || targetYear;
  const annualIncreaseRate = Math.max(0, Number(item?.annualIncreaseRate) || 0);
  const increaseApplicationType = item?.increaseApplicationType || 'subscription_anniversary';
  const targetDateYear = Number(targetYear);

  if (targetDateYear <= baseYear) return 1;

  let increasePeriods = 0;
  if (increaseApplicationType === 'calendar_year') {
    increasePeriods = Math.max(0, targetDateYear - baseYear);
  } else {
    increasePeriods = Math.max(0, targetDateYear - baseYear);
  }

  return Math.pow(1 + annualIncreaseRate / 100, increasePeriods);
};

const getSubscriptionCostForMonth = (item, year, monthIndex, rates) => {
  if (!item || item.status === 'cancelled') return 0;
  const baseAmount = Number(item.baseAmount ?? item.price) || 0;
  const priceInTL = convertToTL(baseAmount, item.currency || 'TRY', rates) * getAnnualIncreaseMultiplier(item, year);
  const billingYear = Number(item.billingYear) || year;
  const billingMonth = Math.max(0, Math.min(11, (Number(item.billingMonth) || 1) - 1));
  const targetMonthKey = year * 12 + monthIndex;
  const billingMonthKey = billingYear * 12 + billingMonth;
  if (targetMonthKey < billingMonthKey) return 0;
  if (item.period === 'monthly') return priceInTL;
  return monthIndex === billingMonth ? priceInTL : 0;
};

const lightenHex = (hex, percent) => {
  try {
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    let r = (num >> 16) + Math.round((255 * percent) / 100);
    let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
    let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);
    r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
};

const hexToRgba = (hex, alpha) => {
  try {
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch { return hex; }
};

const normalizeSubscription = s => {
  if (!s) return null;
  const baseAmount = Number(s.baseAmount ?? s.amount ?? s.price) || 0;
  const annualIncreaseRate = Number(s.annualIncreaseRate ?? s.inflationRate ?? s.yearlyIncrease ?? s.increaseRate) || 0;
  return {
    ...s,
    id: s.id || String(Date.now() + Math.random()),
    name: s.name || 'İsimsiz',
    baseAmount: String(baseAmount),
    price: String(baseAmount),
    currency: s.currency || 'TRY',
    billingDay: String(s.billingDay || '1'),
    billingMonth: String(s.billingMonth || '1'),
    billingYear: String(s.billingYear || new Date().getFullYear()),
    category: s.category || 'Diğer',
    paymentMethod: s.paymentMethod || DEFAULT_PAYMENT_METHODS[0],
    period: s.period || 'monthly',
    expenseType: s.expenseType || 'subscription',
    increaseApplicationType: s.increaseApplicationType || 'subscription_anniversary',
    annualIncreaseRate: String(annualIncreaseRate),
    notificationDays: s.notificationDays !== undefined ? s.notificationDays : 2,
    status: s.status || 'active'
  };
};

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 1024;

  const mainScrollRef = useRef(null);
  const mainScrollPositionRef = useRef(0);

  const scrollMainToTop = (animated = false) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainScrollRef.current?.scrollTo?.({ y: 0, animated });
        mainScrollPositionRef.current = 0;
      });
    });
  };

  const restoreMainScrollPosition = position => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainScrollRef.current?.scrollTo?.({ y: Number(position) || 0, animated: false });
      });
    });
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [subscriptions, setSubscriptions] = useState([]);
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [templatesList, setTemplatesList] = useState(DEFAULT_TEMPLATES);
  const [paymentMethodsList, setPaymentMethodsList] = useState(DEFAULT_PAYMENT_METHODS);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState('list');
  const [viewFilter, setViewFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [backgroundPreset, setBackgroundPreset] = useState('smoke');
  const [fontScaleKey, setFontScaleKey] = useState('normal');
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);
  const [isAnalysisYearPickerOpen, setIsAnalysisYearPickerOpen] = useState(false);
  const [isCalendarYearPickerOpen, setIsCalendarYearPickerOpen] = useState(false);

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState({ visible: false, name: '' });
  const [editingId, setEditingId] = useState(null);

  const [dayDrawer, setDayDrawer] = useState({ visible: false, day: null, month: null, year: null, items: [] });

  const currentDate = new Date();
  const clampedYear = Math.min(2030, Math.max(2025, currentDate.getFullYear()));

  const [calendarMonth, setCalendarMonth] = useState(clampedYear === currentDate.getFullYear() ? currentDate.getMonth() : 0);
  const [calendarYear, setCalendarYear] = useState(clampedYear);
  const [selectedAnalysisYear, setSelectedAnalysisYear] = useState(clampedYear);

  const [formExpenseType, setFormExpenseType] = useState('subscription');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCurrency, setFormCurrency] = useState('TRY');
  const [formDay, setFormDay] = useState('1');
  const [formMonth, setFormMonth] = useState(String(currentDate.getMonth() + 1));
  const [formYear, setFormYear] = useState(String(clampedYear));
  const [formCategory, setFormCategory] = useState('Eğlence');
  const [formPaymentMethod, setFormPaymentMethod] = useState(DEFAULT_PAYMENT_METHODS[0]);
  const [formPeriod, setFormPeriod] = useState('monthly');
  const [formCancelUrl, setFormCancelUrl] = useState('');
  const [formColor, setFormColor] = useState('#6366f1');
  const [formNotificationDays, setFormNotificationDays] = useState(2);
  const [formAnnualIncreaseRate, setFormAnnualIncreaseRate] = useState('0');
  const [formIncreaseApplicationType, setFormIncreaseApplicationType] = useState('subscription_anniversary');
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplatePrice, setNewTemplatePrice] = useState('');
  const [newTemplateCurrency, setNewTemplateCurrency] = useState('TRY');
  const [newTemplateCategory, setNewTemplateCategory] = useState('Diğer');

  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [newPaymentMethodName, setNewPaymentMethodName] = useState('');

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('cebin_auth_v1');
      if (savedAuth === 'true') setIsLoggedIn(true);

      const savedSubscriptions = localStorage.getItem('cebin_subscriptions_v5');
      if (savedSubscriptions) {
        const parsed = JSON.parse(savedSubscriptions);
        setSubscriptions(Array.isArray(parsed) ? parsed.map(normalizeSubscription) : []);
      }

      const savedTemplates = localStorage.getItem('cebin_templates_v1');
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        setTemplatesList(Array.isArray(parsed) ? parsed : DEFAULT_TEMPLATES);
      }

      const savedPaymentMethods = localStorage.getItem('cebin_payment_methods_v1');
      if (savedPaymentMethods) {
        const parsed = JSON.parse(savedPaymentMethods);
        setPaymentMethodsList(Array.isArray(parsed) ? parsed : DEFAULT_PAYMENT_METHODS);
      }

      const savedRates = localStorage.getItem('cebin_exchange_rates_v1');
      if (savedRates) {
        const parsed = JSON.parse(savedRates);
        setExchangeRates({ USD: Number(parsed?.USD) || DEFAULT_RATES.USD, EUR: Number(parsed?.EUR) || DEFAULT_RATES.EUR });
      }

      const savedAppearance = localStorage.getItem('cebin_appearance_v1');
      if (savedAppearance) {
        const parsed = JSON.parse(savedAppearance);
        if (BACKGROUND_PRESETS[parsed?.backgroundPreset]) setBackgroundPreset(parsed.backgroundPreset);
        if (FONT_SCALE_OPTIONS.some(o => o.key === parsed?.fontScaleKey)) setFontScaleKey(parsed.fontScaleKey);
      }
    } catch (error) {
      console.log('Kayıtlı veriler okunamadı:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_subscriptions_v5', JSON.stringify(subscriptions)); } catch (e) { console.log(e); } }, [subscriptions, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_templates_v1', JSON.stringify(templatesList)); } catch (e) { console.log(e); } }, [templatesList, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_payment_methods_v1', JSON.stringify(paymentMethodsList)); } catch (e) { console.log(e); } }, [paymentMethodsList, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_exchange_rates_v1', JSON.stringify(exchangeRates)); } catch (e) { console.log(e); } }, [exchangeRates, isLoaded]);
  useEffect(() => { if (isLoaded) try { localStorage.setItem('cebin_appearance_v1', JSON.stringify({ backgroundPreset, fontScaleKey })); } catch (e) { console.log(e); } }, [backgroundPreset, fontScaleKey, isLoaded]);

  useEffect(() => {
    let isMounted = true;
    const fetchExchangeRates = async () => {
      try {
        const [usdRes, eurRes] = await Promise.all([
          fetch('https://api.frankfurter.dev/v2/rate/USD/TRY?providers=TCMB'),
          fetch('https://api.frankfurter.dev/v2/rate/EUR/TRY?providers=TCMB')
        ]);
        if (!usdRes.ok || !eurRes.ok) throw new Error('Kur servisi yanıt vermedi.');
        const usdData = await usdRes.json();
        const eurData = await eurRes.json();
        if (!isMounted) return;
        const usdRate = Number(usdData?.rate);
        const eurRate = Number(eurData?.rate);
        if (!Number.isFinite(usdRate) || !Number.isFinite(eurRate)) throw new Error('Kur değerleri geçersiz.');
        setExchangeRates({ USD: usdRate, EUR: eurRate });
      } catch (error) {
        console.log('Güncel döviz kurları alınamadı:', error);
      }
    };
    fetchExchangeRates();
    const intervalId = setInterval(fetchExchangeRates, 6 * 60 * 60 * 1000);
    return () => { isMounted = false; clearInterval(intervalId); };
  }, []);

  useEffect(() => { scrollMainToTop(false); }, [activeTab, selectedAnalysisYear]);

  const handleLogin = () => {
    const trimmedEmail = authEmail.trim();
    if (!trimmedEmail || !authPassword) { setAuthError('Lütfen e-posta ve şifrenizi giriniz.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setAuthError('Lütfen geçerli bir e-posta adresi giriniz.'); return; }
    if (authPassword.length < 4) { setAuthError('Şifre en az 4 karakter olmalıdır.'); return; }
    setAuthError('');
    try {
      localStorage.setItem('cebin_auth_v1', 'true');
    } catch (e) { console.log(e); }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (!confirmAction('Oturumu kapatmak istediğinize emin misiniz?')) return;
    try { localStorage.setItem('cebin_auth_v1', 'false'); } catch (e) { console.log(e); }
    setIsLoggedIn(false);
  };

  const selectedPreset = BACKGROUND_PRESETS[backgroundPreset] || BACKGROUND_PRESETS.smoke;
  const selectedFontOption = FONT_SCALE_OPTIONS.find(o => o.key === fontScaleKey) || FONT_SCALE_OPTIONS[1];
  const fontScale = selectedFontOption.scale;

  const theme = {
    ...selectedPreset,
    danger: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    activeButton: '#6965e8',
    activeButtonBorder: '#7c78f0',
    activeButtonSoft: '#7772ff26'
  };

  const safeList = Array.isArray(subscriptions) ? subscriptions : [];
  const safeTemplates = Array.isArray(templatesList) ? templatesList : [];
  const safePaymentMethods = Array.isArray(paymentMethodsList) ? paymentMethodsList : [];

  const styles = createStyles(theme, isMobile, fontScale);
  const todayForFiltering = new Date();

  const filteredSubscriptions = safeList
    .filter(subscription => {
      const query = normalizeText(searchQuery);
      if (!query) return true;
      return [subscription.name, subscription.category, subscription.paymentMethod, subscription.currency]
        .some(v => normalizeText(v).includes(query));
    })
    .filter(subscription => {
      if (viewFilter === 'ALL') return true;
      if (viewFilter === 'MONTHLY') return subscription.period === 'monthly';
      if (viewFilter === 'YEARLY') return subscription.period === 'yearly';
      if (viewFilter === 'UPCOMING') {
        const nextRenewal = getNextRenewal(subscription, todayForFiltering);
        const todayStart = new Date(todayForFiltering.getFullYear(), todayForFiltering.getMonth(), todayForFiltering.getDate());
        const daysUntil = Math.round((nextRenewal - todayStart) / 86400000);
        return daysUntil >= 0 && daysUntil <= 14;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = convertToTL(Number(a.baseAmount ?? a.price) * getAnnualIncreaseMultiplier(a, currentDate.getFullYear()), a.currency, exchangeRates);
      const priceB = convertToTL(Number(b.baseAmount ?? b.price) * getAnnualIncreaseMultiplier(b, currentDate.getFullYear()), b.currency, exchangeRates);
      if (viewFilter === 'EXPENSIVE') return priceB - priceA;
      if (viewFilter === 'NAME') return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
      if (viewFilter === 'UPCOMING') return getNextRenewal(a, todayForFiltering) - getNextRenewal(b, todayForFiltering);
      return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
    });

  const selectedViewFilterLabel = VIEW_FILTER_OPTIONS.find(o => o.key === viewFilter)?.label || 'Tüm Abonelikler';

  const currentProjectionYear = currentDate.getFullYear();
  const monthlyTotalTL = safeList.reduce((total, s) => {
    if (!s || s.status === 'cancelled') return total;
    const baseAmount = Number(s.baseAmount ?? s.price) || 0;
    const projectedPriceInTL = convertToTL(baseAmount, s.currency || 'TRY', exchangeRates) * getAnnualIncreaseMultiplier(s, currentProjectionYear);
    return total + (s.period === 'yearly' ? projectedPriceInTL / 12 : projectedPriceInTL);
  }, 0);

  const dailyAverageTL = monthlyTotalTL / 30;
  const yearlyProjectionTL = Array.from({ length: 12 }, (_, monthIndex) =>
    safeList.reduce((total, subscription) => total + getSubscriptionCostForMonth(subscription, currentProjectionYear, monthIndex, exchangeRates), 0)
  ).reduce((total, amount) => total + amount, 0);

  const realNow = new Date();
  const prevMonthDate = new Date(realNow.getFullYear(), realNow.getMonth() - 1, 1);
  const thisRealMonthTotal = safeList.reduce((t, s) => t + getSubscriptionCostForMonth(s, realNow.getFullYear(), realNow.getMonth(), exchangeRates), 0);
  const prevRealMonthTotal = safeList.reduce((t, s) => t + getSubscriptionCostForMonth(s, prevMonthDate.getFullYear(), prevMonthDate.getMonth(), exchangeRates), 0);
  const monthlyChangePercent = prevRealMonthTotal > 0
    ? ((thisRealMonthTotal - prevRealMonthTotal) / prevRealMonthTotal) * 100
    : (thisRealMonthTotal > 0 ? 100 : 0);
  const hasMonthlyChangeData = prevRealMonthTotal > 0 || thisRealMonthTotal > 0;

  const getDetailedMonthlyBreakdown = targetYear => {
    const monthlyTotals = Array(12).fill(0);
    const monthlyCategoryBreakdown = Array.from({ length: 12 }, () => []);

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      let monthTotal = 0;
      const categoryTotals = {};

      safeList.forEach(subscription => {
        const category = subscription.category || 'Diğer';
        const amount = getSubscriptionCostForMonth(subscription, targetYear, monthIndex, exchangeRates);
        if (amount <= 0) return;
        monthTotal += amount;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });

      monthlyTotals[monthIndex] = monthTotal;
      monthlyCategoryBreakdown[monthIndex] = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => ({ category, amount, color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Diğer }));
    }

    return { monthlyTotals, monthlyCategoryBreakdown };
  };

  const { monthlyTotals, monthlyCategoryBreakdown } = getDetailedMonthlyBreakdown(selectedAnalysisYear);
  const totalYearlyExpense = monthlyTotals.reduce((t, a) => t + a, 0);
  const monthsWithExpense = monthlyTotals.filter(a => a > 0).length;
  const averageMonthlyExpense = monthsWithExpense > 0 ? totalYearlyExpense / monthsWithExpense : 0;
  const maxMonthlyExpense = Math.max(...monthlyTotals, 1);

  const yearlyCategoryStats = safeList.reduce((acc, s) => {
    const category = s.category || 'Diğer';
    const yearlyAmount = Array.from({ length: 12 }, (_, m) => getSubscriptionCostForMonth(s, selectedAnalysisYear, m, exchangeRates)).reduce((t, a) => t + a, 0);
    if (yearlyAmount <= 0) return acc;
    acc[category] = (acc[category] || 0) + yearlyAmount;
    return acc;
  }, {});

  const monthlyPaymentMethodStats = safeList.reduce((acc, s) => {
    if (!s || s.status === 'cancelled') return acc;
    const method = s.paymentMethod || 'Nakit / Diğer';
    const startYear = Number(s.billingYear) || selectedAnalysisYear;
    if (startYear > selectedAnalysisYear) return acc;
    const baseAmount = Number(s.baseAmount ?? s.price) || 0;
    const projectedPriceInTL = convertToTL(baseAmount, s.currency || 'TRY', exchangeRates) * getAnnualIncreaseMultiplier(s, selectedAnalysisYear);
    const monthlyCommitment = s.period === 'yearly' ? projectedPriceInTL / 12 : projectedPriceInTL;
    acc[method] = (acc[method] || 0) + monthlyCommitment;
    return acc;
  }, {});

  const sortedMonthlyPaymentMethodEntries = Object.entries(monthlyPaymentMethodStats).sort((a, b) => b[1] - a[1]);
  const totalMonthlyPaymentCommitment = sortedMonthlyPaymentMethodEntries.reduce((total, [, amount]) => total + amount, 0);
  const sortedCategoryEntries = Object.entries(yearlyCategoryStats).sort((a, b) => b[1] - a[1]);
  const categoryMonthDivisor = Math.max(monthsWithExpense, 1);
  const sortedMonthlyCategoryEntries = sortedCategoryEntries.map(([category, amount]) => [category, amount / categoryMonthDivisor]);
  const totalMonthlyCategoryExpense = sortedMonthlyCategoryEntries.reduce((total, [, amount]) => total + amount, 0);
  const topCategoryLabel = sortedCategoryEntries[0]?.[0] || '-';
  const topCategoryAmount = sortedMonthlyCategoryEntries[0]?.[1] || 0;
  const topCategoryPercent = totalMonthlyCategoryExpense > 0 ? ((topCategoryAmount / totalMonthlyCategoryExpense) * 100).toFixed(0) : 0;

  const mostExpensiveSubscription = safeList.reduce((current, s) => {
    if (s.status === 'cancelled') return current;
    const baseAmount = Number(s.baseAmount ?? s.price) || 0;
    const priceInTL = convertToTL(baseAmount, s.currency || 'TRY', exchangeRates) * getAnnualIncreaseMultiplier(s, currentProjectionYear);
    const monthlyEquivalent = s.period === 'yearly' ? priceInTL / 12 : priceInTL;
    if (!current || monthlyEquivalent > current.monthlyEquivalent) return { item: s, monthlyEquivalent };
    return current;
  }, null);

  const insightText = sortedMonthlyCategoryEntries.length === 0
    ? 'Henüz Analiz Oluşturmak İçin Yeterli Abonelik Verisi Bulunmuyor.'
    : `${selectedAnalysisYear} döneminde aylık bütçede en yüksek pay ${topCategoryLabel} kategorisinde: ${formatShortCurrency(topCategoryAmount, 'TRY')} (%${topCategoryPercent}).${mostExpensiveSubscription ? ` En yüksek aylık abonelik etkisi ${mostExpensiveSubscription.item.name} kaydından geliyor.` : ''}`;

  const openSubscriptionForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormExpenseType(item.expenseType || 'subscription');
      setFormName(item.name || '');
      setFormPrice(String(item.baseAmount ?? item.price ?? ''));
      setFormCurrency(item.currency || 'TRY');
      setFormDay(String(item.billingDay || '1'));
      setFormMonth(String(item.billingMonth || calendarMonth + 1));
      setFormYear(String(item.billingYear || calendarYear));
      setFormCategory(item.category || 'Diğer');
      setFormPaymentMethod(item.paymentMethod || safePaymentMethods[0] || '');
      setFormPeriod(item.period || 'monthly');
      setFormCancelUrl(item.cancelUrl || '');
      setFormColor(item.color || getServiceColor(item.name, safeTemplates));
      setFormNotificationDays(item.notificationDays !== undefined ? item.notificationDays : 2);
      setFormAnnualIncreaseRate(String(item.annualIncreaseRate ?? 0));
      setFormIncreaseApplicationType(item.increaseApplicationType || 'subscription_anniversary');
    } else {
      setEditingId(null);
      setFormExpenseType('subscription');
      setFormName(''); setFormPrice(''); setFormCurrency('TRY');
      setFormDay('1'); setFormMonth(String(currentDate.getMonth() + 1)); setFormYear(String(clampedYear));
      setFormCategory('Eğlence');
      setFormPaymentMethod(safePaymentMethods[0] || DEFAULT_PAYMENT_METHODS[0]);
      setFormPeriod('monthly'); setFormCancelUrl(''); setFormColor('#6366f1');
      setFormNotificationDays(2); setFormAnnualIncreaseRate('0');
      setFormIncreaseApplicationType('subscription_anniversary');
    }
    setFormStep(1);
    setIsAdvancedSettingsOpen(false);
    setShowTemplateForm(false);
    setShowPaymentMethodForm(false);
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionForm = () => {
    setIsSubscriptionModalOpen(false);
    setEditingId(null);
    setFormStep(1);
  };

  const goToStepTwo = () => {
    if (!formName.trim()) { alert('Lütfen servis veya gider adını giriniz.'); return; }
    const numericPrice = Number(String(formPrice).replace(',', '.'));
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { alert('Lütfen sıfırdan büyük geçerli bir tutar giriniz.'); return; }
    setFormStep(2);
  };

  const handleSaveSubscription = () => {
    const preservedScrollPosition = mainScrollPositionRef.current;
    const normalizedPrice = String(formPrice).replace(',', '.');
    const numericPrice = Number(normalizedPrice);
    const numericDay = Number(formDay);
    const numericMonth = Number(formMonth);
    const numericYear = Number(formYear);
    const numericAnnualIncreaseRate = Number(String(formAnnualIncreaseRate).replace(',', '.'));

    if (!formName.trim()) { alert('Lütfen servis veya gider adını giriniz.'); return; }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { alert('Lütfen sıfırdan büyük geçerli bir tutar giriniz.'); return; }
    if (!Number.isInteger(numericMonth) || numericMonth < 1 || numericMonth > 12) { alert('Ay değeri 1 ile 12 arasında olmalıdır.'); return; }
    if (!YEARS.includes(numericYear)) { alert('Lütfen geçerli bir yıl seçiniz.'); return; }
    if (!Number.isFinite(numericAnnualIncreaseRate) || numericAnnualIncreaseRate < 0 || numericAnnualIncreaseRate > 500) { alert('Yıllık artış oranı 0 ile 500 arasında olmalıdır.'); return; }

    const maximumDay = getDaysInMonth(numericMonth - 1, numericYear);
    if (!Number.isInteger(numericDay) || numericDay < 1 || numericDay > maximumDay) {
      alert(`Seçilen ay için gün 1 ile ${maximumDay} arasında olmalıdır.`);
      return;
    }
    if (!formPaymentMethod) { alert('Lütfen bir ödeme yöntemi seçiniz.'); return; }
    if (!isValidUrl(formCancelUrl)) { alert('Yönetim bağlantısı http:// veya https:// ile başlamalıdır.'); return; }

    const duplicateSubscription = safeList.find(s =>
      s.id !== editingId &&
      normalizeText(s.name) === normalizeText(formName) &&
      s.period === formPeriod &&
      s.status !== 'cancelled'
    );

    if (duplicateSubscription) {
      setDuplicateWarning({ visible: true, name: duplicateSubscription.name || formName.trim() });
      return;
    }

    const existingSubscription = safeList.find(s => s.id === editingId);

    const payload = {
      ...existingSubscription,
      id: editingId || String(Date.now()),
      expenseType: formExpenseType,
      name: formName.trim(),
      baseAmount: String(numericPrice),
      price: String(numericPrice),
      currency: formCurrency,
      billingDay: String(numericDay),
      billingMonth: String(numericMonth),
      billingYear: String(numericYear),
      category: formCategory,
      paymentMethod: formPaymentMethod,
      period: formPeriod,
      cancelUrl: formCancelUrl.trim(),
      color: formColor,
      notificationDays: formNotificationDays,
      annualIncreaseRate: numericAnnualIncreaseRate,
      increaseApplicationType: formIncreaseApplicationType,
      status: existingSubscription?.status || 'active'
    };

    const updated = editingId ? safeList.map(s => (s.id === editingId ? payload : s)) : [...safeList, payload];
    setSubscriptions(updated);
    closeSubscriptionForm();
    restoreMainScrollPosition(preservedScrollPosition);
  };

  const handleDeleteSubscription = id => {
    const preservedScrollPosition = mainScrollPositionRef.current;
    const target = safeList.find(s => s.id === id);
    if (!confirmAction(`"${target?.name || 'Bu kayıt'}" kalıcı olarak silinsin mi?`)) return;
    setSubscriptions(safeList.filter(s => s.id !== id));
    restoreMainScrollPosition(preservedScrollPosition);
  };

  const togglePaid = subscription => {
    const cycleKey = getCycleKey(subscription, todayForFiltering);
    const isPaid = subscription.paidCycleKey === cycleKey;
    setSubscriptions(safeList.map(s => (s.id === subscription.id ? { ...s, paidCycleKey: isPaid ? null : cycleKey } : s)));
  };

  const addTemplate = () => {
    const numericPrice = Number(String(newTemplatePrice).replace(',', '.'));
    if (!newTemplateName.trim()) { alert('Lütfen şablon adını giriniz.'); return; }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { alert('Lütfen sıfırdan büyük geçerli bir şablon fiyatı giriniz.'); return; }
    if (safeTemplates.some(t => normalizeText(t.name) === normalizeText(newTemplateName))) { alert('Bu isimde bir şablon zaten bulunuyor.'); return; }

    const templateColor = TEMPLATE_COLOR_PALETTE[safeTemplates.length % TEMPLATE_COLOR_PALETTE.length];
    setTemplatesList([...safeTemplates, { name: newTemplateName.trim(), price: String(numericPrice), currency: newTemplateCurrency, category: newTemplateCategory, color: templateColor }]);
    setNewTemplateName(''); setNewTemplatePrice(''); setNewTemplateCurrency('TRY'); setNewTemplateCategory('Diğer'); setShowTemplateForm(false);
  };

  const removeTemplate = index => {
    const target = safeTemplates[index];
    if (!confirmAction(`"${target?.name || 'Bu şablon'}" silinsin mi?`)) return;
    setTemplatesList(safeTemplates.filter((_, i) => i !== index));
  };

  const addPaymentMethod = () => {
    const methodName = newPaymentMethodName.trim();
    if (!methodName) { alert('Lütfen ödeme yöntemi adını giriniz.'); return; }
    if (safePaymentMethods.some(m => normalizeText(m) === normalizeText(methodName))) { alert('Bu ödeme yöntemi zaten bulunuyor.'); return; }
    setPaymentMethodsList([...safePaymentMethods, methodName]);
    setFormPaymentMethod(methodName);
    setNewPaymentMethodName('');
    setShowPaymentMethodForm(false);
  };

  const removePaymentMethod = paymentMethod => {
    const usageCount = safeList.filter(s => s.paymentMethod === paymentMethod).length;
    if (usageCount > 0) { alert(`Bu ödeme yöntemi ${usageCount} kayıtta kullanılıyor. Önce ilgili kayıtların ödeme yöntemini değiştiriniz.`); return; }
    if (!confirmAction(`"${paymentMethod}" ödeme yöntemi silinsin mi?`)) return;
    const updated = safePaymentMethods.filter(m => m !== paymentMethod);
    setPaymentMethodsList(updated);
    if (formPaymentMethod === paymentMethod) setFormPaymentMethod(updated[0] || '');
  };

  const handleExportCSV = () => {
    if (safeList.length === 0) { alert('Dışa aktarılacak kayıt bulunmuyor.'); return; }
    let csvContent = '\uFEFFServis Adi;Fiyat;Para Birimi;Kategori;Odeme Yontemi;Periyot;Odeme Gunu;Odeme Ayi;Odeme Yili;Yillik Artis Orani\n';
    safeList.forEach(s => {
      csvContent += `"${s.name}";${s.baseAmount ?? s.price};"${s.currency}";"${s.category}";"${s.paymentMethod}";"${s.period}";${s.billingDay};${s.billingMonth};${s.billingYear};${Number(s.annualIncreaseRate) || 0}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cebin_abonelikler_${calendarYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const backupData = {
      version: 3,
      exportedAt: new Date().toISOString(),
      subscriptions: safeList,
      templates: safeTemplates,
      paymentMethods: safePaymentMethods,
      exchangeRates,
      appearance: { backgroundPreset, fontScaleKey }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cebin_yedek_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    if (typeof document === 'undefined') return;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json,.json';
    fileInput.onchange = async event => {
      try {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        const fileText = await selectedFile.text();
        const parsedBackup = JSON.parse(fileText);
        const importedSubscriptions = Array.isArray(parsedBackup) ? parsedBackup : parsedBackup.subscriptions;
        if (!Array.isArray(importedSubscriptions)) throw new Error('Abonelik listesi bulunamadı.');
        if (!confirmAction(`${importedSubscriptions.length} kayıt içe aktarılacak ve mevcut liste değiştirilecek. Devam edilsin mi?`)) return;

        setSubscriptions(importedSubscriptions.map(normalizeSubscription));
        if (Array.isArray(parsedBackup.templates)) setTemplatesList(parsedBackup.templates);
        if (Array.isArray(parsedBackup.paymentMethods)) setPaymentMethodsList(parsedBackup.paymentMethods);
        if (parsedBackup.exchangeRates) {
          setExchangeRates({ USD: Number(parsedBackup.exchangeRates.USD) || DEFAULT_RATES.USD, EUR: Number(parsedBackup.exchangeRates.EUR) || DEFAULT_RATES.EUR });
        }
        alert('Yedek başarıyla geri yüklendi.');
      } catch (error) {
        alert(`Yedek yüklenemedi: ${error.message}`);
      }
    };
    fileInput.click();
  };

  const daysInCurrentMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDayOffset = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;

  const openDayDrawer = (dayNumber, itemsForDay) => {
    setDayDrawer({ visible: true, day: dayNumber, month: calendarMonth, year: calendarYear, items: itemsForDay });
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <View style={styles.authWrapper}>
          <View style={[styles.authCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.9) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.authHeader}>
              <Text style={[styles.authLogo, { color: theme.textPrimary }]}>Cebin <Text style={{ color: '#9b98ff' }}>PRO</Text></Text>
              <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik ve Bütçe Asistanı</Text>
            </View>

            <Text style={[styles.authTitle, { color: theme.textPrimary }]}>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>

            <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 16 }]}>E-posta</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
              placeholder="ornek@eposta.com"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={authEmail}
              onChangeText={setAuthEmail}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Şifre</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
              placeholder="••••••••"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              value={authPassword}
              onChangeText={setAuthPassword}
            />

            {!!authError && <Text style={styles.authErrorText}>{authError}</Text>}

            <TouchableOpacity style={[styles.primaryButton, { marginTop: 8, paddingVertical: 13 }]} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.authSwitchButton} onPress={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}>
              <Text style={[styles.authSwitchText, { color: theme.accent }]}>
                {authMode === 'login' ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={[styles.appWrapper, isDesktop && styles.appWrapperDesktop]}>
        {isDesktop && (
          <View style={[styles.sidebarContainer, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.sidebarBg, 0.9) : theme.sidebarBg, borderRightColor: theme.cardBorder }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
              <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
            </View>

            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik ve Bütçe Asistanı</Text>

            <View style={styles.sidebarNavGroup}>
              {[
                { key: 'list', icon: '💳', label: 'Abonelikler' },
                { key: 'calendar', icon: '📅', label: 'Takvim' },
                { key: 'analytics', icon: '📊', label: 'Analiz ve Raporlar' }
              ].map(navItem => (
                <TouchableOpacity key={navItem.key} style={[styles.sidebarNavButton, activeTab === navItem.key && styles.sidebarNavButtonActive]} onPress={() => { scrollMainToTop(false); setActiveTab(navItem.key); }}>
                  <Text style={styles.sidebarNavIcon}>{navItem.icon}</Text>
                  <Text style={[styles.sidebarNavText, { color: activeTab === navItem.key ? '#9b98ff' : theme.textSecondary }]}>{navItem.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={handleExportCSV}>
                <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>📄 CSV Excel İndir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={handleExportJSON}>
                <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>💾 JSON Yedek Al</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={handleImportJSON}>
                <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>↩️ Yedeği Geri Yükle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton]} onPress={() => openSubscriptionForm()}>
                <Text style={styles.primaryButtonText}>+ Yeni Abonelik Ekle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: 'rgba(248,113,113,0.12)', borderColor: theme.danger }]} onPress={handleLogout}>
                <Text style={[styles.secondaryButtonText, { color: theme.danger }]}>🚪 Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.contentWrapper}>
          <View style={[styles.header, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.headerBg, 0.85) : theme.headerBg, borderBottomColor: theme.cardBorder }]}>
            <View style={styles.pageHeaderInfo}>
              <Text style={[styles.pageHeaderTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {activeTab === 'list' ? 'Abonelikler' : activeTab === 'calendar' ? 'Ödeme Takvimi' : 'Analiz ve Raporlar'}
              </Text>
              <Text style={[styles.pageHeaderDescription, { color: theme.textSecondary }]} numberOfLines={isMobile ? 2 : 1}>
                {activeTab === 'list' ? 'Aboneliklerinizi ve düzenli ödemelerinizi yönetin.' : activeTab === 'calendar' ? 'Yaklaşan ödeme tarihlerini takvim üzerinden takip edin.' : 'Aylık harcama eğilimlerinizi ve bütçe yükünüzü inceleyin.'}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <View style={[styles.miniRatesBadge, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                <Text style={styles.miniRatesIcon}>💱</Text>
                <Text style={[styles.miniRatesText, { color: theme.textSecondary }]} numberOfLines={1}>
                  USD {Number(exchangeRates.USD).toFixed(2)} · EUR {Number(exchangeRates.EUR).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setIsAppearanceModalOpen(true)}>
                <Text style={styles.iconButtonText}>⚙️</Text>
              </TouchableOpacity>

              {!isDesktop && (
                <TouchableOpacity style={styles.primaryButton} onPress={() => openSubscriptionForm()}>
                  <Text style={styles.primaryButtonText}>+ Ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            ref={mainScrollRef}
            style={[styles.mainScroll, { overflowAnchor: 'none', scrollbarWidth: 'thin', scrollbarColor: `${theme.cardBorder} transparent` }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
            scrollEventThrottle={16}
            onScroll={event => { mainScrollPositionRef.current = event.nativeEvent.contentOffset.y; }}
          >
            {activeTab === 'list' && (
              <>
                <View style={[styles.summaryCard, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }]}>
                  <View style={styles.summaryLabelRow}>
                    <Text style={styles.summaryLabel}>Aylık Maliyet</Text>
                    {hasMonthlyChangeData && (
                      <View style={[styles.changeBadge, { backgroundColor: monthlyChangePercent <= 0 ? 'rgba(52,211,153,0.22)' : 'rgba(248,113,113,0.22)' }]}>
                        <Text style={[styles.changeBadgeText, { color: monthlyChangePercent <= 0 ? '#34d399' : '#f87171' }]}>
                          {monthlyChangePercent <= 0 ? '↓' : '↑'} %{Math.abs(monthlyChangePercent).toFixed(1)} Geçen Aya Göre
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.summaryValue}>{formatCurrency(monthlyTotalTL, 'TRY')}</Text>

                  <View style={styles.summaryStatsRow}>
                    <View style={styles.summaryStatBox}>
                      <Text style={styles.summaryStatLabel}>Günlük Maliyet</Text>
                      <Text style={styles.summaryStatValue}>{formatCurrency(dailyAverageTL, 'TRY')}</Text>
                    </View>
                    <View style={styles.summaryStatBox}>
                      <Text style={styles.summaryStatLabel}>Yıllık Toplam Maliyet</Text>
                      <Text style={styles.summaryStatValue}>{formatCurrency(yearlyProjectionTL, 'TRY')}</Text>
                    </View>
                  </View>
                </View>

                <TextInput
                  style={[styles.searchInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                  placeholder="Abonelik, Kategori veya Ödeme Yöntemi Ara..."
                  placeholderTextColor={theme.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                <View style={styles.singleFilterSection}>
                  <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>Görünüm Filtresi</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalOptionRow}>
                    {VIEW_FILTER_OPTIONS.map(option => (
                      <TouchableOpacity key={option.key} style={[styles.filterOption, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, viewFilter === option.key && styles.filterOptionActive]} onPress={() => setViewFilter(option.key)}>
                        <Text style={[styles.filterOptionText, { color: theme.textSecondary }, viewFilter === option.key && styles.filterOptionTextActive]}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.sectionTitleRow}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{selectedViewFilterLabel}</Text>
                  <Text style={[styles.resultCount, { color: theme.textMuted }]}>{filteredSubscriptions.length} kayıt</Text>
                </View>

                {filteredSubscriptions.length === 0 ? (
                  <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={styles.emptyIcon}>💳</Text>
                    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Kayıt Bulunamadı</Text>
                    <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>Arama metnini veya görünüm filtresini değiştiriniz.</Text>
                    <TouchableOpacity style={[styles.primaryButton, { marginTop: 14 }]} onPress={() => openSubscriptionForm()}>
                      <Text style={styles.primaryButtonText}>+ Abonelik Ekle</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  filteredSubscriptions.map(subscription => {
                    const baseAmount = Number(subscription.baseAmount ?? subscription.price) || 0;
                    const projectedAmount = baseAmount * getAnnualIncreaseMultiplier(subscription, currentDate.getFullYear());
                    const priceInTL = convertToTL(projectedAmount, subscription.currency || 'TRY', exchangeRates);
                    const notificationOption = NOTIFICATION_OPTIONS.find(o => o.value === subscription.notificationDays) || NOTIFICATION_OPTIONS[3];
                    const serviceColor = subscription.color || getServiceColor(subscription.name, safeTemplates);
                    const isYearly = subscription.period === 'yearly';

                    const nextRenewal = getNextRenewal(subscription, todayForFiltering);
                    const todayStart = new Date(todayForFiltering.getFullYear(), todayForFiltering.getMonth(), todayForFiltering.getDate());
                    const daysUntil = Math.round((nextRenewal - todayStart) / 86400000);
                    const daysLabel = daysUntil === 0 ? 'Bugün' : daysUntil === 1 ? 'Yarın' : `${daysUntil} gün kaldı`;
                    const daysColor = daysUntil <= 2 ? theme.danger : daysUntil <= 7 ? theme.warning : theme.accent;

                    const cycleKey = getCycleKey(subscription, todayForFiltering);
                    const isPaid = subscription.paidCycleKey === cycleKey;

                    return (
                      <View key={subscription.id} style={[styles.subscriptionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.subscriptionMain}>
                          <View style={[styles.serviceIcon, { backgroundColor: serviceColor }]}>
                            <Text style={styles.serviceIconText}>{subscription.name?.charAt(0)?.toUpperCase() || 'C'}</Text>
                          </View>

                          <View style={styles.subscriptionInfo}>
                            <View style={styles.subscriptionTitleRow}>
                              <Text style={[styles.subscriptionName, { color: theme.textPrimary }]}>{subscription.name}</Text>

                              <View style={[styles.remainingDaysBadge, { backgroundColor: hexToRgba(daysColor, 0.14), borderColor: daysColor }]}>
                                <Text style={[styles.remainingDaysText, { color: daysColor }]}>⏳ {daysLabel}</Text>
                              </View>

                              <View style={[styles.informationTag, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                                <Text style={[styles.informationTagText, { color: theme.textSecondary }]}>💳 {subscription.paymentMethod}</Text>
                              </View>

                              {notificationOption.value !== -1 && (
                                <View style={[styles.informationTag, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                                  <Text style={[styles.informationTagText, { color: theme.accent }]}>{notificationOption.badgeLabel}</Text>
                                </View>
                              )}

                              {(Number(subscription.annualIncreaseRate) || 0) > 0 && (
                                <View style={[styles.informationTag, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                                  <Text style={[styles.informationTagText, { color: theme.accent }]}>↗ Artış: %{Number(subscription.annualIncreaseRate).toFixed(1)}</Text>
                                </View>
                              )}
                            </View>

                            <Text style={[styles.subscriptionSubtitle, { color: theme.textSecondary }]}>
                              {subscription.category} • {isYearly ? `${subscription.billingDay}/${subscription.billingMonth}/${subscription.billingYear}` : `Her ayın ${subscription.billingDay}. günü`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.subscriptionRight}>
                          <Text style={[styles.subscriptionPrice, { color: theme.textPrimary }]}>{formatCurrency(projectedAmount, subscription.currency || 'TRY')} {isYearly ? '/yıl' : '/ay'}</Text>
                          {subscription.currency !== 'TRY' && <Text style={[styles.convertedPrice, { color: theme.accent }]}>≈ {formatCurrency(priceInTL, 'TRY')}</Text>}

                          <View style={styles.subscriptionActions}>
                            <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: isPaid ? theme.success : theme.inputBg, borderColor: isPaid ? theme.success : theme.cardBorder }]} onPress={() => togglePaid(subscription)}>
                              <Text style={[styles.smallActionText, { color: isPaid ? '#04331f' : theme.textSecondary }]}>{isPaid ? '✓ Ödendi' : 'Ödendi İşaretle'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => openSubscriptionForm(subscription)}>
                              <Text style={[styles.smallActionText, { color: theme.textSecondary }]}>Düzenle</Text>
                            </TouchableOpacity>

                            {subscription.cancelUrl ? (
                              <TouchableOpacity style={[styles.smallActionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => Linking.openURL(subscription.cancelUrl)}>
                                <Text style={[styles.smallActionText, { color: theme.accent }]}>Yönet</Text>
                              </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => handleDeleteSubscription(subscription.id)}>
                              <Text style={styles.deleteButtonText}>🗑️</Text>
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
              <View style={styles.calendarSection}>
                <View style={styles.calendarNavigation}>
                  <TouchableOpacity style={[styles.calendarNavigationButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => {
                    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(Math.max(YEARS[0], calendarYear - 1)); } else setCalendarMonth(calendarMonth - 1);
                  }}>
                    <Text style={[styles.calendarNavigationText, { color: theme.accent }]}>◀ Önceki</Text>
                  </TouchableOpacity>

                  <Text style={[styles.calendarTitle, { color: theme.textPrimary }]}>{MONTH_NAMES[calendarMonth]} {calendarYear}</Text>

                  <TouchableOpacity style={[styles.calendarNavigationButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => {
                    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(Math.min(YEARS[YEARS.length - 1], calendarYear + 1)); } else setCalendarMonth(calendarMonth + 1);
                  }}>
                    <Text style={[styles.calendarNavigationText, { color: theme.accent }]}>Sonraki ▶</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarContainer}>
                  <View style={styles.calendarWeekHeader}>
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(dayName => (
                      <View key={dayName} style={styles.calendarWeekDay}>
                        <Text style={[styles.calendarWeekDayText, { color: theme.textSecondary }]}>{dayName}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.calendarGrid}>
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                      <View key={`empty-${i}`} style={[styles.calendarDay, styles.calendarDayEmpty]} />
                    ))}

                    {Array.from({ length: daysInCurrentMonth }).map((_, dayIndex) => {
                      const dayNumber = dayIndex + 1;
                      const subscriptionsForDay = safeList.filter(subscription => {
                        if (subscription.status === 'cancelled') return false;
                        const targetMonthKey = calendarYear * 12 + calendarMonth;
                        const billingMonthKey = (Number(subscription.billingYear) || calendarYear) * 12 + ((Number(subscription.billingMonth) || 1) - 1);
                        if (targetMonthKey < billingMonthKey) return false;
                        if (subscription.period === 'monthly') return Number(subscription.billingDay) === dayNumber;
                        return Number(subscription.billingDay) === dayNumber && Number(subscription.billingMonth) === calendarMonth + 1 && Number(subscription.billingYear) === calendarYear;
                      });

                      const hasSubscription = subscriptionsForDay.length > 0;

                      return (
                        <TouchableOpacity
                          key={dayNumber}
                          activeOpacity={0.75}
                          onPress={() => openDayDrawer(dayNumber, subscriptionsForDay)}
                          style={[styles.calendarDay, { backgroundColor: theme.cardBg, borderColor: hasSubscription ? theme.activeButtonBorder : theme.cardBorder }, hasSubscription && styles.calendarDayActive]}
                        >
                          <Text style={[styles.calendarDayNumber, { color: theme.textPrimary }]}>{dayNumber}</Text>

                          <ScrollView style={styles.calendarDayScroll} contentContainerStyle={styles.calendarDayScrollContent} nestedScrollEnabled showsVerticalScrollIndicator={subscriptionsForDay.length > 3}>
                            {subscriptionsForDay.map(subscription => {
                              const badgeColor = subscription.color || CATEGORY_COLORS[subscription.category] || CATEGORY_COLORS.Diğer;
                              const baseAmount = Number(subscription.baseAmount ?? subscription.price) || 0;
                              const projectedAmount = baseAmount * getAnnualIncreaseMultiplier(subscription, calendarYear);
                              return (
                                <View key={subscription.id} style={[styles.calendarSubscriptionBadge, { backgroundColor: badgeColor }]}>
                                  <Text style={styles.calendarSubscriptionName} numberOfLines={1}>{subscription.name}</Text>
                                  <Text style={styles.calendarSubscriptionPrice}>{formatShortCurrency(convertToTL(projectedAmount, subscription.currency, exchangeRates), 'TRY')}</Text>
                                </View>
                              );
                            })}
                          </ScrollView>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'analytics' && (
              <View style={styles.analyticsSection}>
                <View style={styles.analysisToolbar}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.analysisToolbarLabel, { color: theme.textMuted }]}>Raporlama Dönemi</Text>
                    <Text style={[styles.analysisToolbarHint, { color: theme.textSecondary }]}>Tüm analizler seçilen yıla göre güncellenir.</Text>
                  </View>
                  <View style={[styles.yearSelectorRow, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    {YEARS.map(year => (
                      <TouchableOpacity key={year} style={[styles.yearSelectorButton, selectedAnalysisYear === year && { backgroundColor: theme.accent }]} onPress={() => setSelectedAnalysisYear(year)}>
                        <Text style={[styles.yearSelectorText, { color: selectedAnalysisYear === year ? '#ffffff' : theme.textSecondary }]}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={[styles.insightBox, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder }]}>
                  <View style={styles.insightIconBox}><Text style={{ fontSize: 20 }}>✨</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.insightTitle}>Akıllı Asistan Özeti</Text>
                    <Text style={styles.insightText}>{insightText}</Text>
                  </View>
                </View>

                <View style={[styles.panel, styles.analysisPrimaryPanel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>{selectedAnalysisYear} Aylık Harcama Grafiği</Text>
                  <Text style={[styles.panelDescription, { color: theme.textMuted }]}>Aylık harcama eğilimi ve kategori kırılımı.</Text>

                  <View style={styles.categoryLegend}>
                    {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                      <View key={category} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: color }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>{category}</Text>
                      </View>
                    ))}
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollContent}>
                    <View style={styles.chartArea}>
                      {monthlyTotals.map((monthTotal, monthIndex) => {
                        const heightPercentage = maxMonthlyExpense > 0 ? (monthTotal / maxMonthlyExpense) * 100 : 0;
                        const visibleHeight = monthTotal > 0 ? Math.max(heightPercentage, 8) : 0;
                        const categorySegments = monthlyCategoryBreakdown[monthIndex] || [];

                        return (
                          <View key={monthIndex} style={styles.chartColumn}>
                            <Text style={[styles.chartAmount, { color: theme.textSecondary }]}>{monthTotal > 0 ? formatShortCurrency(monthTotal, 'TRY') : ''}</Text>

                            <View style={[styles.chartTrack, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                              {monthTotal > 0 && (
                                <View style={[styles.chartStack, { height: `${visibleHeight}%` }]}>
                                  {categorySegments.map((segment, segmentIndex) => (
                                    <View
                                      key={`${segment.category}-${segmentIndex}`}
                                      style={[
                                        styles.chartSegment,
                                        {
                                          height: `${(segment.amount / monthTotal) * 100}%`,
                                          backgroundColor: segment.color
                                        }
                                      ]}
                                    />
                                  ))}
                                </View>
                              )}
                            </View>

                            <Text style={[styles.chartMonthLabel, { color: theme.textPrimary }]}>{MONTH_NAMES[monthIndex].substring(0, 3)}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>

                  <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder }]}>
                    <Text style={[styles.chartFooterLabel, { color: theme.textPrimary }]}>Aylık Ortalama Harcama ({selectedAnalysisYear})</Text>
                    <Text style={[styles.chartFooterValue, { color: theme.accent }]}>{formatCurrency(averageMonthlyExpense, 'TRY')}</Text>
                  </View>
                </View>

                <View style={[styles.analysisSectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.distributionTitle, styles.distributionTitleNoTop, { color: theme.textPrimary }]}>Kategori Bazlı Aylık Dağılım</Text>
                  {sortedMonthlyCategoryEntries.length === 0 ? (
                    <Text style={[styles.noDataText, { color: theme.textSecondary }]}>Seçilen yıl için kategori verisi bulunamadı.</Text>
                  ) : sortedMonthlyCategoryEntries.map(([category, amount]) => {
                    const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.Diğer;
                    const percentage = totalMonthlyCategoryExpense > 0 ? ((amount / totalMonthlyCategoryExpense) * 100).toFixed(1) : 0;
                    return (
                      <View key={category} style={[styles.distributionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.distributionHeader}>
                          <View style={styles.distributionNameGroup}>
                            <View style={[styles.distributionColorDot, { backgroundColor: categoryColor }]} />
                            <Text style={[styles.distributionName, { color: theme.textPrimary }]}>{category}</Text>
                          </View>
                          <Text style={[styles.distributionAmount, { color: theme.textPrimary }]}>{formatCurrency(amount, 'TRY')} / Ay · %{percentage}</Text>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
                          <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: categoryColor }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {!isDesktop && (
            <View style={[styles.bottomNavigation, { backgroundColor: theme.headerBg, borderTopColor: theme.cardBorder }]}>
              {[
                { key: 'list', icon: '💳', label: 'Abonelikler' },
                { key: 'calendar', icon: '📅', label: 'Takvim' },
                { key: 'analytics', icon: '📊', label: 'Analiz' }
              ].map(navItem => (
                <TouchableOpacity key={navItem.key} style={styles.bottomNavigationItem} onPress={() => { scrollMainToTop(false); setActiveTab(navItem.key); }}>
                  <Text style={styles.bottomNavigationIcon}>{navItem.icon}</Text>
                  <Text style={[styles.bottomNavigationText, { color: activeTab === navItem.key ? '#9b98ff' : theme.textSecondary }]}>{navItem.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* YENİ ABONELİK / GİDER EKLEME MODALI (2 AŞAMALI) */}
      <Modal visible={isSubscriptionModalOpen} transparent animationType="fade" onRequestClose={closeSubscriptionForm}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.glassSurface, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Yeni Abonelik Ekle</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>Abonelik veya düzenli gider bilgilerinizi birkaç adımda ekleyin.</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeSubscriptionForm}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ADIM GÖSTERGESİ */}
            <View style={styles.stepIndicatorRow}>
              <View style={[styles.stepBadge, formStep === 1 && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
                <Text style={[styles.stepBadgeText, formStep === 1 && { color: '#ffffff' }]}>1. Temel Bilgiler</Text>
              </View>
              <View style={[styles.stepDivider, { backgroundColor: theme.cardBorder }]} />
              <View style={[styles.stepBadge, formStep === 2 && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
                <Text style={[styles.stepBadgeText, formStep === 2 && { color: '#ffffff' }]}>2. Ödeme ve Hatırlatıcı</Text>
              </View>
            </View>

            <ScrollView style={styles.modalScrollBody} contentContainerStyle={styles.modalScrollBodyContent} showsVerticalScrollIndicator>
              {formStep === 1 ? (
                <>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Abonelik Türü</Text>
                  <View style={styles.typeSelectorRow}>
                    {[
                      { key: 'subscription', label: 'Abonelik' },
                      { key: 'fixed_expense', label: 'Sabit Gider' }
                    ].map(type => (
                      <TouchableOpacity
                        key={type.key}
                        style={[styles.typeOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formExpenseType === type.key && { borderColor: theme.accent, backgroundColor: hexToRgba(theme.accent, 0.15) }]}
                        onPress={() => setFormExpenseType(type.key)}
                      >
                        <Text style={[styles.typeOptionText, { color: theme.textSecondary }, formExpenseType === type.key && { color: theme.accent }]}>{type.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 12 }]}>Hazır Şablonlar</Text>
                  <Text style={[styles.inputHint, { color: theme.textMuted }]}>Sık kullanılan bir servisi seçerek alanları otomatik doldurun.</Text>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalTemplateRow}>
                    {safeTemplates.map((template, templateIndex) => {
                      const isSelected = normalizeText(formName) === normalizeText(template.name);
                      return (
                        <TouchableOpacity
                          key={template.name}
                          style={[styles.templateCard, { backgroundColor: theme.inputBg, borderColor: isSelected ? theme.accent : theme.cardBorder }, isSelected && { borderWidth: 2 }]}
                          onPress={() => {
                            setFormName(template.name);
                            setFormPrice(template.price);
                            setFormCurrency(template.currency);
                            setFormCategory(template.category);
                            setFormColor(template.color || getServiceColor(template.name, safeTemplates));
                          }}
                        >
                          <View style={styles.templateCardTop}>
                            <Text style={[styles.templateName, { color: theme.textPrimary }]} numberOfLines={1}>{template.name}</Text>
                            {templateIndex >= DEFAULT_TEMPLATES.length && (
                              <TouchableOpacity onPress={() => removeTemplate(templateIndex)} style={styles.templateDeleteIcon}>
                                <Text style={{ fontSize: 11, color: theme.danger }}>✕</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <Text style={[styles.templatePrice, { color: theme.accent }]}>{template.price} {template.currency}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 16 }]}>
                    {formExpenseType === 'subscription' ? 'Servis veya Abonelik Adı *' : 'Gider Adı *'}
                  </Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                    placeholder="Örn. Netflix, İnternet, Kira"
                    placeholderTextColor={theme.textMuted}
                    value={formName}
                    onChangeText={setFormName}
                  />

                  <View style={styles.formRowTwo}>
                    <View style={{ flex: 2, marginRight: 8 }}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Tutar *</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                        placeholder="349.90"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={formPrice}
                        onChangeText={setFormPrice}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Para Birimi</Text>
                      <View style={styles.currencySelectorRow}>
                        {['TRY', 'USD', 'EUR'].map(curr => (
                          <TouchableOpacity
                            key={curr}
                            style={[styles.currencyOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formCurrency === curr && { backgroundColor: theme.accent, borderColor: theme.accent }]}
                            onPress={() => setFormCurrency(curr)}
                          >
                            <Text style={[styles.currencyOptionText, { color: theme.textSecondary }, formCurrency === curr && { color: '#ffffff' }]}>{curr}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Ödeme Periyodu *</Text>
                  <View style={styles.periodSelectorRow}>
                    {[
                      { key: 'monthly', label: 'Aylık' },
                      { key: 'yearly', label: 'Yıllık' }
                    ].map(period => (
                      <TouchableOpacity
                        key={period.key}
                        style={[styles.periodOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPeriod === period.key && { borderColor: theme.accent, backgroundColor: hexToRgba(theme.accent, 0.15) }]}
                        onPress={() => setFormPeriod(period.key)}
                      >
                        <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formPeriod === period.key && { color: theme.accent }]}>{period.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* GELİŞMİŞ AYARLAR (YILLIK ARTIŞ ORANI) */}
                  <View style={[styles.advancedSettingsContainer, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                    <TouchableOpacity style={styles.advancedSettingsHeader} onPress={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}>
                      <Text style={[styles.advancedSettingsTitle, { color: theme.textPrimary }]}>⚙️ Gelişmiş Ayarlar (Yıllık Artış / Enflasyon)</Text>
                      <Text style={[styles.advancedSettingsChevron, { color: theme.accent }]}>{isAdvancedSettingsOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {isAdvancedSettingsOpen && (
                      <View style={styles.advancedSettingsBody}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Yıllık Tahmini Artış Oranı (%)</Text>
                        <TextInput
                          style={[styles.textInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                          placeholder="25"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="numeric"
                          value={formAnnualIncreaseRate}
                          onChangeText={setFormAnnualIncreaseRate}
                        />
                        <Text style={[styles.inputHint, { color: theme.textMuted }]}>Bu oran, abonelik tutarının sonraki yıllardaki tahmini değerini bileşik olarak hesaplamak için kullanılır.</Text>

                        <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 12 }]}>Artış Uygulama Zamanı</Text>
                        <View style={styles.typeSelectorRow}>
                          {[
                            { key: 'subscription_anniversary', label: 'Yenileme Tarihinde' },
                            { key: 'calendar_year', label: 'Takvim Yılı Başında' }
                          ].map(appType => (
                            <TouchableOpacity
                              key={appType.key}
                              style={[styles.typeOptionButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, formIncreaseApplicationType === appType.key && { borderColor: theme.accent, backgroundColor: hexToRgba(theme.accent, 0.15) }]}
                              onPress={() => setFormIncreaseApplicationType(appType.key)}
                            >
                              <Text style={[styles.typeOptionText, { color: theme.textSecondary }, formIncreaseApplicationType === appType.key && { color: theme.accent }]}>{appType.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        {/* TAHMİNİ FİYAT ÖNİZLEMESİ */}
                        {Number(formPrice) > 0 && Number(formAnnualIncreaseRate) > 0 && (
                          <View style={[styles.pricePreviewCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                            <Text style={[styles.pricePreviewTitle, { color: theme.textPrimary }]}>Tahmini Fiyat Değişimi Önizlemesi</Text>
                            {[0, 1, 2, 3].map(offset => {
                              const targetYear = Number(formYear) + offset;
                              const mockItem = { baseAmount: formPrice, annualIncreaseRate: formAnnualIncreaseRate, billingYear: formYear, increaseApplicationType: formIncreaseApplicationType };
                              const predictedPrice = Number(formPrice) * getAnnualIncreaseMultiplier(mockItem, targetYear);
                              return (
                                <View key={targetYear} style={styles.pricePreviewRow}>
                                  <Text style={[styles.pricePreviewYear, { color: theme.textSecondary }]}>{targetYear}</Text>
                                  <Text style={[styles.pricePreviewAmount, { color: theme.accent }]}>{formatCurrency(predictedPrice, formCurrency)}</Text>
                                </View>
                              );
                            })}
                            <Text style={[styles.inputHint, { color: theme.textMuted, marginTop: 6 }]}>Bu değerler tahminidir. Gerçek fiyat değişiklikleri farklılık gösterebilir.</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Ödeme Yapılan Kart veya Hesap</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalTemplateRow}>
                    {safePaymentMethods.map((method, methodIndex) => {
                      const isSelected = formPaymentMethod === method;
                      return (
                        <TouchableOpacity
                          key={method}
                          style={[styles.paymentMethodCard, { backgroundColor: theme.inputBg, borderColor: isSelected ? theme.accent : theme.cardBorder }, isSelected && { borderWidth: 2 }]}
                          onPress={() => setFormPaymentMethod(method)}
                        >
                          <Text style={[styles.paymentMethodCardText, { color: theme.textPrimary }]} numberOfLines={1}>{method}</Text>
                          {methodIndex >= DEFAULT_PAYMENT_METHODS.length && (
                            <TouchableOpacity onPress={() => removePaymentMethod(method)} style={styles.templateDeleteIcon}>
                              <Text style={{ fontSize: 11, color: theme.danger }}>✕</Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <TouchableOpacity style={styles.addInlineButton} onPress={() => setShowPaymentMethodForm(!showPaymentMethodForm)}>
                    <Text style={[styles.addInlineButtonText, { color: theme.accent }]}>+ Yeni Ödeme Yöntemi Ekle</Text>
                  </TouchableOpacity>

                  {showPaymentMethodForm && (
                    <View style={styles.inlineAddBox}>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                        placeholder="Örn. Akbank Kart"
                        placeholderTextColor={theme.textMuted}
                        value={newPaymentMethodName}
                        onChangeText={setNewPaymentMethodName}
                      />
                      <TouchableOpacity style={[styles.primaryButton, { marginTop: 8 }]} onPress={addPaymentMethod}>
                        <Text style={styles.primaryButtonText}>Ödeme Yöntemini Kaydet</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 12 }]}>Kategori *</Text>
                  <View style={styles.categoryGrid}>
                    {Object.keys(CATEGORY_COLORS).map(cat => {
                      const isSelected = formCategory === cat;
                      const catColor = CATEGORY_COLORS[cat];
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.categoryOptionButton, { backgroundColor: theme.inputBg, borderColor: isSelected ? catColor : theme.cardBorder }, isSelected && { borderWidth: 2, backgroundColor: hexToRgba(catColor, 0.15) }]}
                          onPress={() => setFormCategory(cat)}
                        >
                          <View style={[styles.legendDot, { backgroundColor: catColor }]} />
                          <Text style={[styles.categoryOptionText, { color: theme.textSecondary }, isSelected && { color: theme.textPrimary, fontWeight: 'bold' }]}>{cat}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 12 }]}>İlk Ödeme veya Yenileme Tarihi *</Text>
                  <View style={styles.dateRowThree}>
                    <View style={{ flex: 1, marginRight: 6 }}>
                      <Text style={[styles.inputLabelSmall, { color: theme.textMuted }]}>Gün</Text>
                      <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} keyboardNumeric placeholder="1" value={formDay} onChangeText={setFormDay} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 6 }}>
                      <Text style={[styles.inputLabelSmall, { color: theme.textMuted }]}>Ay</Text>
                      <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} keyboardNumeric placeholder="1" value={formMonth} onChangeText={setFormMonth} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={[styles.inputLabelSmall, { color: theme.textMuted }]}>Yıl</Text>
                      <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} keyboardNumeric placeholder="2026" value={formYear} onChangeText={setFormYear} />
                    </View>
                  </View>

                  <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 12 }]}>Hatırlatma Zamanı</Text>
                  <View style={styles.notificationRow}>
                    {NOTIFICATION_OPTIONS.map(opt => {
                      const isSelected = formNotificationDays === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.notificationButton, { backgroundColor: theme.inputBg, borderColor: isSelected ? theme.accent : theme.cardBorder }, isSelected && { backgroundColor: hexToRgba(theme.accent, 0.15) }]}
                          onPress={() => setFormNotificationDays(opt.value)}
                        >
                          <Text style={[styles.notificationButtonText, { color: isSelected ? theme.accent : theme.textSecondary }]}>{opt.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 12 }]}>Yönetim veya İptal Bağlantısı (Opsiyonel)</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]}
                    placeholder="https://netflix.com/youraccount"
                    placeholderTextColor={theme.textMuted}
                    autoCapitalize="none"
                    value={formCancelUrl}
                    onChangeText={setFormCancelUrl}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              {formStep === 2 ? (
                <TouchableOpacity style={[styles.secondaryButton, { flex: 1, marginRight: 8, backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setFormStep(1)}>
                  <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Geri</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.secondaryButton, { flex: 1, marginRight: 8, backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={closeSubscriptionForm}>
                  <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>İptal</Text>
                </TouchableOpacity>
              )}

              {formStep === 1 ? (
                <TouchableOpacity style={[styles.primaryButton, { flex: 1, marginLeft: 8 }]} onPress={goToStepTwo}>
                  <Text style={styles.primaryButtonText}>Devam Et</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.primaryButton, { flex: 1, marginLeft: 8, backgroundColor: theme.success }]} onPress={handleSaveSubscription}>
                  <Text style={[styles.primaryButtonText, { color: '#04331f' }]}>{editingId ? 'Değişiklikleri Kaydet' : 'Aboneliği Kaydet'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* GÖRÜNÜM VE TEMA AYARLARI MODALI */}
      <Modal visible={isAppearanceModalOpen} transparent animationType="fade" onRequestClose={() => setIsAppearanceModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.glassSurface, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Görünüm ve Tema</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>Uygulama renk temasını ve yazı boyutunu özelleştirin.</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsAppearanceModalOpen(false)}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollBody} contentContainerStyle={styles.modalScrollBodyContent}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Tema Paleti</Text>
              <View style={styles.presetGrid}>
                {Object.entries(BACKGROUND_PRESETS).map(([key, preset]) => {
                  const isSelected = backgroundPreset === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.presetCard, { backgroundColor: preset.cardBg, borderColor: isSelected ? theme.accent : preset.cardBorder }, isSelected && { borderWidth: 2 }]}
                      onPress={() => setBackgroundPreset(key)}
                    >
                      <View style={[styles.presetColorDot, { backgroundColor: preset.summaryBg }]} />
                      <Text style={[styles.presetCardText, { color: preset.textPrimary }]}>{preset.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 16 }]}>Yazı Boyutu</Text>
              <View style={styles.presetGrid}>
                {FONT_SCALE_OPTIONS.map(opt => {
                  const isSelected = fontScaleKey === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.presetCard, { backgroundColor: theme.inputBg, borderColor: isSelected ? theme.accent : theme.cardBorder }, isSelected && { borderWidth: 2 }]}
                      onPress={() => setFontScaleKey(opt.key)}
                    >
                      <Text style={[styles.presetCardText, { color: theme.textPrimary }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={() => setIsAppearanceModalOpen(false)}>
                <Text style={styles.primaryButtonText}>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TAKVİM GÜN DETAY DRAWER / MODALI */}
      <Modal visible={dayDrawer.visible} transparent animationType="slide" onRequestClose={() => setDayDrawer(d => ({ ...d, visible: false }))}>
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerBackdrop} activeOpacity={1} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))} />
          <View style={[styles.drawerContent, styles.glassSurface, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{dayDrawer.day} {MONTH_NAMES[dayDrawer.month || 0]} {dayDrawer.year}</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>Bu tarihte gerçekleşecek ödemeler</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollBody} contentContainerStyle={styles.modalScrollBodyContent}>
              {dayDrawer.items.length === 0 ? (
                <Text style={[styles.noDataText, { color: theme.textSecondary, textAlign: 'center', paddingVertical: 20 }]}>Bu tarihte kayıtlı ödeme bulunmuyor.</Text>
              ) : (
                dayDrawer.items.map(sub => {
                  const baseAmount = Number(sub.baseAmount ?? sub.price) || 0;
                  const projectedAmount = baseAmount * getAnnualIncreaseMultiplier(sub, dayDrawer.year || currentDate.getFullYear());
                  return (
                    <View key={sub.id} style={[styles.drawerItemCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.drawerItemTitle, { color: theme.textPrimary }]}>{sub.name}</Text>
                        <Text style={[styles.drawerItemSubtitle, { color: theme.textSecondary }]}>{sub.category} • {sub.paymentMethod}</Text>
                      </View>
                      <Text style={[styles.drawerItemPrice, { color: theme.accent }]}>{formatCurrency(projectedAmount, sub.currency)}</Text>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))}>
                <Text style={styles.primaryButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DUPLICATE WARNING MODAL */}
      <Modal visible={duplicateWarning.visible} transparent animationType="fade" onRequestClose={() => setDuplicateWarning({ visible: false, name: '' })}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.glassSurface, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary, marginBottom: 8 }]}>Benzer Kayıt Bulundu</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary, marginBottom: 16 }]}>Sistemde "{duplicateWarning.name}" adında aktif bir kayıt zaten mevcut. Yine de kaydetmek istiyor musunuz?</Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.secondaryButton, { flex: 1, marginRight: 8, backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setDuplicateWarning({ visible: false, name: '' })}>
                <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { flex: 1, marginLeft: 8 }]} onPress={() => { setDuplicateWarning({ visible: false, name: '' }); handleSaveSubscription(); }}>
                <Text style={styles.primaryButtonText}>Yine de Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme, isMobile, fontScale) => StyleSheet.create({
  container: { flex: 1 },
  glassSurface: { ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}) },
  appWrapper: { flex: 1, flexDirection: 'row' },
  appWrapperDesktop: { maxWidth: 1440, alignSelf: 'center', width: '100%' },
  sidebarContainer: { width: 280, padding: 20, borderRightWidth: 1, justifyContent: 'space-between' },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 24 * fontScale, fontWeight: '800', letterSpacing: -0.5 },
  proBadge: { backgroundColor: '#6366f1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  proBadgeText: { color: '#ffffff', fontSize: 10 * fontScale, fontWeight: '700' },
  headerSubtitle: { fontSize: 12 * fontScale, marginBottom: 24 },
  sidebarNavGroup: { flex: 1 },
  sidebarNavButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6 },
  sidebarNavButtonActive: { backgroundColor: theme.inputBg },
  sidebarNavIcon: { fontSize: 16 * fontScale, marginRight: 12 },
  sidebarNavText: { fontSize: 14 * fontScale, fontWeight: '600' },
  sidebarFooter: { gap: 8 },
  contentWrapper: { flex: 1, flexDirection: 'column', height: '100%' },
  header: { paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  pageHeaderInfo: { flex: 1, marginRight: 12 },
  pageHeaderTitle: { fontSize: 20 * fontScale, fontWeight: '700', letterSpacing: -0.3 },
  pageHeaderDescription: { fontSize: 12 * fontScale, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniRatesBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  miniRatesIcon: { fontSize: 12 * fontScale, marginRight: 6 },
  miniRatesText: { fontSize: 11 * fontScale, fontWeight: '500' },
  iconButton: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconButtonText: { fontSize: 14 * fontScale },
  mainScroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  summaryCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13 * fontScale, color: '#ffffff', opacity: 0.85, fontWeight: '600' },
  summaryValue: { fontSize: 32 * fontScale, fontWeight: '800', color: '#ffffff', letterSpacing: -1, marginBottom: 16 },
  summaryStatsRow: { flexDirection: 'row', gap: 12 },
  summaryStatBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', padding: 12, borderRadius: 10 },
  summaryStatLabel: { fontSize: 11 * fontScale, color: '#ffffff', opacity: 0.8, marginBottom: 4 },
  summaryStatValue: { fontSize: 15 * fontScale, fontWeight: '700', color: '#ffffff' },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  changeBadgeText: { fontSize: 11 * fontScale, fontWeight: '700' },
  searchInput: { height: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 * fontScale, marginBottom: 16 },
  singleFilterSection: { marginBottom: 16 },
  sectionLabel: { fontSize: 13 * fontScale, fontWeight: '600', marginBottom: 8 },
  horizontalOptionRow: { gap: 8, paddingBottom: 4 },
  filterOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  filterOptionActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  filterOptionText: { fontSize: 13 * fontScale, fontWeight: '500' },
  filterOptionTextActive: { color: '#ffffff', fontWeight: '600' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16 * fontScale, fontWeight: '700' },
  resultCount: { fontSize: 12 * fontScale },
  subscriptionCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12 },
  subscriptionMain: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  serviceIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serviceIconText: { color: '#ffffff', fontSize: 18 * fontScale, fontWeight: '800' },
  subscriptionInfo: { flex: 1 },
  subscriptionTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  subscriptionName: { fontSize: 15 * fontScale, fontWeight: '700', marginRight: 4 },
  subscriptionSubtitle: { fontSize: 12 * fontScale },
  remainingDaysBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  remainingDaysText: { fontSize: 10 * fontScale, fontWeight: '700' },
  informationTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  informationTagText: { fontSize: 10 * fontScale, fontWeight: '500' },
  subscriptionRight: { alignItems: isMobile ? 'flex-start' : 'flex-end', gap: 6 },
  subscriptionPrice: { fontSize: 16 * fontScale, fontWeight: '800' },
  convertedPrice: { fontSize: 11 * fontScale, fontWeight: '600' },
  subscriptionActions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  smallActionButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  smallActionText: { fontSize: 11 * fontScale, fontWeight: '600' },
  deleteButton: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  deleteButtonText: { fontSize: 12 * fontScale },
  emptyCard: { padding: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  emptyIcon: { fontSize: 32 * fontScale, marginBottom: 8 },
  emptyTitle: { fontSize: 16 * fontScale, fontWeight: '700', marginBottom: 4 },
  emptyDescription: { fontSize: 13 * fontScale, textAlign: 'center' },
  primaryButton: { backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#ffffff', fontSize: 14 * fontScale, fontWeight: '700' },
  secondaryButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontSize: 13 * fontScale, fontWeight: '600' },
  bottomNavigation: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 8, paddingHorizontal: 12, justifyContent: 'space-around' },
  bottomNavigationItem: { alignItems: 'center', padding: 4 },
  bottomNavigationIcon: { fontSize: 18 * fontScale, marginBottom: 2 },
  bottomNavigationText: { fontSize: 10 * fontScale, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: isMobile ? 12 : 24 },
  modalContent: { width: '100%', maxWidth: 640, maxHeight: '90%', borderRadius: 18, borderWidth: 1, padding: 20, flexDirection: 'column' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 18 * fontScale, fontWeight: '800' },
  modalSubtitle: { fontSize: 12 * fontScale, marginTop: 2 },
  modalCloseButton: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 16 * fontScale, fontWeight: '700' },
  stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  stepBadge: { flex: 1, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  stepBadgeText: { fontSize: 12 * fontScale, fontWeight: '600' },
  stepDivider: { width: 12, height: 1 },
  modalScrollBody: { flex: 1 },
  modalScrollBodyContent: { paddingBottom: 16 },
  modalFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', gap: 8 },
  inputLabel: { fontSize: 12 * fontScale, fontWeight: '700', marginBottom: 6, marginTop: 10 },
  inputLabelSmall: { fontSize: 11 * fontScale, fontWeight: '600', marginBottom: 4 },
  inputHint: { fontSize: 11 * fontScale, marginBottom: 6 },
  textInput: { height: 42, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 * fontScale },
  typeSelectorRow: { flexDirection: 'row', gap: 8 },
  typeOptionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  typeOptionText: { fontSize: 13 * fontScale, fontWeight: '600' },
  horizontalTemplateRow: { gap: 8, paddingBottom: 6 },
  templateCard: { width: 130, padding: 10, borderRadius: 10, borderWidth: 1 },
  templateCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  templateName: { fontSize: 13 * fontScale, fontWeight: '700', flex: 1, marginRight: 4 },
  templateDeleteIcon: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  templatePrice: { fontSize: 12 * fontScale, fontWeight: '600' },
  formRowTwo: { flexDirection: 'row', gap: 8, marginTop: 4 },
  currencySelectorRow: { flexDirection: 'row', gap: 4 },
  currencyOptionButton: { flex: 1, height: 42, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  currencyOptionText: { fontSize: 12 * fontScale, fontWeight: '700' },
  periodSelectorRow: { flexDirection: 'row', gap: 8 },
  periodOptionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  periodOptionText: { fontSize: 13 * fontScale, fontWeight: '600' },
  advancedSettingsContainer: { borderRadius: 10, borderWidth: 1, marginTop: 14, overflow: 'hidden' },
  advancedSettingsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  advancedSettingsTitle: { fontSize: 13 * fontScale, fontWeight: '700' },
  advancedSettingsChevron: { fontSize: 12 * fontScale },
  advancedSettingsBody: { padding: 12, paddingTop: 0 },
  pricePreviewCard: { padding: 10, borderRadius: 8, borderWidth: 1, marginTop: 12 },
  pricePreviewTitle: { fontSize: 12 * fontScale, fontWeight: '700', marginBottom: 6 },
  pricePreviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2 },
  pricePreviewYear: { fontSize: 12 * fontScale },
  pricePreviewAmount: { fontSize: 12 * fontScale, fontWeight: '700' },
  paymentMethodCard: { width: 140, padding: 10, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  paymentMethodCardText: { fontSize: 12 * fontScale, fontWeight: '600', flex: 1 },
  addInlineButton: { marginTop: 6, marginBottom: 4 },
  addInlineButtonText: { fontSize: 12 * fontScale, fontWeight: '600' },
  inlineAddBox: { padding: 10, borderRadius: 8, borderWidth: 1, marginTop: 6 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryOptionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, gap: 6 },
  categoryOptionText: { fontSize: 12 * fontScale, fontWeight: '500' },
  dateRowThree: { flexDirection: 'row' },
  notificationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  notificationButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  notificationButtonText: { fontSize: 11 * fontScale, fontWeight: '600' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  presetCard: { flex: 1, minWidth: '45%'.replace('%', ''), padding: 12, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  presetColorDot: { width: 16, height: 16, borderRadius: 8 },
  presetCardText: { fontSize: 13 * fontScale, fontWeight: '600' },
  calendarSection: { gap: 16 },
  calendarNavigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calendarNavigationButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  calendarNavigationText: { fontSize: 13 * fontScale, fontWeight: '600' },
  calendarTitle: { fontSize: 18 * fontScale, fontWeight: '800' },
  calendarContainer: { borderRadius: 16, borderWidth: 1, padding: 12 },
  calendarWeekHeader: { flexDirection: 'row', marginBottom: 8 },
  calendarWeekDay: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  calendarWeekDayText: { fontSize: 12 * fontScale, fontWeight: '700' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: { width: `${100 / 7}%`.replace('%', ''), aspectRatio: 0.85, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)', padding: 4, borderRadius: 6 },
  calendarDayEmpty: { opacity: 0.3 },
  calendarDayActive: { borderWidth: 1.5 },
  calendarDayNumber: { fontSize: 11 * fontScale, fontWeight: '700', marginBottom: 2 },
  calendarDayScroll: { flex: 1 },
  calendarDayScrollContent: { gap: 2 },
  calendarSubscriptionBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  calendarSubscriptionName: { fontSize: 8 * fontScale, fontWeight: '700', color: '#ffffff' },
  calendarSubscriptionPrice: { fontSize: 7 * fontScale, color: '#ffffff', opacity: 0.9 },
  analyticsSection: { gap: 16 },
  analysisToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  analysisToolbarLabel: { fontSize: 13 * fontScale, fontWeight: '600' },
  analysisToolbarHint: { fontSize: 11 * fontScale, marginTop: 2 },
  yearSelectorRow: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  yearSelectorButton: { paddingHorizontal: 10, paddingVertical: 6 },
  yearSelectorText: { fontSize: 12 * fontScale, fontWeight: '700' },
  insightBox: { padding: 16, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  insightIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 14 * fontScale, fontWeight: '800', color: '#ffffff', marginBottom: 2 },
  insightText: { fontSize: 12 * fontScale, color: '#ffffff', opacity: 0.9, lineHeight: 16 },
  panel: { padding: 16, borderRadius: 16, borderWidth: 1 },
  analysisPrimaryPanel: {},
  panelTitle: { fontSize: 16 * fontScale, fontWeight: '700', marginBottom: 2 },
  panelDescription: { fontSize: 12 * fontScale, marginBottom: 12 },
  categoryLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 * fontScale, fontWeight: '500' },
  chartScrollContent: { paddingBottom: 8 },
  chartArea: { flexDirection: 'row', height: 180, alignItems: 'flex-end', gap: 12, paddingHorizontal: 4 },
  chartColumn: { width: 44, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  chartAmount: { fontSize: 9 * fontScale, marginBottom: 4, transform: [{ rotate: '-45deg' }] },
  chartTrack: { width: 28, height: 120, borderRadius: 6, borderWidth: 1, overflow: 'hidden', justifyContent: 'flex-end' },
  chartStack: { width: '100%', flexDirection: 'column' },
  chartSegment: { width: '100%' },
  chartMonthLabel: { fontSize: 11 * fontScale, fontWeight: '600', marginTop: 6 },
  chartFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  chartFooterLabel: { fontSize: 13 * fontScale, fontWeight: '600' },
  chartFooterValue: { fontSize: 15 * fontScale, fontWeight: '800' },
  analysisSectionCard: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  distributionTitle: { fontSize: 15 * fontScale, fontWeight: '700', marginBottom: 4 },
  distributionTitleNoTop: { marginTop: 0 },
  distributionSubtitle: { fontSize: 12 * fontScale, marginBottom: 8 },
  noDataText: { fontSize: 13 * fontScale, fontStyle: 'italic' },
  distributionCard: { padding: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
  distributionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  distributionNameGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distributionColorDot: { width: 10, height: 10, borderRadius: 5 },
  distributionName: { fontSize: 13 * fontScale, fontWeight: '600' },
  distributionAmount: { fontSize: 12 * fontScale, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  drawerBackdrop: { flex: 1 },
  drawerContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, padding: 20, maxHeight: '60%' },
  drawerItemCard: { padding: 12, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  drawerItemTitle: { fontSize: 14 * fontScale, fontWeight: '700', marginBottom: 2 },
  drawerItemSubtitle: { fontSize: 12 * fontScale },
  drawerItemPrice: { fontSize: 15 * fontScale, fontWeight: '800' },
  authWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  authCard: { width: '100%', maxWidth: 400, padding: 24, borderRadius: 20, borderWidth: 1 },
  authHeader: { alignItems: 'center', marginBottom: 20 },
  authLogo: { fontSize: 26 * fontScale, fontWeight: '900', letterSpacing: -0.5 },
  authSubtitle: { fontSize: 12 * fontScale, marginTop: 4 },
  authTitle: { fontSize: 18 * fontScale, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  authErrorText: { color: '#f87171', fontSize: 12 * fontScale, marginTop: 8, textAlign: 'center' },
  authSwitchButton: { marginTop: 16, alignItems: 'center' },
  authSwitchText: { fontSize: 13 * fontScale, fontWeight: '600' }
});

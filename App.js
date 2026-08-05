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
  sage: { label: 'Adaçayı', dark: false, bg: '#dfe8df', sidebarBg: '#cedbce', headerBg: '#eaf1ea', cardBg: '#f5f8f4', inputBg: '#e7eee6', cardBorder: '#afc1ae', textPrimary: '#26352a', textSecondary: '#506353', textMuted: '#748278', summaryBg: '#4f7c5a', summaryBorder: '#6d9977', accent: '#d97706' },
  mint: { label: 'Açık Yeşil', dark: false, bg: '#dff3ea', sidebarBg: '#c9e6d9', headerBg: '#ebf8f2', cardBg: '#f6fcf9', inputBg: '#e3f2eb', cardBorder: '#a8cfbc', textPrimary: '#17392b', textSecondary: '#3f6857', textMuted: '#708d80', summaryBg: '#0f766e', summaryBorder: '#14b8a6', accent: '#ea580c' },
  apricot: { label: 'Kayısı', dark: false, bg: '#f5e3d1', sidebarBg: '#ebd1b8', headerBg: '#faeee3', cardBg: '#fff8f1', inputBg: '#f2e3d5', cardBorder: '#d7bba1', textPrimary: '#3b291d', textSecondary: '#6e5340', textMuted: '#927764', summaryBg: '#d97706', summaryBorder: '#f59e0b', accent: '#0f766e' },
  sand: { label: 'Kum', dark: false, bg: '#eee8dc', sidebarBg: '#e0d7c7', headerBg: '#f5f1e8', cardBg: '#fcfaf5', inputBg: '#ece5d9', cardBorder: '#cbc0ae', textPrimary: '#3a342b', textSecondary: '#665e51', textMuted: '#8a8173', summaryBg: '#8b6f47', summaryBorder: '#a98b60', accent: '#2563eb' },
  lavender: { label: 'Lavanta', dark: false, bg: '#e9e4f4', sidebarBg: '#dcd4eb', headerBg: '#f1edf8', cardBg: '#faf8fd', inputBg: '#e8e2f1', cardBorder: '#c5bad8', textPrimary: '#302740', textSecondary: '#625570', textMuted: '#85768f', summaryBg: '#7c5cbf', summaryBorder: '#9676d4', accent: '#d97706' },
  rose: { label: 'Gül Kurusu', dark: false, bg: '#f1e1e3', sidebarBg: '#e5cfd2', headerBg: '#f8ecee', cardBg: '#fff8f9', inputBg: '#f0dfe2', cardBorder: '#d3b5ba', textPrimary: '#42282e', textSecondary: '#704d55', textMuted: '#93737a', summaryBg: '#be5f73', summaryBorder: '#d17b8d', accent: '#2563eb' },
  light: { label: 'Açık', dark: false, bg: '#edf1f5', sidebarBg: '#ffffff', headerBg: '#ffffff', cardBg: '#ffffff', inputBg: '#f1f4f8', cardBorder: '#d8dee7', textPrimary: '#1f2937', textSecondary: '#566171', textMuted: '#7d8999', summaryBg: '#4f46e5', summaryBorder: '#6366f1', accent: '#2563eb' }
};

const FONT_SCALE_OPTIONS = [
  { key: 'small', label: 'Küçük', scale: 0.9 },
  { key: 'normal', label: 'Normal', scale: 1 },
  { key: 'large', label: 'Büyük', scale: 1.12 },
  { key: 'xlarge', label: 'Çok Büyük', scale: 1.24 }
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

const getSubscriptionCostForMonth = (item, year, monthIndex, rates) => {
  if (!item || item.status === 'cancelled') return 0;
  const priceInTL = convertToTL(item.price, item.currency || 'TRY', rates);
  const billingYear = Number(item.billingYear) || year;
  const billingMonth = Math.max(0, Math.min(11, (Number(item.billingMonth) || 1) - 1));
  const targetMonthKey = year * 12 + monthIndex;
  const billingMonthKey = billingYear * 12 + billingMonth;
  if (targetMonthKey < billingMonthKey) return 0;
  if (item.period === 'monthly') return priceInTL;
  return monthIndex === billingMonth ? priceInTL : 0;
};

// Basit yardımcılar: gradyan grafik ve cam efekti (glassmorphism) için renk üretimi.
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

  /* ------------------------------------------------------------------ */
  /*                         OTURUM (AUTH) STATE                         */
  /* ------------------------------------------------------------------ */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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

  /* ---------------------------- FORM STATE ---------------------------- */
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
  const [formNotificationChannel, setFormNotificationChannel] = useState('email');

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplatePrice, setNewTemplatePrice] = useState('');
  const [newTemplateCurrency, setNewTemplateCurrency] = useState('TRY');
  const [newTemplateCategory, setNewTemplateCategory] = useState('Diğer');

  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [newPaymentMethodName, setNewPaymentMethodName] = useState('');

  /* ------------------------------------------------------------------ */
  /*                         LOCALSTORAGE YÜKLEME                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('cebin_auth_v1');
      if (savedAuth === 'true') setIsLoggedIn(true);

      const savedSubscriptions = localStorage.getItem('cebin_subscriptions_v5');
      if (savedSubscriptions) {
        const parsed = JSON.parse(savedSubscriptions);
        setSubscriptions(Array.isArray(parsed) ? parsed : []);
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

  /* ------------------------------------------------------------------ */
  /*                               OTURUM                                 */
  /* ------------------------------------------------------------------ */
  const handleLogin = () => {
    const trimmedEmail = authEmail.trim();
    if (!trimmedEmail || !authPassword) { setAuthError('Lütfen e-posta ve şifrenizi giriniz.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setAuthError('Lütfen geçerli bir e-posta adresi giriniz.'); return; }
    if (authPassword.length < 4) { setAuthError('Şifre en az 4 karakter olmalıdır.'); return; }
    setAuthError('');
    try {
      localStorage.setItem('cebin_auth_v1', 'true');
      localStorage.setItem('cebin_auth_email_v1', trimmedEmail);
    } catch (e) { console.log(e); }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (!confirmAction('Oturumu kapatmak istediğinize emin misiniz?')) return;
    try { localStorage.setItem('cebin_auth_v1', 'false'); } catch (e) { console.log(e); }
    setIsLoggedIn(false);
    setIsMobileDrawerOpen(false);
  };

  /* ------------------------------------------------------------------ */
  /*                                 TEMA                                 */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*                         ABONELİK FİLTRELEME                          */
  /* ------------------------------------------------------------------ */
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
      if (viewFilter === 'EXPENSIVE') return convertToTL(b.price, b.currency, exchangeRates) - convertToTL(a.price, a.currency, exchangeRates);
      if (viewFilter === 'NAME') return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
      if (viewFilter === 'UPCOMING') return getNextRenewal(a, todayForFiltering) - getNextRenewal(b, todayForFiltering);
      return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
    });

  const selectedViewFilterLabel = VIEW_FILTER_OPTIONS.find(o => o.key === viewFilter)?.label || 'Tüm Abonelikler';

  /* ------------------------------------------------------------------ */
  /*                         ÖZET HESAPLAMALARI                           */
  /* ------------------------------------------------------------------ */
  const monthlyTotalTL = safeList.reduce((total, s) => {
    if (!s || s.status === 'cancelled') return total;
    const priceInTL = convertToTL(s.price, s.currency || 'TRY', exchangeRates);
    return total + (s.period === 'yearly' ? priceInTL / 12 : priceInTL);
  }, 0);

  const dailyAverageTL = monthlyTotalTL / 30;
  const yearlyProjectionTL = monthlyTotalTL * 12;

  // Geçen aya kıyasla değişim rozeti için gerçek takvim ayı bazlı hesap.
  const realNow = new Date();
  const prevMonthDate = new Date(realNow.getFullYear(), realNow.getMonth() - 1, 1);
  const thisRealMonthTotal = safeList.reduce((t, s) => t + getSubscriptionCostForMonth(s, realNow.getFullYear(), realNow.getMonth(), exchangeRates), 0);
  const prevRealMonthTotal = safeList.reduce((t, s) => t + getSubscriptionCostForMonth(s, prevMonthDate.getFullYear(), prevMonthDate.getMonth(), exchangeRates), 0);
  const monthlyChangePercent = prevRealMonthTotal > 0
    ? ((thisRealMonthTotal - prevRealMonthTotal) / prevRealMonthTotal) * 100
    : (thisRealMonthTotal > 0 ? 100 : 0);
  const hasMonthlyChangeData = prevRealMonthTotal > 0 || thisRealMonthTotal > 0;

  /* ------------------------------------------------------------------ */
  /*                         ANALİZ HESAPLAMALARI                         */
  /* ------------------------------------------------------------------ */
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

  // Seçili yıl için kart/hesap bazında ortalama aylık yük.
  // Yıllık abonelikler 12 aya bölünerek gerçek aylık taahhüt etkisi gösterilir.
  const monthlyPaymentMethodStats = safeList.reduce((acc, s) => {
    if (!s || s.status === 'cancelled') return acc;
    const method = s.paymentMethod || 'Nakit / Diğer';
    const startYear = Number(s.billingYear) || selectedAnalysisYear;
    if (startYear > selectedAnalysisYear) return acc;
    const priceInTL = convertToTL(s.price, s.currency || 'TRY', exchangeRates);
    const monthlyCommitment = s.period === 'yearly' ? priceInTL / 12 : priceInTL;
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
    const priceInTL = convertToTL(s.price, s.currency || 'TRY', exchangeRates);
    const monthlyEquivalent = s.period === 'yearly' ? priceInTL / 12 : priceInTL;
    if (!current || monthlyEquivalent > current.monthlyEquivalent) return { item: s, monthlyEquivalent };
    return current;
  }, null);

  const insightText = sortedMonthlyCategoryEntries.length === 0
    ? 'Henüz analiz oluşturmak için yeterli abonelik verisi bulunmuyor.'
    : `${selectedAnalysisYear} döneminde aylık bütçede en yüksek pay ${topCategoryLabel} kategorisinde: ${formatShortCurrency(topCategoryAmount, 'TRY')} (%${topCategoryPercent}).${mostExpensiveSubscription ? ` En yüksek aylık abonelik etkisi ${mostExpensiveSubscription.item.name} kaydından geliyor.` : ''}`;

  const todayForRenewals = new Date();
  const upcomingRenewals = safeList
    .filter(s => s.status !== 'cancelled')
    .map(s => {
      const nextDate = getNextRenewal(s, todayForRenewals);
      const todayStart = new Date(todayForRenewals.getFullYear(), todayForRenewals.getMonth(), todayForRenewals.getDate());
      const daysUntil = Math.round((nextDate - todayStart) / 86400000);
      return { item: s, nextDate, daysUntil };
    })
    .filter(r => r.daysUntil >= 0 && r.daysUntil <= 14)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  /* ------------------------------------------------------------------ */
  /*                    ABONELİK FORMUNU AÇMA/KAPATMA                     */
  /* ------------------------------------------------------------------ */
  const openSubscriptionForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');
      setFormPrice(String(item.price || ''));
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
      setFormNotificationChannel(item.notificationChannel || 'email');
    } else {
      setEditingId(null);
      setFormName(''); setFormPrice(''); setFormCurrency('TRY');
      setFormDay('1'); setFormMonth(String(currentDate.getMonth() + 1)); setFormYear(String(clampedYear));
      setFormCategory('Eğlence');
      setFormPaymentMethod(safePaymentMethods[0] || DEFAULT_PAYMENT_METHODS[0]);
      setFormPeriod('monthly'); setFormCancelUrl(''); setFormColor('#6366f1');
      setFormNotificationDays(2); setFormNotificationChannel('email');
    }
    setFormStep(1);
    setShowTemplateForm(false);
    setShowPaymentMethodForm(false);
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionForm = () => {
    setIsSubscriptionModalOpen(false);
    setEditingId(null);
    setFormStep(1);
    setShowTemplateForm(false);
    setShowPaymentMethodForm(false);
  };

  const goToStepTwo = () => {
    if (!formName.trim()) { alert('Lütfen abonelik veya gider adını giriniz.'); return; }
    const numericPrice = Number(String(formPrice).replace(',', '.'));
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { alert('Lütfen sıfırdan büyük geçerli bir tutar giriniz.'); return; }
    setFormStep(2);
  };

  /* ------------------------------------------------------------------ */
  /*                         ABONELİK KAYDETME                            */
  /* ------------------------------------------------------------------ */
  const handleSaveSubscription = () => {
    const preservedScrollPosition = mainScrollPositionRef.current;
    const normalizedPrice = String(formPrice).replace(',', '.');
    const numericPrice = Number(normalizedPrice);
    const numericDay = Number(formDay);
    const numericMonth = Number(formMonth);
    const numericYear = Number(formYear);

    if (!formName.trim()) { alert('Lütfen abonelik veya gider adını giriniz.'); return; }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) { alert('Lütfen sıfırdan büyük geçerli bir tutar giriniz.'); return; }
    if (!Number.isInteger(numericMonth) || numericMonth < 1 || numericMonth > 12) { alert('Ay değeri 1 ile 12 arasında olmalıdır.'); return; }
    if (!YEARS.includes(numericYear)) { alert('Lütfen geçerli bir yıl seçiniz.'); return; }

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
      name: formName.trim(),
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
      notificationChannel: formNotificationChannel,
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

  // "Ödendi İşaretle" — geçerli fatura döngüsü için yerel bir işaret. Gerçek ödeme
  // tahsilatı yapmaz, sadece kullanıcının takibini kolaylaştıran bir hatırlatıcıdır.
  const togglePaid = subscription => {
    const cycleKey = getCycleKey(subscription, todayForFiltering);
    const isPaid = subscription.paidCycleKey === cycleKey;
    setSubscriptions(safeList.map(s => (s.id === subscription.id ? { ...s, paidCycleKey: isPaid ? null : cycleKey } : s)));
  };

  /* ------------------------------------------------------------------ */
  /*                               ŞABLONLAR                               */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*                           ÖDEME YÖNTEMLERİ                           */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*                        CSV VE JSON İŞLEMLERİ                          */
  /* ------------------------------------------------------------------ */
  const handleExportCSV = () => {
    if (safeList.length === 0) { alert('Dışa aktarılacak kayıt bulunmuyor.'); return; }
    let csvContent = '\uFEFFServis Adi;Fiyat;Para Birimi;Kategori;Odeme Yontemi;Periyot;Odeme Gunu;Odeme Ayi;Odeme Yili\n';
    safeList.forEach(s => {
      csvContent += `"${s.name}";${s.price};"${s.currency}";"${s.category}";"${s.paymentMethod}";"${s.period}";${s.billingDay};${s.billingMonth};${s.billingYear}\n`;
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

        setSubscriptions(importedSubscriptions);
        if (Array.isArray(parsedBackup.templates)) setTemplatesList(parsedBackup.templates);
        if (Array.isArray(parsedBackup.paymentMethods)) setPaymentMethodsList(parsedBackup.paymentMethods);
        if (parsedBackup.exchangeRates) {
          setExchangeRates({ USD: Number(parsedBackup.exchangeRates.USD) || DEFAULT_RATES.USD, EUR: Number(parsedBackup.exchangeRates.EUR) || DEFAULT_RATES.EUR });
        }
        const importedAppearance = parsedBackup.appearance;
        if (importedAppearance && BACKGROUND_PRESETS[importedAppearance.backgroundPreset]) setBackgroundPreset(importedAppearance.backgroundPreset);
        if (importedAppearance && FONT_SCALE_OPTIONS.some(o => o.key === importedAppearance.fontScaleKey)) setFontScaleKey(importedAppearance.fontScaleKey);

        alert('Yedek başarıyla geri yüklendi.');
      } catch (error) {
        alert(`Yedek yüklenemedi: ${error.message}`);
      }
    };
    fileInput.click();
  };

  /* ------------------------------------------------------------------ */
  /*                      TAKVİM VE GENEL YARDIMCILAR                     */
  /* ------------------------------------------------------------------ */
  const daysInCurrentMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDayOffset = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;

  const handleAnalysisYearChange = year => { scrollMainToTop(false); setSelectedAnalysisYear(year); };
  const handleTabChange = tabKey => { scrollMainToTop(false); setActiveTab(tabKey); setIsMobileDrawerOpen(false); };

  const openDayDrawer = (dayNumber, itemsForDay) => {
    setDayDrawer({ visible: true, day: dayNumber, month: calendarMonth, year: calendarYear, items: itemsForDay });
  };

  /* ------------------------------------------------------------------ */
  /*                          GİRİŞ / KAYIT EKRANI                        */
  /* ------------------------------------------------------------------ */
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <View style={styles.authWrapper}>
          <View style={[styles.authCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.82) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.authHeader}>
              <Text style={[styles.authLogo, { color: theme.textPrimary }]}>Cebin <Text style={{ color: '#9b98ff' }}>PRO</Text></Text>
              <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik & Bütçe Asistanı</Text>
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

  /* ------------------------------------------------------------------ */
  /*                                EKRAN                                  */
  /* ------------------------------------------------------------------ */
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={[styles.appWrapper, isDesktop && styles.appWrapperDesktop]}>
        {isDesktop && (
          <View style={[styles.sidebarContainer, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.sidebarBg, 0.82) : theme.sidebarBg, borderRightColor: theme.cardBorder }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
              <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
            </View>

            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik & Bütçe Asistanı</Text>

            <View style={styles.sidebarNavGroup}>
              {[
                { key: 'list', icon: '💳', label: 'Abonelikler' },
                { key: 'calendar', icon: '📅', label: 'Takvim' },
                { key: 'analytics', icon: '📊', label: 'Analiz ve Raporlar' }
              ].map(navItem => (
                <TouchableOpacity key={navItem.key} style={[styles.sidebarNavButton, activeTab === navItem.key && styles.sidebarNavButtonActive]} onPress={() => handleTabChange(navItem.key)}>
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
              <TouchableOpacity style={styles.primaryButton} onPress={() => openSubscriptionForm()}>
                <Text style={styles.primaryButtonText}>+ Yeni Abonelik Ekle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: 'rgba(248,113,113,0.12)', borderColor: theme.danger }]} onPress={handleLogout}>
                <Text style={[styles.secondaryButtonText, { color: theme.danger }]}>🚪 Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.contentWrapper}>
          <View style={[styles.header, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.headerBg, 0.75) : theme.headerBg, borderBottomColor: theme.cardBorder }]}>
            {isMobile && (
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, marginRight: 8 }]} onPress={() => setIsMobileDrawerOpen(true)}>
                <Text style={styles.iconButtonText}>☰</Text>
              </TouchableOpacity>
            )}

            <View style={styles.pageHeaderInfo}>
              <Text style={[styles.pageHeaderTitle, { color: theme.textPrimary }]}>
                {activeTab === 'list' ? 'Abonelikler' : activeTab === 'calendar' ? 'Ödeme Takvimi' : 'Analiz ve Raporlar'}
              </Text>
              <Text style={[styles.pageHeaderDescription, { color: theme.textSecondary }]}>
                {activeTab === 'list' ? 'Aboneliklerinizi ve Düzenli Ödemelerinizi Yönetin.' : activeTab === 'calendar' ? 'Yaklaşan Ödeme Tarihlerini Takvim Üzerinden Takip Edin.' : 'Aylık Harcama Eğilimlerinizi ve Bütçe Yükünüzü İnceleyin.'}
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
                          {monthlyChangePercent <= 0 ? '↓' : '↑'} %{Math.abs(monthlyChangePercent).toFixed(1)} geçen aya göre
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
                  placeholder="Abonelik, kategori veya ödeme yöntemi ara..."
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
                    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Kayıt bulunamadı</Text>
                    <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>Arama metnini veya görünüm filtresini değiştiriniz.</Text>
                    <TouchableOpacity style={[styles.primaryButton, { marginTop: 14 }]} onPress={() => openSubscriptionForm()}>
                      <Text style={styles.primaryButtonText}>+ Abonelik Ekle</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  filteredSubscriptions.map(subscription => {
                    const priceInTL = convertToTL(subscription.price, subscription.currency || 'TRY', exchangeRates);
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
                            </View>

                            <Text style={[styles.subscriptionSubtitle, { color: theme.textSecondary }]}>
                              {subscription.category} • {isYearly ? `${subscription.billingDay}/${subscription.billingMonth}/${subscription.billingYear}` : `Her ayın ${subscription.billingDay}. günü`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.subscriptionRight}>
                          <Text style={[styles.subscriptionPrice, { color: theme.textPrimary }]}>{formatCurrency(subscription.price, subscription.currency || 'TRY')} {isYearly ? '/yıl' : '/ay'}</Text>
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

                <View style={styles.calendarYearSelectorRow}>
                  <Text style={[styles.calendarYearSelectorLabel, { color: theme.textMuted }]}>Takvim Yılı</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.calendarYearSelectButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                    onPress={() => setIsCalendarYearPickerOpen(true)}
                  >
                    <Text style={[styles.calendarYearSelectValue, { color: theme.textPrimary }]}>{calendarYear}</Text>
                    <Text style={[styles.yearSelectChevron, { color: theme.accent }]}>⌄</Text>
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
                              return (
                                <View key={subscription.id} style={[styles.calendarSubscriptionBadge, { backgroundColor: badgeColor }]}>
                                  <Text style={styles.calendarSubscriptionName} numberOfLines={1}>{subscription.name}</Text>
                                  <Text style={styles.calendarSubscriptionPrice}>{formatShortCurrency(convertToTL(subscription.price, subscription.currency, exchangeRates), 'TRY')}</Text>
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
                <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>Analiz ve Raporlar</Text>
                <Text style={[styles.pageDescription, { color: theme.textSecondary }]}>Aylık Harcama Dağılımlarını ve Bütçe Yükünü İnceleyin</Text>

                <View style={styles.analysisToolbar}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.analysisToolbarLabel, { color: theme.textMuted }]}>Raporlama Dönemi</Text>
                    <Text style={[styles.analysisToolbarHint, { color: theme.textSecondary }]}>Grafikler ve Dağılımlar Seçilen Yıla Göre Güncellenir.</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.yearSelectButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                    onPress={() => setIsAnalysisYearPickerOpen(true)}
                  >
                    <View>
                      <Text style={[styles.yearSelectCaption, { color: theme.textMuted }]}>Yıl</Text>
                      <Text style={[styles.yearSelectValue, { color: theme.textPrimary }]}>{selectedAnalysisYear}</Text>
                    </View>
                    <Text style={[styles.yearSelectChevron, { color: theme.accent }]}>⌄</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.insightBox, { backgroundColor: theme.summaryBg, borderColor: theme.summaryBorder, ...(Platform.OS === 'web' ? { backgroundImage: `linear-gradient(135deg, ${theme.summaryBg}, ${theme.activeButton})` } : {}) }]}>
                  <View style={styles.insightIconBox}><Text style={{ fontSize: 20 }}>✨</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.insightTitle}>Akıllı Asistan Özeti</Text>
                    <Text style={styles.insightText}>{insightText}</Text>
                  </View>
                </View>

                <View style={styles.analyticsSummaryRow}>
                  <View style={[styles.analyticsSummaryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.analyticsSummaryLabel, { color: theme.textSecondary }]}>Aylık Ortalama</Text>
                    <Text style={[styles.analyticsSummaryValue, { color: theme.textPrimary }]}>{formatShortCurrency(averageMonthlyExpense, 'TRY')}</Text>
                  </View>
                  <View style={[styles.analyticsSummaryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.analyticsSummaryLabel, { color: theme.textSecondary }]}>Aylık Kart Yükü</Text>
                    <Text style={[styles.analyticsSummaryValue, { color: theme.textPrimary }]}>{formatShortCurrency(totalMonthlyPaymentCommitment, 'TRY')}</Text>
                  </View>
                  <View style={[styles.analyticsSummaryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.analyticsSummaryLabel, { color: theme.textSecondary }]}>Öne Çıkan Kategori</Text>
                    <Text style={[styles.analyticsSummaryValue, { color: theme.textPrimary }]} numberOfLines={1}>{topCategoryLabel}</Text>
                  </View>
                </View>

                {upcomingRenewals.length > 0 && (
                  <View style={[styles.panel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>⏰ Yaklaşan Yenilemeler (14 gün)</Text>
                    {upcomingRenewals.map(renewal => {
                      const renewalColor = renewal.item.color || CATEGORY_COLORS[renewal.item.category] || CATEGORY_COLORS.Diğer;
                      return (
                        <View key={renewal.item.id} style={[styles.renewalRow, { borderBottomColor: theme.cardBorder }]}>
                          <View style={[styles.renewalDot, { backgroundColor: renewalColor }]} />
                          <Text style={[styles.renewalName, { color: theme.textPrimary }]}>{renewal.item.name}</Text>
                          <Text style={[styles.renewalDateText, { color: renewal.daysUntil <= 2 ? theme.danger : theme.textSecondary }]}>
                            {renewal.daysUntil === 0 ? 'Bugün' : renewal.daysUntil === 1 ? 'Yarın' : `${renewal.daysUntil} gün sonra`}
                          </Text>
                          <Text style={[styles.renewalAmount, { color: theme.textPrimary }]}>{formatCurrency(renewal.item.price, renewal.item.currency)}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                <View style={[styles.panel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>{selectedAnalysisYear} Aylık Harcama Grafiği</Text>
                  <Text style={[styles.panelDescription, { color: theme.textMuted }]}>Aylık Harcamalar Kategori Renkleriyle Gösterilir.</Text>

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
                                          backgroundColor: segment.color,
                                          ...(Platform.OS === 'web' ? { backgroundImage: `linear-gradient(180deg, ${lightenHex(segment.color, 22)} 0%, ${segment.color} 100%)` } : {})
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

                <View style={styles.distributionSectionHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.distributionTitle, styles.distributionTitleNoTop, { color: theme.textPrimary }]}>Ödeme Yöntemine Göre Aylık Yük</Text>
                    <Text style={[styles.distributionSubtitle, { color: theme.textMuted }]}>Kart ve Hesap Bazında Aylık Ödeme Tutarları.</Text>
                  </View>
                  <View style={[styles.monthlyCommitmentBadge, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                    <Text style={[styles.monthlyCommitmentBadgeLabel, { color: theme.textMuted }]}>Toplam / Ay</Text>
                    <Text style={[styles.monthlyCommitmentBadgeValue, { color: theme.textPrimary }]}>{formatCurrency(totalMonthlyPaymentCommitment, 'TRY')}</Text>
                  </View>
                </View>

                {sortedMonthlyPaymentMethodEntries.length === 0 ? (
                  <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={styles.emptyIcon}>💳</Text>
                    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Aylık Ödeme Yükü Bulunamadı</Text>
                    <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>Aktif Bir Abonelik Eklediğinizde Aylık Dağılım Burada Görünür.</Text>
                  </View>
                ) : (
                  <View style={styles.monthlyPaymentGrid}>
                    {sortedMonthlyPaymentMethodEntries.map(([paymentMethod, amount]) => {
                      const percentage = totalMonthlyPaymentCommitment > 0 ? (amount / totalMonthlyPaymentCommitment) * 100 : 0;
                      return (
                        <View key={`monthly-${paymentMethod}`} style={[styles.monthlyPaymentCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                          <View style={[styles.monthlyPaymentIcon, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                            <Text style={styles.monthlyPaymentIconText}>💳</Text>
                          </View>
                          <View style={styles.monthlyPaymentContent}>
                            <Text style={[styles.monthlyPaymentName, { color: theme.textPrimary }]} numberOfLines={1}>{paymentMethod}</Text>
                            <Text style={[styles.monthlyPaymentMeta, { color: theme.textMuted }]}>Aylık Bütçeye Oranı: %{percentage.toFixed(1)}</Text>
                            <View style={[styles.progressTrack, { backgroundColor: theme.inputBg, marginTop: 8 }]}>
                              <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: theme.accent }]} />
                            </View>
                          </View>
                          <Text style={[styles.monthlyPaymentAmount, { color: theme.textPrimary }]}>{formatCurrency(amount, 'TRY')}<Text style={[styles.monthlyPaymentPeriod, { color: theme.textMuted }]}> / ay</Text></Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                <Text style={[styles.distributionTitle, { color: theme.textPrimary }]}>📂 Kategori Bazlı Dağılım</Text>
                {sortedMonthlyCategoryEntries.length === 0 ? (
                  <Text style={[styles.noDataText, { color: theme.textSecondary }]}>Seçilen Yıl İçin Aylık Kategori Verisi Bulunamadı.</Text>
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
            )}
          </ScrollView>

          {!isDesktop && (
            <View style={[styles.bottomNavigation, { backgroundColor: theme.headerBg, borderTopColor: theme.cardBorder }]}>
              {[
                { key: 'list', icon: '💳', label: 'Abonelikler' },
                { key: 'calendar', icon: '📅', label: 'Takvim' },
                { key: 'analytics', icon: '📊', label: 'Analiz' }
              ].map(navItem => (
                <TouchableOpacity key={navItem.key} style={styles.bottomNavigationItem} onPress={() => handleTabChange(navItem.key)}>
                  <Text style={styles.bottomNavigationIcon}>{navItem.icon}</Text>
                  <Text style={[styles.bottomNavigationText, { color: activeTab === navItem.key ? '#9b98ff' : theme.textSecondary }]}>{navItem.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* MOBİL SIDEBAR DRAWER */}
      {!isDesktop && (
        <Modal visible={isMobileDrawerOpen} transparent animationType="fade" onRequestClose={() => setIsMobileDrawerOpen(false)}>
          <View style={styles.drawerOverlay}>
            <View style={[styles.mobileSidebarPanel, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.sidebarBg, 0.92) : theme.sidebarBg, borderColor: theme.cardBorder }]}>
              <View style={styles.sidebarHeader}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin</Text>
                <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
              </View>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik & Bütçe Asistanı</Text>

              <View style={styles.sidebarNavGroup}>
                {[
                  { key: 'list', icon: '💳', label: 'Abonelikler' },
                  { key: 'calendar', icon: '📅', label: 'Takvim' },
                  { key: 'analytics', icon: '📊', label: 'Analiz ve Raporlar' }
                ].map(navItem => (
                  <TouchableOpacity key={navItem.key} style={[styles.sidebarNavButton, activeTab === navItem.key && styles.sidebarNavButtonActive]} onPress={() => handleTabChange(navItem.key)}>
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
                <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: 'rgba(248,113,113,0.12)', borderColor: theme.danger }]} onPress={handleLogout}>
                  <Text style={[styles.secondaryButtonText, { color: theme.danger }]}>🚪 Çıkış Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.drawerBackdrop} activeOpacity={1} onPress={() => setIsMobileDrawerOpen(false)} />
          </View>
        </Modal>
      )}

      {/* GÜN DETAY ÇEKMECESİ (TAKVİM) */}
      <Modal visible={dayDrawer.visible} transparent animationType="slide" onRequestClose={() => setDayDrawer(d => ({ ...d, visible: false }))}>
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerBackdrop} activeOpacity={1} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))} />
          <View style={[styles.dayDrawerPanel, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.94) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{dayDrawer.day} {dayDrawer.month !== null ? MONTH_NAMES[dayDrawer.month] : ''} {dayDrawer.year}</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Bu Güne Ait Ödemeler</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setDayDrawer(d => ({ ...d, visible: false }))}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
              {(dayDrawer.items || []).length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, marginTop: 6 }]}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Bu Gün İçin Ödeme Yok</Text>
                </View>
              ) : (dayDrawer.items || []).map(sub => (
                <View key={sub.id} style={[styles.subscriptionCard, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, marginBottom: 10 }]}>
                  <View style={styles.subscriptionMain}>
                    <View style={[styles.serviceIcon, { backgroundColor: sub.color || getServiceColor(sub.name, safeTemplates) }]}>
                      <Text style={styles.serviceIconText}>{sub.name?.charAt(0)?.toUpperCase() || 'C'}</Text>
                    </View>
                    <View style={styles.subscriptionInfo}>
                      <Text style={[styles.subscriptionName, { color: theme.textPrimary }]}>{sub.name}</Text>
                      <Text style={[styles.subscriptionSubtitle, { color: theme.textSecondary }]}>{sub.category} • {sub.paymentMethod}</Text>
                    </View>
                  </View>
                  <Text style={[styles.subscriptionPrice, { color: theme.textPrimary }]}>{formatCurrency(sub.price, sub.currency)}</Text>
                </View>
              ))}
            </ScrollView>

            {(dayDrawer.items || []).length > 0 && (
              <View style={[styles.chartFooter, { borderTopColor: theme.cardBorder, marginHorizontal: 20, marginBottom: 18 }]}>
                <Text style={[styles.chartFooterLabel, { color: theme.textPrimary }]}>Toplam</Text>
                <Text style={[styles.chartFooterValue, { color: theme.accent }]}>
                  {formatCurrency((dayDrawer.items || []).reduce((t, s) => t + convertToTL(s.price, s.currency, exchangeRates), 0), 'TRY')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* TAKVİM YILI SEÇİCİ */}
      <Modal visible={isCalendarYearPickerOpen} transparent animationType="fade" onRequestClose={() => setIsCalendarYearPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.yearPickerBackdrop} activeOpacity={1} onPress={() => setIsCalendarYearPickerOpen(false)} />
          <View style={[styles.yearPickerCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.96) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.yearPickerHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Takvim Yılı</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Ödeme Takviminde Görüntülenecek Yılı Seçin.</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setIsCalendarYearPickerOpen(false)}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.yearPickerGrid}>
              {YEARS.map(year => {
                const isSelected = calendarYear === year;
                return (
                  <TouchableOpacity
                    key={`calendar-picker-${year}`}
                    style={[styles.yearPickerOption, { backgroundColor: isSelected ? theme.activeButton : theme.inputBg, borderColor: isSelected ? theme.activeButtonBorder : theme.cardBorder }]}
                    onPress={() => { setCalendarYear(year); setIsCalendarYearPickerOpen(false); }}
                  >
                    <Text style={[styles.yearPickerOptionText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>{year}</Text>
                    {isSelected && <Text style={styles.yearPickerCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* ANALİZ YILI SEÇİCİ */}
      <Modal visible={isAnalysisYearPickerOpen} transparent animationType="fade" onRequestClose={() => setIsAnalysisYearPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.yearPickerBackdrop} activeOpacity={1} onPress={() => setIsAnalysisYearPickerOpen(false)} />
          <View style={[styles.yearPickerCard, styles.glassSurface, { backgroundColor: Platform.OS === 'web' ? hexToRgba(theme.cardBg, 0.96) : theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.yearPickerHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Raporlama Yılı</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Finansal Analizlerin Gösterileceği Yılı Seçin.</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setIsAnalysisYearPickerOpen(false)}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.yearPickerGrid}>
              {YEARS.map(year => {
                const isSelected = selectedAnalysisYear === year;
                return (
                  <TouchableOpacity
                    key={`picker-${year}`}
                    style={[styles.yearPickerOption, { backgroundColor: isSelected ? theme.activeButton : theme.inputBg, borderColor: isSelected ? theme.activeButtonBorder : theme.cardBorder }]}
                    onPress={() => { handleAnalysisYearChange(year); setIsAnalysisYearPickerOpen(false); }}
                  >
                    <Text style={[styles.yearPickerOptionText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>{year}</Text>
                    {isSelected && <Text style={styles.yearPickerCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* GÖRÜNÜM AYARLARI MODALI */}
      <Modal visible={isAppearanceModalOpen} transparent animationType="fade" onRequestClose={() => setIsAppearanceModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.appearanceModal, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Görünüm Ayarları</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Arka Plan Temasını ve Yazı Boyutunu Kişiselleştirin.</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setIsAppearanceModalOpen(false)}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 8 }}>
              <Text style={[styles.appearanceSectionTitle, { color: theme.textPrimary }]}>Arka Plan Teması</Text>
              <View style={styles.appearanceOptionGrid}>
                {Object.entries(BACKGROUND_PRESETS).map(([presetKey, preset]) => (
                  <TouchableOpacity key={presetKey} style={[styles.appearanceThemeOption, { backgroundColor: preset.cardBg, borderColor: backgroundPreset === presetKey ? theme.activeButtonBorder : preset.cardBorder }, backgroundPreset === presetKey && styles.appearanceOptionActive]} onPress={() => setBackgroundPreset(presetKey)}>
                    <View style={[styles.themePreview, { backgroundColor: preset.bg }]}>
                      <View style={[styles.themePreviewSidebar, { backgroundColor: preset.sidebarBg }]} />
                      <View style={styles.themePreviewContent}>
                        <View style={[styles.themePreviewHeader, { backgroundColor: preset.headerBg }]} />
                        <View style={[styles.themePreviewCard, { backgroundColor: preset.summaryBg }]} />
                      </View>
                    </View>
                    <Text style={[styles.appearanceOptionLabel, { color: preset.textPrimary }]}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.appearanceSectionTitle, { color: theme.textPrimary }]}>Yazı Boyutu</Text>
              <View style={styles.fontScaleRow}>
                {FONT_SCALE_OPTIONS.map(option => (
                  <TouchableOpacity key={option.key} style={[styles.fontScaleOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, fontScaleKey === option.key && styles.fontScaleOptionActive]} onPress={() => setFontScaleKey(option.key)}>
                    <Text style={[styles.fontScaleOptionText, { color: theme.textSecondary, fontSize: 12 * option.scale }, fontScaleKey === option.key && styles.fontScaleOptionTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsAppearanceModalOpen(false)}>
              <Text style={styles.primaryButtonText}>Ayarları Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* YENİ / DÜZENLE ABONELİK MODALI — 2 ADIMLI SİHİRBAZ */}
      <Modal visible={isSubscriptionModalOpen} transparent animationType="fade" onRequestClose={closeSubscriptionForm}>
        <View style={styles.modalOverlay}>
          <View style={[styles.subscriptionModal, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{editingId ? 'Abonelik Düzenle' : 'Yeni Abonelik Ekle'}</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>Abonelik veya Sabit Gider Bilgilerini Girin.</Text>

                <View style={styles.stepIndicatorRow}>
                  {[1, 2].map(step => (
                    <View key={step} style={[styles.stepDot, { backgroundColor: step <= formStep ? theme.activeButton : theme.inputBg, borderColor: theme.cardBorder }]} />
                  ))}
                  <Text style={[styles.stepIndicatorText, { color: theme.textMuted }]}>Adım {formStep} / 2 — {formStep === 1 ? 'Servis & Tutar' : 'Ödeme & Hatırlatıcı'}</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={closeSubscriptionForm}>
                <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.subscriptionModalScroll} contentContainerStyle={styles.subscriptionModalContent} showsVerticalScrollIndicator>
              {formStep === 1 && (
                <>
                  {!editingId && (
                    <View style={styles.formSection}>
                      <View style={styles.formSectionHeader}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Hızlı Şablon Seç</Text>
                          <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Hazır Bir Servis Seçerek Alanları Otomatik Doldurun.</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowTemplateForm(!showTemplateForm)}>
                          <Text style={[styles.formSectionAction, { color: theme.accent }]}>{showTemplateForm ? 'Kapat' : '+ Şablon Ekle'}</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.removableOptionRow}>
                        {safeTemplates.map((template, index) => (
                          <View key={`${template.name}-${index}`} style={styles.removableOptionWrapper}>
                            <TouchableOpacity style={[styles.templateOption, { backgroundColor: template.color }]} onPress={() => {
                              setFormName(template.name);
                              setFormPrice(template.price);
                              setFormCurrency(template.currency);
                              setFormCategory(template.category);
                              setFormColor(template.color);
                            }}>
                              <Text style={styles.templateOptionText} numberOfLines={1}>{template.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeOptionButton} onPress={() => removeTemplate(index)}>
                              <Text style={styles.removeOptionText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>

                      {showTemplateForm && (
                        <View style={[styles.inlineForm, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                          <TextInput style={[styles.textInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Şablon adı" placeholderTextColor={theme.textMuted} value={newTemplateName} onChangeText={setNewTemplateName} />
                          <View style={styles.inlineInputRow}>
                            <TextInput style={[styles.textInput, styles.flexInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Fiyat" placeholderTextColor={theme.textMuted} keyboardType="decimal-pad" value={newTemplatePrice} onChangeText={setNewTemplatePrice} />
                            <View style={styles.currencyOptionRow}>
                              {['TRY', 'USD', 'EUR'].map(currency => (
                                <TouchableOpacity key={currency} style={[styles.compactOptionButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, newTemplateCurrency === currency && styles.compactOptionButtonActive]} onPress={() => setNewTemplateCurrency(currency)}>
                                  <Text style={[styles.compactOptionText, { color: theme.textSecondary }, newTemplateCurrency === currency && styles.compactOptionTextActive]}>{currency}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                          <View style={styles.wrappedOptionRow}>
                            {Object.keys(CATEGORY_COLORS).map(category => (
                              <TouchableOpacity key={category} style={[styles.compactOptionButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, newTemplateCategory === category && styles.compactOptionButtonActive]} onPress={() => setNewTemplateCategory(category)}>
                                <Text style={[styles.compactOptionText, { color: theme.textSecondary }, newTemplateCategory === category && styles.compactOptionTextActive]}>{category}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                          <TouchableOpacity style={[styles.primaryButton, styles.inlineSaveButton]} onPress={addTemplate}>
                            <Text style={styles.primaryButtonText}>Şablonu Kaydet</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Temel Bilgiler</Text>

                    <View style={[styles.twoColumnRow, isMobile && styles.singleColumnRow]}>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Servis / Abonelik Adı</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Örn: Netflix, Ev Kirası" placeholderTextColor={theme.textMuted} value={formName} onChangeText={setFormName} />
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Tutar / Fiyat</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="0,00" placeholderTextColor={theme.textMuted} keyboardType="decimal-pad" value={formPrice} onChangeText={setFormPrice} />
                      </View>
                    </View>

                    <View style={[styles.twoColumnRow, isMobile && styles.singleColumnRow]}>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Para Birimi</Text>
                        <View style={styles.currencyOptionRow}>
                          {['TRY', 'USD', 'EUR'].map(currency => (
                            <TouchableOpacity key={currency} style={[styles.compactOptionButton, styles.flexOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formCurrency === currency && styles.compactOptionButtonActive]} onPress={() => setFormCurrency(currency)}>
                              <Text style={[styles.compactOptionText, { color: theme.textSecondary }, formCurrency === currency && styles.compactOptionTextActive]}>{currency}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      <View style={styles.formColumn}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Ödeme Periyodu</Text>
                        <View style={styles.periodOptionRow}>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPeriod === 'monthly' && styles.periodOptionActive]} onPress={() => setFormPeriod('monthly')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formPeriod === 'monthly' && styles.periodOptionTextActive]}>Aylık</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPeriod === 'yearly' && styles.periodOptionActive]} onPress={() => setFormPeriod('yearly')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formPeriod === 'yearly' && styles.periodOptionTextActive]}>Yıllık</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}

              {formStep === 2 && (
                <>
                  <View style={styles.formSection}>
                    <View style={styles.formSectionHeader}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Ödeme Yapılan Kart / Hesap</Text>
                        <Text style={[styles.formSectionDescription, { color: theme.textMuted }]}>Aboneliğin Tahsil Edildiği Yöntemi Seçin.</Text>
                      </View>
                      <TouchableOpacity onPress={() => setShowPaymentMethodForm(!showPaymentMethodForm)}>
                        <Text style={[styles.formSectionAction, { color: theme.accent }]}>{showPaymentMethodForm ? 'Kapat' : '+ Yöntem Ekle'}</Text>
                      </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.removableOptionRow}>
                      {safePaymentMethods.map(paymentMethod => (
                        <View key={paymentMethod} style={styles.removableOptionWrapper}>
                          <TouchableOpacity style={[styles.paymentMethodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formPaymentMethod === paymentMethod && styles.paymentMethodOptionActive]} onPress={() => setFormPaymentMethod(paymentMethod)}>
                            <Text style={[styles.paymentMethodOptionText, { color: formPaymentMethod === paymentMethod ? '#ffffff' : theme.textSecondary }]} numberOfLines={1}>{paymentMethod}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.removeOptionButton} onPress={() => removePaymentMethod(paymentMethod)}>
                            <Text style={styles.removeOptionText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>

                    {showPaymentMethodForm && (
                      <View style={[styles.inlineForm, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.inlineInputRow}>
                          <TextInput style={[styles.textInput, styles.flexInput, { backgroundColor: theme.cardBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="Örn: Akbank Axess" placeholderTextColor={theme.textMuted} value={newPaymentMethodName} onChangeText={setNewPaymentMethodName} />
                          <TouchableOpacity style={[styles.primaryButton, styles.inlineAddButton]} onPress={addPaymentMethod}>
                            <Text style={styles.primaryButtonText}>Ekle</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Kategori</Text>
                    <View style={styles.wrappedOptionRow}>
                      {Object.keys(CATEGORY_COLORS).map(category => (
                        <TouchableOpacity key={category} style={[styles.categoryOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formCategory === category && { backgroundColor: CATEGORY_COLORS[category], borderColor: CATEGORY_COLORS[category] }]} onPress={() => setFormCategory(category)}>
                          <Text style={[styles.categoryOptionText, { color: formCategory === category ? '#ffffff' : theme.textSecondary }]}>{category}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Ödeme Tarihi</Text>
                    <View style={styles.dateInputRow}>
                      <View style={styles.dateInputField}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Gün</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="1" placeholderTextColor={theme.textMuted} keyboardType="number-pad" value={formDay} onChangeText={setFormDay} />
                      </View>
                      <View style={styles.dateInputField}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Ay</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="1" placeholderTextColor={theme.textMuted} keyboardType="number-pad" value={formMonth} onChangeText={setFormMonth} />
                      </View>
                      <View style={[styles.dateInputField, styles.dateInputYearField]}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Yıl</Text>
                        <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="2026" placeholderTextColor={theme.textMuted} keyboardType="number-pad" value={formYear} onChangeText={setFormYear} />
                      </View>
                    </View>
                    <Text style={[styles.helperText, { color: theme.textMuted }]}>Aylık ödemelerde başlangıç ayı, yıllık ödemelerde tahsilat ayı olarak kullanılır.</Text>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Hatırlatıcı Kuralı</Text>
                    <View style={styles.wrappedOptionRow}>
                      {NOTIFICATION_OPTIONS.map(option => (
                        <TouchableOpacity key={option.value} style={[styles.compactOptionButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationDays === option.value && styles.compactOptionButtonActive]} onPress={() => setFormNotificationDays(option.value)}>
                          <Text style={[styles.compactOptionText, { color: theme.textSecondary }, formNotificationDays === option.value && styles.compactOptionTextActive]}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {formNotificationDays !== -1 && (
                      <View style={{ marginTop: 12 }}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Bildirim Kanalı</Text>
                        <View style={styles.periodOptionRow}>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationChannel === 'email' && styles.periodOptionActive]} onPress={() => setFormNotificationChannel('email')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formNotificationChannel === 'email' && styles.periodOptionTextActive]}>📧 E-posta</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.periodOption, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }, formNotificationChannel === 'browser' && styles.periodOptionActive]} onPress={() => setFormNotificationChannel('browser')}>
                            <Text style={[styles.periodOptionText, { color: theme.textSecondary }, formNotificationChannel === 'browser' && styles.periodOptionTextActive]}>🌐 Tarayıcı Bildirimi</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.formSection}>
                    <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>İptal / Yönetim Bağlantısı</Text>
                    <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.cardBorder }]} placeholder="https://..." placeholderTextColor={theme.textMuted} keyboardType="url" autoCapitalize="none" value={formCancelUrl} onChangeText={setFormCancelUrl} />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
              {formStep === 1 ? (
                <>
                  <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={closeSubscriptionForm}>
                    <Text style={[styles.modalCancelButtonText, { color: theme.textSecondary }]}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={goToStepTwo}>
                    <Text style={styles.modalSaveButtonText}>İleri →</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setFormStep(1)}>
                    <Text style={[styles.modalCancelButtonText, { color: theme.textSecondary }]}>← Geri</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveSubscription}>
                    <Text style={styles.modalSaveButtonText}>Kaydet</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* MÜKERRER KAYIT UYARISI */}
      <Modal visible={duplicateWarning.visible} transparent animationType="fade" onRequestClose={() => setDuplicateWarning({ visible: false, name: '' })}>
        <View style={styles.warningOverlay}>
          <View style={[styles.warningCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.warningIconBox, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
              <Text style={styles.warningIcon}>⚠️</Text>
            </View>
            <Text style={[styles.warningTitle, { color: theme.textPrimary }]}>Bu Abonelik Zaten Kayıtlı</Text>
            <Text style={[styles.warningMessage, { color: theme.textSecondary }]}>"{duplicateWarning.name}" isimli abonelik zaten listenizde bulunuyor.</Text>
            <Text style={[styles.warningHint, { color: theme.textMuted }]}>Mevcut kaydı düzenleyebilir veya aboneliği farklı bir adla ekleyebilirsiniz.</Text>
            <TouchableOpacity style={styles.warningButton} onPress={() => setDuplicateWarning({ visible: false, name: '' })}>
              <Text style={styles.warningButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme, isMobile, fontScale) {
  const font = value => Math.round(value * fontScale);
  const glassSurface = Platform.OS === 'web' ? { backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' } : {};

  return StyleSheet.create({
    container: { flex: 1, width: '100%', minHeight: 0, overflow: 'hidden', ...(Platform.OS === 'web' ? { height: '100dvh' } : { height: '100%' }) },
    appWrapper: { flex: 1, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' },
    appWrapperDesktop: { flexDirection: 'row', width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' },

    glassSurface,

    authWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    authCard: { width: '100%', maxWidth: 420, borderWidth: 1, borderRadius: 22, padding: 28 },
    authHeader: { alignItems: 'center', marginBottom: 16 },
    authLogo: { fontSize: font(26), fontWeight: 'bold' },
    authSubtitle: { fontSize: font(11), marginTop: 4 },
    authTitle: { fontSize: font(18), fontWeight: 'bold', textAlign: 'center', marginTop: 6, marginBottom: 4 },
    authErrorText: { color: '#f87171', fontSize: font(11), fontWeight: '600', marginBottom: 8 },
    authSwitchButton: { marginTop: 16, alignItems: 'center' },
    authSwitchText: { fontSize: font(12), fontWeight: '600' },

    sidebarContainer: { width: 250, minWidth: 250, flexShrink: 0, padding: 20, borderRightWidth: 1 },
    sidebarHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: font(22), fontWeight: 'bold' },
    headerSubtitle: { fontSize: font(11), marginTop: 3 },

    pageHeaderInfo: { flex: 1, minWidth: 0, paddingRight: 16 },
    pageHeaderTitle: { fontSize: isMobile ? font(18) : font(22), fontWeight: '700', letterSpacing: -0.3 },
    pageHeaderDescription: { fontSize: font(11), marginTop: 4, lineHeight: font(16) },

    proBadge: { backgroundColor: '#6965e8', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
    proBadgeText: { color: '#ffffff', fontSize: font(8), fontWeight: 'bold' },

    sidebarNavGroup: { marginTop: 28, gap: 8 },
    sidebarNavButton: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
    sidebarNavButtonActive: { backgroundColor: theme.activeButtonSoft },
    sidebarNavIcon: { fontSize: font(17) },
    sidebarNavText: { fontSize: font(13), fontWeight: 'bold' },

    sidebarFooter: { marginTop: 'auto', gap: 8 },
    secondaryButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
    secondaryButtonText: { fontSize: font(11), fontWeight: 'bold' },
    primaryButton: { backgroundColor: theme.activeButton, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold' },

    contentWrapper: { flex: 1, minWidth: 0, minHeight: 0, height: '100%', width: 'auto', position: 'relative', overflow: 'hidden' },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, paddingHorizontal: isMobile ? 14 : 20, paddingTop: 18, paddingBottom: 14, borderBottomWidth: 1 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconButton: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    iconButtonText: { fontSize: font(17) },

    miniRatesBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 8, maxWidth: isMobile ? 130 : 220 },
    miniRatesIcon: { fontSize: font(13) },
    miniRatesText: { fontSize: font(10), fontWeight: 'bold' },

    mainScroll: { flex: 1, minHeight: 0, width: '100%' },
    scrollContent: { width: '100%', flexGrow: 1, paddingHorizontal: isMobile ? 12 : 20, paddingTop: 14, paddingBottom: isMobile ? 100 : 30 },

    summaryCard: { borderRadius: 18, borderWidth: 1, padding: isMobile ? 15 : 18, marginBottom: 16, shadowColor: '#312e81', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 18, elevation: 7 },
    summaryLabelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    summaryLabel: { color: '#ffffff', fontSize: font(11), fontWeight: 'bold' },
    changeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    changeBadgeText: { fontSize: font(9), fontWeight: 'bold' },
    summaryValue: { color: '#ffffff', fontSize: font(27), fontWeight: 'bold', marginVertical: 5 },
    summaryStatsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    summaryStatBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 9 },
    summaryStatLabel: { color: '#ffffff', fontSize: font(10), opacity: 0.9 },
    summaryStatValue: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold', marginTop: 3 },

    searchInput: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: font(12), marginBottom: 12 },

    singleFilterSection: { marginBottom: 14 },
    sectionLabel: { fontSize: font(12), fontWeight: 'bold', marginBottom: 7 },
    horizontalOptionRow: { flexDirection: 'row', gap: 7, paddingRight: 10 },
    filterOption: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
    filterOptionActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    filterOptionText: { fontSize: font(11), fontWeight: '600' },
    filterOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },

    sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
    sectionTitle: { fontSize: font(14), fontWeight: 'bold' },
    resultCount: { fontSize: font(11) },

    emptyCard: { borderWidth: 1, borderRadius: 12, padding: 22, alignItems: 'center' },
    emptyIcon: { fontSize: font(30) },
    emptyTitle: { fontSize: font(15), fontWeight: 'bold', marginTop: 8 },
    emptyDescription: { fontSize: font(11), textAlign: 'center', marginTop: 5 },

    subscriptionCard: { borderWidth: 1, borderRadius: 15, padding: isMobile ? 12 : 14, marginBottom: 9, flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 11 : 14, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
    subscriptionMain: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 },
    serviceIcon: { width: 38, height: 38, flexShrink: 0, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    serviceIconText: { color: '#ffffff', fontSize: font(15), fontWeight: 'bold' },
    subscriptionInfo: { flex: 1, minWidth: 0 },
    subscriptionTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
    subscriptionName: { fontSize: font(13), fontWeight: 'bold' },

    remainingDaysBadge: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
    remainingDaysText: { fontSize: font(9), fontWeight: 'bold' },

    informationTag: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
    informationTagText: { fontSize: font(9), fontWeight: 'bold' },
    subscriptionSubtitle: { fontSize: font(11), marginTop: 3 },

    subscriptionRight: { flexShrink: 0, alignItems: isMobile ? 'flex-start' : 'flex-end' },
    subscriptionPrice: { fontSize: font(13), fontWeight: 'bold' },
    convertedPrice: { fontSize: font(10), fontWeight: 'bold', marginTop: 2 },
    subscriptionActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
    smallActionButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 },
    smallActionText: { fontSize: font(10), fontWeight: 'bold' },
    deleteButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' },
    deleteButtonText: { fontSize: font(11) },

    calendarSection: { width: '100%', marginTop: 4 },
    calendarNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 14 },
    calendarNavigationButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: isMobile ? 8 : 12, paddingVertical: 8 },
    calendarNavigationText: { fontSize: isMobile ? font(10) : font(12), fontWeight: 'bold' },
    calendarTitle: { flex: 1, textAlign: 'center', fontSize: isMobile ? font(16) : font(19), fontWeight: 'bold' },

    yearButton: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 15, paddingVertical: 7 },
    yearButtonActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    yearButtonText: { fontSize: font(11), fontWeight: '600' },
    yearButtonTextActive: { color: '#ffffff', fontWeight: 'bold' },

    calendarYearSelectorRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
    calendarYearSelectorLabel: { fontSize: font(10), fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
    calendarYearSelectButton: { minWidth: isMobile ? 118 : 150, minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 8 },
    calendarYearSelectValue: { fontSize: font(15), fontWeight: '800' },

    calendarContainer: { width: '100%', marginTop: 14 },
    calendarWeekHeader: { width: '100%', flexDirection: 'row', marginBottom: 7 },
    calendarWeekDay: { width: '14.2857%', alignItems: 'center' },
    calendarWeekDayText: { fontSize: font(11), fontWeight: 'bold' },
    calendarGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
    calendarDay: { width: '14.2857%', height: isMobile ? 88 : 118, borderWidth: 1, borderRadius: 6, padding: 4, marginBottom: 4, overflow: 'hidden' },
    calendarDayEmpty: { opacity: 0, pointerEvents: 'none' },
    calendarDayActive: { borderWidth: 1.5 },
    calendarDayNumber: { flexShrink: 0, fontSize: font(11), fontWeight: 'bold', marginBottom: 3 },
    calendarDayScroll: { flex: 1, minHeight: 0 },
    calendarDayScrollContent: { paddingBottom: 2 },
    calendarSubscriptionBadge: { width: '100%', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 3, marginTop: 2 },
    calendarSubscriptionName: { color: '#ffffff', fontSize: font(8), fontWeight: 'bold' },
    calendarSubscriptionPrice: { color: '#ffffff', fontSize: font(7), marginTop: 1 },

    analyticsSection: { width: '100%', marginTop: 4, paddingBottom: isMobile ? 10 : 18 },
    analysisToolbar: { width: '100%', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 14, marginTop: 14, marginBottom: 22 },
    analysisToolbarLabel: { fontSize: font(10), fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
    analysisToolbarHint: { fontSize: font(11), lineHeight: font(17), marginTop: 4 },
    yearSelectButton: { minWidth: isMobile ? '100%' : 176, minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 14, elevation: 5 },
    yearSelectCaption: { fontSize: font(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7 },
    yearSelectValue: { fontSize: font(18), fontWeight: '800', marginTop: 1 },
    yearSelectChevron: { fontSize: font(22), fontWeight: '800', marginLeft: 20, marginTop: -5 },
    pageTitle: { fontSize: font(21), fontWeight: 'bold' },
    pageDescription: { fontSize: font(12), marginTop: 4, marginBottom: 14 },

    insightBox: { flexDirection: 'row', gap: 12, borderWidth: 1, borderRadius: 18, padding: isMobile ? 16 : 20, marginBottom: 18, alignItems: 'flex-start', shadowColor: '#312e81', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.24, shadowRadius: 22, elevation: 8 },
    insightIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    insightTitle: { color: '#ffffff', fontSize: font(13), fontWeight: 'bold', marginBottom: 4 },
    insightText: { color: 'rgba(255,255,255,0.92)', fontSize: font(11), lineHeight: font(16) },

    analyticsSummaryRow: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 2, marginBottom: 14 },
    analyticsSummaryCard: { flexGrow: 1, flexBasis: isMobile ? '46%' : 150, minWidth: isMobile ? '46%' : 150, borderWidth: 1, borderRadius: 12, padding: 12 },
    analyticsSummaryLabel: { fontSize: font(10), fontWeight: '600' },
    analyticsSummaryValue: { fontSize: font(14), fontWeight: 'bold', marginTop: 4 },

    panel: { width: '100%', borderWidth: 1, borderRadius: 16, padding: isMobile ? 13 : 17, marginBottom: 16, shadowColor: '#000000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
    panelTitle: { fontSize: font(14), fontWeight: 'bold' },
    panelDescription: { fontSize: font(10), marginTop: 4 },

    renewalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1 },
    renewalDot: { width: 8, height: 8, flexShrink: 0, borderRadius: 4 },
    renewalName: { flex: 1, minWidth: 0, fontSize: font(11), fontWeight: '600' },
    renewalDateText: { fontSize: font(10), fontWeight: 'bold' },
    renewalAmount: { fontSize: font(11), fontWeight: 'bold' },

    categoryLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12, marginBottom: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: font(9) },

    chartScrollContent: { minWidth: '100%' },
    chartArea: { minWidth: isMobile ? 620 : 820, height: 220, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 8 },
    chartColumn: { width: isMobile ? 48 : 62, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
    chartAmount: { fontSize: font(8), minHeight: 12, marginBottom: 4 },
    chartTrack: { width: isMobile ? 24 : 32, height: 145, borderRadius: 7, borderWidth: 1, overflow: 'hidden', justifyContent: 'flex-end' },
    chartStack: { width: '100%', overflow: 'hidden', justifyContent: 'flex-end' },
    chartSegment: { width: '100%' },
    chartMonthLabel: { fontSize: font(10), fontWeight: 'bold', marginTop: 6 },
    chartFooter: { borderTopWidth: 1, marginTop: 12, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
    chartFooterLabel: { fontSize: font(12), fontWeight: 'bold' },
    chartFooterValue: { fontSize: font(17), fontWeight: 'bold' },

    distributionTitle: { fontSize: font(14), fontWeight: 'bold', marginTop: 20, marginBottom: 9 },
    distributionTitleNoTop: { marginTop: 0, marginBottom: 3 },
    distributionSubtitle: { fontSize: font(10), lineHeight: font(15) },
    distributionSectionHeader: { width: '100%', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12, marginTop: 22, marginBottom: 11 },
    monthlyCommitmentBadge: { alignSelf: isMobile ? 'stretch' : 'center', borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 9, minWidth: isMobile ? 0 : 150 },
    monthlyCommitmentBadgeLabel: { fontSize: font(8), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
    monthlyCommitmentBadgeValue: { fontSize: font(13), fontWeight: '800', marginTop: 2 },
    monthlyPaymentGrid: { width: '100%', gap: 8 },
    monthlyPaymentCard: { width: '100%', minHeight: 74, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: 12, borderWidth: 1, borderRadius: 15, padding: 13 },
    monthlyPaymentIcon: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    monthlyPaymentIconText: { fontSize: font(17) },
    monthlyPaymentContent: { flex: 1, minWidth: 0 },
    monthlyPaymentName: { fontSize: font(12), fontWeight: '800' },
    monthlyPaymentMeta: { fontSize: font(9), marginTop: 3 },
    monthlyPaymentAmount: { fontSize: font(13), fontWeight: '800', textAlign: isMobile ? 'left' : 'right', flexShrink: 0 },
    monthlyPaymentPeriod: { fontSize: font(9), fontWeight: '600' },
    noDataText: { fontSize: font(11), fontStyle: 'italic' },
    distributionCard: { width: '100%', borderWidth: 1, borderRadius: 13, padding: isMobile ? 11 : 13, marginBottom: 8 },
    distributionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
    distributionNameGroup: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    distributionColorDot: { width: 9, height: 9, borderRadius: 5 },
    distributionName: { fontSize: font(11), fontWeight: 'bold' },
    distributionAmount: { fontSize: font(11), fontWeight: 'bold' },
    progressTrack: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },

    bottomNavigation: { position: Platform.OS === 'web' ? 'fixed' : 'absolute', left: 0, right: 0, bottom: 0, height: 70, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, zIndex: 9999, elevation: 30, paddingBottom: Platform.OS === 'web' ? 6 : 0 },
    bottomNavigationItem: { alignItems: 'center' },
    bottomNavigationIcon: { fontSize: font(17) },
    bottomNavigationText: { fontSize: font(9), fontWeight: 'bold', marginTop: 2 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.58)', justifyContent: 'center', alignItems: 'center', padding: isMobile ? 8 : 18 },

    drawerOverlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' },
    drawerBackdrop: { flex: 1 },
    mobileSidebarPanel: { width: 270, height: '100%', borderRightWidth: 1, padding: 20 },
    dayDrawerPanel: { width: isMobile ? '100%' : 380, height: '100%', borderLeftWidth: 1, paddingTop: isMobile ? 12 : 20, paddingBottom: 12 },

    yearPickerBackdrop: { ...StyleSheet.absoluteFillObject },
    yearPickerCard: { width: isMobile ? '94%' : 430, maxWidth: 430, borderWidth: 1, borderRadius: 20, padding: isMobile ? 16 : 20, shadowColor: '#000000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 24 },
    yearPickerHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
    yearPickerGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    yearPickerOption: { width: isMobile ? '48%' : '31.5%', minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 10 },
    yearPickerOptionText: { fontSize: font(13), fontWeight: '800' },
    yearPickerCheck: { color: '#ffffff', fontSize: font(11), fontWeight: '900' },

    warningOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.62)', paddingHorizontal: 20 },
    warningCard: { width: '100%', maxWidth: 390, borderWidth: 1, borderRadius: 22, paddingHorizontal: 24, paddingTop: 26, paddingBottom: 22, alignItems: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 20 },
    warningIconBox: { width: 58, height: 58, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    warningIcon: { fontSize: font(28) },
    warningTitle: { fontSize: font(19), fontWeight: '800', letterSpacing: -0.2, marginBottom: 8 },
    warningMessage: { fontSize: font(13), fontWeight: '600', lineHeight: font(19), textAlign: 'center' },
    warningHint: { fontSize: font(11), lineHeight: font(17), textAlign: 'center', marginTop: 8, marginBottom: 20 },
    warningButton: { minWidth: 130, minHeight: 44, borderRadius: 12, paddingHorizontal: 24, backgroundColor: theme.activeButton, alignItems: 'center', justifyContent: 'center' },
    warningButtonText: { color: '#ffffff', fontSize: font(13), fontWeight: '800' },

    appearanceModal: { width: isMobile ? '96%' : 760, maxHeight: '92%', minHeight: 0, borderWidth: 1, borderRadius: 18, padding: 20 },
    subscriptionModal: { width: isMobile ? '96%' : '94%', maxWidth: 980, height: isMobile ? '94%' : '92%', maxHeight: 850, minHeight: 0, borderWidth: 1, borderRadius: isMobile ? 16 : 22, overflow: 'hidden', shadowColor: '#000000', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.4, shadowRadius: 32, elevation: 24 },

    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, paddingHorizontal: isMobile ? 15 : 22, paddingTop: isMobile ? 15 : 20, paddingBottom: 12 },
    modalTitle: { fontSize: isMobile ? font(18) : font(21), fontWeight: 'bold' },
    modalSubtitle: { fontSize: font(10), marginTop: 3 },

    stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
    stepDot: { width: 22, height: 5, borderRadius: 3, borderWidth: 1 },
    stepIndicatorText: { fontSize: font(10), marginLeft: 4 },

    modalCloseButton: { width: 34, height: 34, flexShrink: 0, borderRadius: 9, borderWidth: 1, padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' },
    modalCloseText: { width: 30, height: 30, fontSize: font(12), fontWeight: '700', lineHeight: 30, textAlign: 'center', textAlignVertical: 'center', includeFontPadding: false, padding: 0, margin: 0 },

    appearanceSectionTitle: { fontSize: font(13), fontWeight: 'bold', marginTop: 16, marginBottom: 9 },
    appearanceOptionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    appearanceThemeOption: { width: isMobile ? '47%' : '31.5%', minWidth: isMobile ? 130 : 150, borderWidth: 2, borderRadius: 12, padding: 9 },
    appearanceOptionActive: { borderWidth: 2 },
    themePreview: { height: 70, borderRadius: 7, overflow: 'hidden', flexDirection: 'row' },
    themePreviewSidebar: { width: '25%' },
    themePreviewContent: { flex: 1, padding: 5, gap: 5 },
    themePreviewHeader: { height: 18, borderRadius: 3 },
    themePreviewCard: { flex: 1, borderRadius: 4 },
    appearanceOptionLabel: { fontSize: font(10), fontWeight: 'bold', textAlign: 'center', marginTop: 7 },

    fontScaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
    fontScaleOption: { flexGrow: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
    fontScaleOptionActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    fontScaleOptionText: { fontWeight: '600' },
    fontScaleOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },

    subscriptionModalScroll: { flex: 1, minHeight: 0 },
    subscriptionModalContent: { width: '100%', paddingHorizontal: isMobile ? 14 : 22, paddingBottom: 20 },

    formSection: { width: '100%', marginBottom: 17 },
    formSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
    formSectionTitle: { fontSize: font(12), fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.35 },
    formSectionDescription: { fontSize: font(9), marginTop: 3 },
    formSectionAction: { fontSize: font(11), fontWeight: 'bold' },

    twoColumnRow: { width: '100%', flexDirection: 'row', gap: 12 },
    singleColumnRow: { flexDirection: 'column', gap: 0 },
    formColumn: { flex: 1, minWidth: 0 },

    inputLabel: { fontSize: font(10), fontWeight: 'bold', marginBottom: 5 },
    textInput: { width: '100%', minHeight: isMobile ? 44 : 42, borderWidth: 1, borderRadius: 11, paddingHorizontal: 13, paddingVertical: isMobile ? 10 : 9, fontSize: font(12), marginBottom: 10 },

    removableOptionRow: { flexDirection: 'row', gap: 9, paddingTop: 3, paddingBottom: 5, paddingRight: 12 },
    removableOptionWrapper: { position: 'relative', paddingTop: 2, paddingRight: 2 },
    templateOption: { minWidth: 92, height: 38, borderRadius: 8, paddingLeft: 12, paddingRight: 32, justifyContent: 'center' },
    templateOptionText: { color: '#ffffff', fontSize: font(10), fontWeight: 'bold' },
    paymentMethodOption: { minWidth: 110, height: 38, borderRadius: 8, borderWidth: 1, paddingLeft: 12, paddingRight: 32, justifyContent: 'center' },
    paymentMethodOptionActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    paymentMethodOptionText: { fontSize: font(10), fontWeight: 'bold' },

    removeOptionButton: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 5, backgroundColor: 'rgba(15,23,42,0.82)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.24)', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0, zIndex: 3 },
    removeOptionText: { width: 16, height: 16, color: '#ffffff', fontSize: font(9), fontWeight: '700', lineHeight: 16, textAlign: 'center', textAlignVertical: 'center', includeFontPadding: false, padding: 0, margin: 0 },

    inlineForm: { width: '100%', borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 10 },
    inlineInputRow: { flexDirection: isMobile ? 'column' : 'row', gap: 8, alignItems: isMobile ? 'stretch' : 'center' },
    flexInput: { flex: 1, marginBottom: 0 },
    inlineAddButton: { paddingHorizontal: 18 },
    inlineSaveButton: { marginTop: 12, alignSelf: 'stretch' },

    currencyOptionRow: { flexDirection: 'row', gap: 5, flex: 1 },
    wrappedOptionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 4 },
    compactOptionButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
    flexOptionButton: { flex: 1 },
    compactOptionButtonActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    compactOptionText: { fontSize: font(10), fontWeight: '600' },
    compactOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },

    periodOptionRow: { flexDirection: 'row', gap: 8 },
    periodOption: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
    periodOptionActive: { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder },
    periodOptionText: { fontSize: font(11), fontWeight: '600' },
    periodOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },

    categoryOption: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8 },
    categoryOptionText: { fontSize: font(10), fontWeight: 'bold' },

    dateInputRow: { width: '100%', flexDirection: 'row', gap: 9 },
    dateInputField: { flex: 1, minWidth: 0 },
    dateInputYearField: { flex: 1.25 },
    helperText: { fontSize: font(9), marginTop: -4 },

    modalFooter: { flexDirection: 'row', flexShrink: 0, gap: 10, borderTopWidth: 1, paddingHorizontal: isMobile ? 14 : 22, paddingVertical: 14 },
    modalCancelButton: { flex: 1, minHeight: 46, borderWidth: 1, borderRadius: 11, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    modalCancelButtonText: { fontSize: font(12), fontWeight: 'bold' },
    modalSaveButton: { flex: 2, minHeight: 46, backgroundColor: theme.activeButton, borderRadius: 11, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    modalSaveButtonText: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold' }
  });
}

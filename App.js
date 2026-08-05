import React, { useState, useEffect, useMemo } from 'react';
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
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 768;

// --- TEMA TANIMLARI ---
const themes = {
  midnight: {
    dark: true,
    bg: '#090d16',
    cardBg: '#111827',
    cardBorder: '#1f293d',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    inputBg: '#161f33',
    inputText: '#ffffff',
    inputBorder: '#2a3752',
    activeButton: '#3b82f6',
    activeButtonSoft: 'rgba(59, 130, 246, 0.25)',
    activeButtonBorder: '#60a5fa',
    accent: '#3b82f6',
  },
  emerald: {
    dark: true,
    bg: '#061310',
    cardBg: '#0e1f1b',
    cardBorder: '#17332c',
    textPrimary: '#f0fdf4',
    textSecondary: '#86efac',
    inputBg: '#122621',
    inputText: '#ffffff',
    inputBorder: '#1e3f37',
    activeButton: '#10b981',
    activeButtonSoft: 'rgba(16, 185, 129, 0.25)',
    activeButtonBorder: '#34d399',
    accent: '#10b981',
  },
  sunset: {
    dark: true,
    bg: '#140a0f',
    cardBg: '#20111a',
    cardBorder: '#351c2d',
    textPrimary: '#fdf2f8',
    textSecondary: '#f472b6',
    inputBg: '#271622',
    inputText: '#ffffff',
    inputBorder: '#422439',
    activeButton: '#ec4899',
    activeButtonSoft: 'rgba(236, 72, 153, 0.25)',
    activeButtonBorder: '#f472f6',
    accent: '#ec4899',
  },
  light: {
    dark: false,
    bg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    inputBg: '#f1f5f9',
    inputText: '#0f172a',
    inputBorder: '#cbd5e1',
    activeButton: '#2563eb',
    activeButtonSoft: 'rgba(37, 99, 235, 0.15)',
    activeButtonBorder: '#3b82f6',
    accent: '#2563eb',
  },
};

const CURRENCIES = {
  TRY: { symbol: '₺', rateToUSD: 0.028 },
  USD: { symbol: '$', rateToUSD: 1.0 },
  EUR: { symbol: '€', rateToUSD: 1.08 },
  GBP: { symbol: '£', rateToUSD: 1.28 },
};

const CATEGORIES = [
  { id: 'entertainment', name: 'Eğlence & Medya', color: '#ef4444', icon: '🎬' },
  { id: 'software', name: 'Yazılım & Bulut', color: '#3b82f6', icon: '💻' },
  { id: 'utility', name: 'Fatura & Hizmet', color: '#10b981', icon: '⚡' },
  { id: 'health', name: 'Sağlık & Spor', color: '#8b5cf6', icon: '🏋️' },
  { id: 'education', name: 'Eğitim', color: '#f59e0b', icon: '📚' },
  { id: 'other', name: 'Diğer', color: '#6b7280', icon: '🏷️' },
];

export default function App() {
  const [currentThemeKey, setCurrentThemeKey] = useState('midnight');
  const [fontScale, setFontScale] = useState(1);
  const theme = themes[currentThemeKey];

  const font = (size) => Math.round(size * fontScale);
  const styles = useMemo(() => createStyles(theme, font), [theme, fontScale]);

  const [activeTab, setActiveTab] = useState('subscriptions'); // subscriptions, calendar, analytics, settings
  const [subscriptions, setSubscriptions] = useState([
    {
      id: '1',
      name: 'Netflix',
      price: 229.99,
      currency: 'TRY',
      period: 'monthly',
      category: 'entertainment',
      paymentMethod: 'Kredi Kartı',
      startDate: '2025-01-15',
    },
    {
      id: '2',
      name: 'GitHub Copilot',
      price: 10.0,
      currency: 'USD',
      period: 'monthly',
      category: 'software',
      paymentMethod: 'Kredi Kartı',
      startDate: '2025-02-01',
    },
    {
      id: '3',
      name: 'Spotify',
      price: 59.99,
      currency: 'TRY',
      period: 'monthly',
      category: 'entertainment',
      paymentMethod: 'Kredi Kartı',
      startDate: '2025-01-10',
    },
  ]);

  // Modal ve Form State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [formStep, setFormStep] = useState(1);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [period, setPeriod] = useState('monthly');
  const [category, setCategory] = useState('entertainment');
  const [paymentMethod, setPaymentMethod] = useState('Kredi Kartı');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Yeni Abonelik Ekleme Hızlı Seçenekleri
  const [quickTemplates, setQuickTemplates] = useState([
    'Netflix', 'Spotify', 'YouTube', 'Amazon Prime', 'GitHub', 'ChatGPT', 'Adobe', 'iCloud', 'Google One'
  ]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showAddTemplateInput, setShowAddTemplateInput] = useState(false);

  // Takvim ve Analiz Yıl State'leri
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [analyticsYear, setAnalyticsYear] = useState(new Date().getFullYear().toString());
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  // Projeksiyon Oranı
  const [projectionRate, setProjectionRate] = useState('15');

  // Para birimi dönüştürücü
  const convertCurrency = (amount, fromCurr, toCurr = 'TRY') => {
    if (fromCurr === toCurr) return amount;
    const amountInUSD = amount * (CURRENCIES[fromCurr]?.rateToUSD || 1);
    return amountInUSD / (CURRENCIES[toCurr]?.rateToUSD || 1);
  };

  const calculateMonthlyTRY = (sub) => {
    let monthlyAmount = sub.price;
    if (sub.period === 'yearly') monthlyAmount = sub.price / 12;
    else if (sub.period === 'weekly') monthlyAmount = sub.price * 4.33;
    else if (sub.period === 'daily') monthlyAmount = sub.price * 30;
    return convertCurrency(monthlyAmount, sub.currency, 'TRY');
  };

  const totalMonthlyCostTRY = useMemo(() => {
    return subscriptions.reduce((sum, sub) => sum + calculateMonthlyTRY(sub), 0);
  }, [subscriptions]);

  // Form Sıfırlama ve Açma
  const handleOpenAddModal = () => {
    setEditingSub(null);
    setName('');
    setPrice('');
    setCurrency('TRY');
    setPeriod('monthly');
    setCategory('entertainment');
    setPaymentMethod('Kredi Kartı');
    setStartDate(new Date().toISOString().split('T')[0]);
    setFormStep(1);
    setIsModalOpen(true);
  };

  const handleEditSub = (sub) => {
    setEditingSub(sub);
    setName(sub.name);
    setPrice(sub.price.toString());
    setCurrency(sub.currency);
    setPeriod(sub.period);
    setCategory(sub.category);
    setPaymentMethod(sub.paymentMethod || 'Kredi Kartı');
    setStartDate(sub.startDate || new Date().toISOString().split('T')[0]);
    setFormStep(1);
    setIsModalOpen(true);
  };

  const handleSaveSub = () => {
    if (!name.trim() || !price || isNaN(Number(price))) return;

    const subData = {
      id: editingSub ? editingSub.id : Date.now().toString(),
      name: name.trim(),
      price: parseFloat(price),
      currency,
      period,
      category,
      paymentMethod,
      startDate,
    };

    if (editingSub) {
      setSubscriptions(subscriptions.map((s) => (s.id === editingSub.id ? subData : s)));
    } else {
      setSubscriptions([...subscriptions, subData]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSub = (id) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  // Hızlı şablon ekleme/silme
  const handleAddTemplate = () => {
    if (newTemplateName.trim() && !quickTemplates.includes(newTemplateName.trim())) {
      setQuickTemplates([...quickTemplates, newTemplateName.trim()]);
      setNewTemplateName('');
      setShowAddTemplateInput(false);
    }
  };

  const handleRemoveTemplate = (templateToRemove) => {
    setQuickTemplates(quickTemplates.filter(t => t !== templateToRemove));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      {/* ÜST BAŞLIK */}
      <View style={[styles.headerContainer, { borderBottomColor: theme.cardBorder }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cebin PRO</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Akıllı Abonelik & Bütçe Yönetimi</Text>
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.activeButton }]} onPress={handleOpenAddModal}>
          <Text style={styles.addButtonText}>+ Yeni Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* İÇERİK SEKMELERİ */}
      <View style={styles.contentContainer}>
        {activeTab === 'subscriptions' && (
          <ScrollView contentContainerStyle={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
            {/* Özet Kartı */}
            <View style={[styles.summaryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <View>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Toplam Aylık Taahhüt</Text>
                <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
                  {totalMonthlyCostTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                </Text>
              </View>
              <View style={[styles.summaryBadge, { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }]}>
                <Text style={[styles.summaryBadgeText, { color: theme.textPrimary }]}>{subscriptions.length} Aktif Abonelik</Text>
              </View>
            </View>

            {/* Abonelik Listesi */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Aktif Abonelikler</Text>
            </View>

            {subscriptions.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.noDataText, { color: theme.textSecondary }]}>Henüz eklenmiş bir abonelik bulunmuyor.</Text>
              </View>
            ) : (
              <View style={styles.subGrid}>
                {subscriptions.map((sub) => {
                  const cat = CATEGORIES.find((c) => c.id === sub.category) || CATEGORIES[5];
                  const currSymbol = CURRENCIES[sub.currency]?.symbol || sub.currency;
                  return (
                    <View key={sub.id} style={[styles.subCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                      <View style={styles.subCardTop}>
                        <View style={[styles.subCategoryIcon, { backgroundColor: cat.color + '22', borderColor: cat.color }]}>
                          <Text>{cat.icon}</Text>
                        </View>
                        <View style={styles.subCardInfo}>
                          <Text style={[styles.subName, { color: theme.textPrimary }]}>{sub.name}</Text>
                          <Text style={[styles.subCategoryName, { color: theme.textSecondary }]}>{cat.name}</Text>
                        </View>
                        <View style={styles.subPriceWrap}>
                          <Text style={[styles.subPrice, { color: theme.textPrimary }]}>
                            {sub.price.toLocaleString('tr-TR')} {currSymbol}
                          </Text>
                          <Text style={[styles.subPeriod, { color: theme.textSecondary }]}>
                            {sub.period === 'monthly' ? 'Aylık' : sub.period === 'yearly' ? 'Yıllık' : 'Diğer'}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.subCardFooter, { borderTopColor: theme.cardBorder }]}>
                        <Text style={[styles.subMeta, { color: theme.textSecondary }]}>Ödeme: {sub.paymentMethod}</Text>
                        <View style={styles.subActions}>
                          <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.cardBorder, backgroundColor: theme.inputBg }]} onPress={() => handleEditSub(sub)}>
                            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Düzenle</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionBtnDelete, { borderColor: '#ef444455', backgroundColor: '#ef444415' }]} onPress={() => handleDeleteSub(sub.id)}>
                            <Text style={styles.actionBtnDeleteText}>Sil</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        )}

        {activeTab === 'calendar' && (
          <ScrollView contentContainerStyle={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.calendarYearSelectorRow, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={[styles.calendarYearSelectorLabel, { color: theme.textPrimary }]}>Takvim Görünüm Yılı</Text>
              <TouchableOpacity
                style={[styles.calendarYearSelectButton, { borderColor: theme.cardBorder, backgroundColor: theme.inputBg }]}
                onPress={() => setIsYearPickerOpen(true)}
              >
                <Text style={[styles.calendarYearSelectValue, { color: theme.textPrimary }]}>{calendarYear}</Text>
                <Text style={{ color: theme.textSecondary }}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Takvim Grid Bileşeni */}
            <View style={[styles.calendarContainer, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
              <View style={[styles.calendarWeekHeader, { backgroundColor: theme.inputBg, borderBottomColor: theme.cardBorder }]}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, idx) => (
                  <View key={idx} style={styles.calendarWeekDay}>
                    <Text style={[styles.calendarWeekDayText, { color: theme.textSecondary }]}>{day}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {(() => {
                  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
                  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
                  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                  const days = [];

                  for (let i = 0; i < offset; i++) {
                    days.push(<View key={`empty-${i}`} style={[styles.calendarDay, styles.calendarDayEmpty]} />);
                  }

                  for (let d = 1; d <= daysInMonth; d++) {
                    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    // Örnek eşleşme: Başlangıç gününe göre basit simülasyon veya tam eşleşme
                    const matchingSubs = subscriptions.filter(s => {
                      if (!s.startDate) return false;
                      const parts = s.startDate.split('-');
                      return parseInt(parts[2], 10) === d;
                    });

                    days.push(
                      <TouchableOpacity
                        key={`day-${d}`}
                        style={[styles.calendarDay, matchingSubs.length > 0 && styles.calendarDayActive, { borderColor: theme.cardBorder }]}
                        onPress={() => setSelectedDayEvents({ date: dateStr, subs: matchingSubs })}
                      >
                        <Text style={[styles.calendarDayNumber, { color: theme.textPrimary }]}>{d}</Text>
                        <View style={styles.calendarDayScroll}>
                          {matchingSubs.map((sub, sIdx) => {
                            const cat = CATEGORIES.find(c => c.id === sub.category) || CATEGORIES[5];
                            return (
                              <View key={sIdx} style={[styles.calendarSubscriptionBadge, { backgroundColor: cat.color }]}>
                                <Text style={styles.calendarSubscriptionName} numberOfLines={1}>{sub.name}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </TouchableOpacity>
                    );
                  }
                  return days;
                })()}
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'analytics' && (
          <ScrollView contentContainerStyle={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.analysisToolbar, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <View>
                <Text style={[styles.analysisToolbarLabel, { color: theme.textPrimary }]}>Finansal Projeksiyon & Analiz</Text>
                <Text style={[styles.analysisToolbarHint, { color: theme.textSecondary }]}>Yıllık enflasyon ve artış simülasyonu</Text>
              </View>
              <TouchableOpacity
                style={[styles.yearSelectButton, { borderColor: theme.cardBorder, backgroundColor: theme.inputBg }]}
                onPress={() => setIsYearPickerOpen(true)}
              >
                <Text style={[styles.yearSelectValue, { color: theme.textPrimary }]}>{analyticsYear}</Text>
                <Text style={[styles.yearSelectChevron, { color: theme.textSecondary }]}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Projeksiyon Oranı Ayarı */}
            <View style={[styles.analysisSectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <View style={styles.projectionFieldCard}>
                <View style={styles.projectionFieldCopy}>
                  <Text style={[styles.formSectionTitle, { color: theme.textPrimary }]}>Beklenen Yıllık Artış Oranı</Text>
                  <Text style={[styles.formSectionDescription, { color: theme.textSecondary }]}>Gelecek dönem maliyet projeksiyonu için oran belirleyin</Text>
                </View>
                <View style={styles.projectionRateInputWrap}>
                  <TextInput
                    style={[styles.textInput, styles.projectionRateInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                    keyboardType="numeric"
                    value={projectionRate}
                    onChangeText={setProjectionRate}
                  />
                  <Text style={[styles.projectionPercent, { color: theme.textPrimary }]}>%</Text>
                </View>
              </View>
            </View>

            {/* Kategori Dağılımı */}
            <View style={[styles.analysisSectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={[styles.distributionTitle, { color: theme.textPrimary }]}>Kategori Bazlı Dağılım</Text>
              {CATEGORIES.map(cat => {
                const catTotal = subscriptions
                  .filter(s => s.category === cat.id)
                  .reduce((sum, s) => sum + calculateMonthlyTRY(s), 0);
                if (catTotal === 0) return null;
                const percentage = totalMonthlyCostTRY > 0 ? (catTotal / totalMonthlyCostTRY) * 100 : 0;
                return (
                  <View key={cat.id} style={styles.distributionCard}>
                    <View style={styles.distributionHeader}>
                      <View style={styles.distributionNameGroup}>
                        <View style={[styles.distributionColorDot, { backgroundColor: cat.color }]} />
                        <Text style={[styles.distributionName, { color: theme.textPrimary }]}>{cat.name}</Text>
                      </View>
                      <Text style={[styles.distributionAmount, { color: theme.textPrimary }]}>
                        {catTotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺ (%{percentage.toFixed(1)})
                      </Text>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
                      <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: cat.color }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

        {activeTab === 'settings' && (
          <ScrollView contentContainerStyle={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.panel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>Görünüm & Tema</Text>
              <Text style={[styles.panelDescription, { color: theme.textSecondary }]}>Uygulama renk paletini özelleştirin</Text>
              <View style={styles.appearanceOptionGrid}>
                {Object.keys(themes).map(tKey => (
                  <TouchableOpacity
                    key={tKey}
                    style={[
                      styles.appearanceThemeOption,
                      { backgroundColor: themes[tKey].cardBg, borderColor: currentThemeKey === tKey ? themes[tKey].activeButtonBorder : themes[tKey].cardBorder },
                      currentThemeKey === tKey && styles.appearanceOptionActive
                    ]}
                    onPress={() => setCurrentThemeKey(tKey)}
                  >
                    <View style={[styles.themePreview, { backgroundColor: themes[tKey].bg }]}>
                      <View style={[styles.themePreviewSidebar, { backgroundColor: themes[tKey].cardBg }]} />
                      <View style={styles.themePreviewContent}>
                        <View style={[styles.themePreviewHeader, { backgroundColor: themes[tKey].textPrimary }]} />
                        <View style={[styles.themePreviewCard, { backgroundColor: themes[tKey].activeButton }]} />
                      </View>
                    </View>
                    <Text style={[styles.appearanceOptionLabel, { color: themes[tKey].textPrimary }]}>
                      {tKey.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.appearanceSectionTitle, { color: theme.textPrimary }]}>Yazı Boyutu Ölçeği</Text>
              <View style={styles.fontScaleRow}>
                {[0.9, 1.0, 1.1].map(scale => (
                  <TouchableOpacity
                    key={scale}
                    style={[
                      styles.fontScaleOption,
                      { borderColor: theme.cardBorder, backgroundColor: theme.inputBg },
                      fontScale === scale && { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }
                    ]}
                    onPress={() => setFontScale(scale)}
                  >
                    <Text style={[styles.fontScaleOptionText, { color: theme.textSecondary }, fontScale === scale && { color: theme.textPrimary, fontWeight: 'bold' }]}>
                      {scale === 0.9 ? 'Küçük' : scale === 1.0 ? 'Normal' : 'Büyük'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ALT NAVİGASYON ÇUBUĞU */}
      <View style={[styles.bottomNavigation, { backgroundColor: theme.cardBg, borderTopColor: theme.cardBorder }]}>
        {[
          { key: 'subscriptions', label: 'Abonelikler', icon: '💳' },
          { key: 'calendar', label: 'Takvim', icon: '📅' },
          { key: 'analytics', label: 'Analiz', icon: '📊' },
          { key: 'settings', label: 'Ayarlar', icon: '⚙️' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.bottomNavigationItem}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.bottomNavigationIcon}>{tab.icon}</Text>
              <Text style={[styles.bottomNavigationText, { color: isActive ? theme.activeButton : theme.textSecondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ABONELİK EKLEME / DÜZENLEME MODALI */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true} onRequestClose={() => setIsModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.subscriptionModal, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {editingSub ? 'Aboneliği Düzenle' : 'Yeni Abonelik Ekle'}
                </Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>Detayları girerek takibe başlayın</Text>
              </View>
              <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]} onPress={() => setIsModalOpen(false)}>
                <Text style={[styles.modalCloseText, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.subscriptionModalScroll} contentContainerStyle={styles.subscriptionModalContent}>
              {/* Adım 1: İsim Seçimi / Girişi */}
              <View style={styles.formSection}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Abonelik Adı</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.removableOptionRow}>
                  {quickTemplates.map((tName) => {
                    const isSelected = name === tName;
                    return (
                      <View key={tName} style={styles.removableOptionWrapper}>
                        <TouchableOpacity
                          style={[
                            styles.templateOption,
                            { backgroundColor: isSelected ? theme.activeButton : theme.inputBg, borderColor: theme.cardBorder }
                          ]}
                          onPress={() => setName(tName)}
                        >
                          <Text style={styles.templateOptionText}>{tName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeOptionButton} onPress={() => handleRemoveTemplate(tName)}>
                          <Text style={styles.removeOptionText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText, marginTop: 8 }]}
                  placeholder="Veya özel bir hizmet adı yazın..."
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Fiyat ve Para Birimi */}
              <View style={styles.twoColumnRow}>
                <View style={[styles.formColumn, { flex: 1.5 }]}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Ücret</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.inputText }]}
                    placeholder="0.00"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={[styles.formColumn, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Para Birimi</Text>
                  <View style={styles.currencyOptionRow}>
                    {Object.keys(CURRENCIES).map((cKey) => (
                      <TouchableOpacity
                        key={cKey}
                        style={[
                          styles.compactOptionButton,
                          styles.flexOptionButton,
                          { backgroundColor: theme.inputBg, borderColor: theme.cardBorder },
                          currency === cKey && styles.compactOptionButtonActive
                        ]}
                        onPress={() => setCurrency(cKey)}
                      >
                        <Text style={[styles.compactOptionText, { color: theme.textSecondary }, currency === cKey && styles.compactOptionTextActive]}>
                          {cKey}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Periyot */}
              <View style={styles.formSection}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Ödeme Periyodu</Text>
                <View style={styles.periodOptionRow}>
                  {[
                    { key: 'monthly', label: 'Aylık' },
                    { key: 'yearly', label: 'Yıllık' },
                    { key: 'weekly', label: 'Haftalık' },
                  ].map((p) => (
                    <TouchableOpacity
                      key={p.key}
                      style={[
                        styles.periodOption,
                        { backgroundColor: theme.inputBg, borderColor: theme.cardBorder },
                        period === p.key && styles.periodOptionActive
                      ]}
                      onPress={() => setPeriod(p.key)}
                    >
                      <Text style={[styles.periodOptionText, { color: theme.textSecondary }, period === p.key && styles.periodOptionTextActive]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Kategori */}
              <View style={styles.formSection}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Kategori</Text>
                <View style={styles.wrappedOptionRow}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        { backgroundColor: theme.inputBg, borderColor: theme.cardBorder },
                        category === cat.id && { backgroundColor: theme.activeButtonSoft, borderColor: theme.activeButtonBorder }
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Text style={[styles.categoryOptionText, { color: category === cat.id ? theme.textPrimary : theme.textSecondary }]}>
                        {cat.icon} {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.cardBorder }]}>
              <TouchableOpacity style={[styles.modalCancelButton, { borderColor: theme.cardBorder }]} onPress={() => setIsModalOpen(false)}>
                <Text style={[styles.modalCancelButtonText, { color: theme.textPrimary }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSaveButton, { backgroundColor: theme.activeButton }]} onPress={handleSaveSub}>
                <Text style={styles.modalSaveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* YIL SEÇİCİ MODALI */}
      <Modal visible={isYearPickerOpen} animationType="fade" transparent={true} onRequestClose={() => setIsYearPickerOpen(false)}>
        <View style={styles.warningOverlay}>
          <View style={[styles.yearPickerCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.yearPickerHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Yıl Seçin</Text>
              <TouchableOpacity onPress={() => setIsYearPickerOpen(false)}>
                <Text style={{ color: theme.textSecondary, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.yearPickerGrid}>
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => {
                const currentSelected = activeTab === 'calendar' ? calendarYear : parseInt(analyticsYear, 10);
                const isSelected = currentSelected === y;
                return (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.yearPickerOption,
                      { backgroundColor: theme.inputBg, borderColor: theme.cardBorder },
                      isSelected && { backgroundColor: theme.activeButton, borderColor: theme.activeButtonBorder }
                    ]}
                    onPress={() => {
                      if (activeTab === 'calendar') setCalendarYear(y);
                      else setAnalyticsYear(y.toString());
                      setIsYearPickerOpen(false);
                    }}
                  >
                    <Text style={[styles.yearPickerOptionText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>{y}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme, font) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
    headerLeft: { gap: 2 },
    headerTitle: { fontSize: font(20), fontWeight: 'bold' },
    headerSubtitle: { fontSize: font(11) },
    addButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    addButtonText: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold' },

    contentContainer: { flex: 1 },
    tabContentScroll: { padding: 20, gap: 16, paddingBottom: 30 },

    summaryCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 16, padding: 18 },
    summaryLabel: { fontSize: font(12), fontWeight: '600', marginBottom: 4 },
    summaryValue: { fontSize: font(22), fontWeight: 'bold' },
    summaryBadge: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    summaryBadgeText: { fontSize: font(11), fontWeight: 'bold' },

    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
    sectionTitle: { fontSize: font(16), fontWeight: 'bold' },

    emptyBox: { borderWidth: 1, borderRadius: 14, padding: 24, alignItems: 'center', justifyContent: 'center' },
    noDataText: { fontSize: font(12), textAlign: 'center' },

    subGrid: { gap: 10 },
    subCard: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 12 },
    subCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    subCategoryIcon: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    subCardInfo: { flex: 1, gap: 2 },
    subName: { fontSize: font(14), fontWeight: 'bold' },
    subCategoryName: { fontSize: font(11) },
    subPriceWrap: { alignItems: 'flex-end' },
    subPrice: { fontSize: font(14), fontWeight: 'bold' },
    subPeriod: { fontSize: font(10), marginTop: 2 },
    subCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1 },
    subMeta: { fontSize: font(11) },
    subActions: { flexDirection: 'row', gap: 8 },
    actionBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
    actionBtnText: { fontSize: font(11), fontWeight: '600' },
    actionBtnDelete: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
    actionBtnDeleteText: { color: '#ef4444', fontSize: font(11), fontWeight: '600' },

    calendarYearSelectorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
    calendarYearSelectorLabel: { fontSize: font(13), fontWeight: 'bold' },
    calendarYearSelectButton: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
    calendarYearSelectValue: { fontSize: font(13), fontWeight: 'bold' },

    calendarContainer: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
    calendarWeekHeader: { flexDirection: 'row', borderBottomWidth: 1 },
    calendarWeekDay: { flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    calendarWeekDayText: { fontSize: font(11), fontWeight: 'bold' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarDay: { width: `${100 / 7}%`, minHeight: 70, borderWidth: 0.5, padding: 3, alignItems: 'stretch' },
    calendarDayEmpty: { backgroundColor: 'transparent' },
    calendarDayActive: { opacity: 1 },
    calendarDayNumber: { fontSize: font(11), fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
    calendarDayScroll: { flex: 1, gap: 2 },
    calendarSubscriptionBadge: { borderRadius: 3, paddingHorizontal: 2, paddingVertical: 1 },
    calendarSubscriptionName: { color: '#ffffff', fontSize: font(8), fontWeight: 'bold' },

    analysisToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 14, padding: 14 },
    analysisToolbarLabel: { fontSize: font(14), fontWeight: 'bold' },
    analysisToolbarHint: { fontSize: font(10), marginTop: 2 },
    yearSelectButton: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
    yearSelectValue: { fontSize: font(13), fontWeight: 'bold' },
    yearSelectChevron: { fontSize: font(12) },

    analysisSectionCard: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 12 },
    projectionFieldCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    projectionFieldCopy: { flex: 1 },
    projectionRateInputWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    projectionRateInput: { width: 65, textAlign: 'center', paddingVertical: 6 },
    projectionPercent: { fontSize: font(14), fontWeight: 'bold' },

    distributionTitle: { fontSize: font(14), fontWeight: 'bold' },
    distributionCard: { borderWidth: 1, borderRadius: 10, padding: 10, gap: 8 },
    distributionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    distributionNameGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    distributionColorDot: { width: 10, height: 10, borderRadius: 5 },
    distributionName: { fontSize: font(12), fontWeight: 'bold' },
    distributionAmount: { fontSize: font(11), fontWeight: '600' },
    progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },

    panel: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 12 },
    panelTitle: { fontSize: font(16), fontWeight: 'bold' },
    panelDescription: { fontSize: font(11) },
    appearanceOptionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
    appearanceThemeOption: { width: '31%', borderWidth: 1, borderRadius: 10, padding: 8, alignItems: 'center', gap: 6 },
    appearanceOptionActive: { borderWidth: 2 },
    themePreview: { width: '100%', height: 40, borderRadius: 6, overflow: 'hidden', flexDirection: 'row' },
    themePreviewSidebar: { width: '30%', height: '100%' },
    themePreviewContent: { flex: 1, padding: 4, gap: 3 },
    themePreviewHeader: { width: '100%', height: 6, borderRadius: 2 },
    themePreviewCard: { width: '100%', height: 12, borderRadius: 2 },
    appearanceOptionLabel: { fontSize: font(10), fontWeight: 'bold' },
    appearanceSectionTitle: { fontSize: font(13), fontWeight: 'bold', marginTop: 10 },
    fontScaleRow: { flexDirection: 'row', gap: 8 },
    fontScaleOption: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
    fontScaleOptionText: { fontSize: font(11), fontWeight: '600' },

    bottomNavigation: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 8, paddingHorizontal: 12 },
    bottomNavigationItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
    bottomNavigationIcon: { fontSize: font(16) },
    bottomNavigationText: { fontSize: font(10), fontWeight: '600' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    subscriptionModal: { width: '100%', maxHeight: '85%', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, overflow: 'hidden' },
    subscriptionModalScroll: { flex: 1 },
    subscriptionModalContent: { padding: 20, gap: 16 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: font(16), fontWeight: 'bold' },
    modalSubtitle: { fontSize: font(11), marginTop: 2 },
    modalCloseButton: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    modalCloseText: { fontSize: font(14), fontWeight: 'bold' },

    formSection: { gap: 8 },
    inputLabel: { fontSize: font(11), fontWeight: '600' },
    removableOptionRow: { gap: 8, paddingBottom: 4 },
    removableOptionWrapper: { position: 'relative' },
    templateOption: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    templateOptionText: { color: '#ffffff', fontSize: font(11), fontWeight: 'bold' },
    removeOptionButton: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
    removeOptionText: { color: '#ffffff', fontSize: font(8), fontWeight: 'bold' },

    textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: font(12) },
    twoColumnRow: { flexDirection: 'row', gap: 12 },
    formColumn: { gap: 4 },
    currencyOptionRow: { flexDirection: 'row', gap: 4 },
    compactOptionButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    flexOptionButton: { flex: 1 },
    compactOptionButtonActive: {},
    compactOptionText: { fontSize: font(10), fontWeight: '600' },
    compactOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },
    periodOptionRow: { flexDirection: 'row', gap: 8 },
    periodOption: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    periodOptionActive: {},
    periodOptionText: { fontSize: font(11), fontWeight: '600' },
    periodOptionTextActive: { color: '#ffffff', fontWeight: 'bold' },
    wrappedOptionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryOption: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
    categoryOptionText: { fontSize: font(11), fontWeight: '600' },

    modalFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, borderTopWidth: 1 },
    modalCancelButton: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    modalCancelButtonText: { fontSize: font(12), fontWeight: 'bold' },
    modalSaveButton: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    modalSaveButtonText: { color: '#ffffff', fontSize: font(12), fontWeight: 'bold' },

    warningOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
    yearPickerCard: { width: '100%', maxWidth: 320, borderWidth: 1, borderRadius: 16, padding: 20, gap: 14 },
    yearPickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    yearPickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    yearPickerOption: { width: '31%', borderWidth: 1, borderRadius: 8, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    yearPickerOptionText: { fontSize: font(13), fontWeight: 'bold' },
  });
}

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

const DEFAULT_PAYMENT_METHODS = [
  'Garanti Bonus',
  'Enpara Kart',
  'Papara',
  'İş Bankası Maximum',
  'Yapı Kredi World',
  'Nakit / Diğer'
];

const DEFAULT_TEMPLATES = [
  {
    name: 'Netflix',
    price: '299',
    currency: 'TRY',
    category: 'Eğlence',
    color: '#E50914'
  },
  {
    name: 'Spotify',
    price: '89',
    currency: 'TRY',
    category: 'Müzik',
    color: '#1DB954'
  },
  {
    name: 'YouTube Premium',
    price: '115',
    currency: 'TRY',
    category: 'Eğlence',
    color: '#FF0000'
  },
  {
    name: 'ChatGPT Plus',
    price: '20',
    currency: 'USD',
    category: 'Yazılım & AI',
    color: '#10A37F'
  },
  {
    name: 'iCloud+',
    price: '49.99',
    currency: 'TRY',
    category: 'Bulut & Depolama',
    color: '#007AFF'
  },
  {
    name: 'Amazon Prime',
    price: '49',
    currency: 'TRY',
    category: 'Eğlence',
    color: '#00A8E1'
  },
];

const TEMPLATE_COLOR_PALETTE = [
  '#6366f1',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#8b5cf6',
  '#f97316',
  '#06b6d4'
];

const NOTIFICATION_OPTIONS = [
  { label: 'Bildirim Yok', badgeLabel: null, value: -1 },
  { label: 'Aynı Gün', badgeLabel: '🔔 Aynı Gün', value: 0 },
  { label: '1 Gün Önce', badgeLabel: '🔔 1 Gün Önce', value: 1 },
  { label: '2 Gün Önce', badgeLabel: '🔔 2 Gün Önce', value: 2 },
  { label: '3 Gün Önce', badgeLabel: '🔔 3 Gün Önce', value: 3 },
  { label: '1 Hafta Önce', badgeLabel: '🔔 1 Hafta Önce', value: 7 },
];

const MONTH_NAMES = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık'
];

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

const formatCurrency = (val, currency = 'TRY') => {
  const num = Number(val) || 0;

  const symbol =
    currency === 'USD'
      ? '$'
      : currency === 'EUR'
        ? '€'
        : '₺';

  return `${num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${symbol}`;
};

const formatShortCurrency = (val, currency = 'TRY') => {
  const num = Number(val) || 0;

  const symbol =
    currency === 'USD'
      ? '$'
      : currency === 'EUR'
        ? '€'
        : '₺';

  return `${Math.round(num).toLocaleString('tr-TR')} ${symbol}`;
};

const convertToTL = (
  price,
  currency,
  rates = DEFAULT_RATES
) => {
  const parsedPrice = Number(price) || 0;

  if (currency === 'USD') {
    return parsedPrice * (rates.USD || DEFAULT_RATES.USD);
  }

  if (currency === 'EUR') {
    return parsedPrice * (rates.EUR || DEFAULT_RATES.EUR);
  }

  return parsedPrice;
};

const getServiceColor = (name, list) => {
  const source =
    list && list.length
      ? list
      : DEFAULT_TEMPLATES;

  const match = source.find(
    item =>
      item.name.toLowerCase() ===
      (name || '').toLowerCase()
  );

  return match ? match.color : '#6366f1';
};

const getNextRenewal = (item, today) => {
  const day = Number(item.billingDay) || 1;

  if (item.period === 'yearly') {
    const month =
      (Number(item.billingMonth) || 1) - 1;

    let renewalDate = new Date(
      today.getFullYear(),
      month,
      day
    );

    if (renewalDate < today) {
      renewalDate = new Date(
        today.getFullYear() + 1,
        month,
        day
      );
    }

    return renewalDate;
  }

  let renewalDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    day
  );

  if (renewalDate < today) {
    renewalDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      day
    );
  }

  return renewalDate;
};

const normalizeText = (value = '') =>
  String(value)
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, ' ')
    .trim();

const confirmAction = message => {
  if (
    typeof window !== 'undefined' &&
    typeof window.confirm === 'function'
  ) {
    return window.confirm(message);
  }

  return true;
};

const isValidUrl = value => {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return [
      'http:',
      'https:'
    ].includes(url.protocol);
  } catch {
    return false;
  }
};

const getSubscriptionCostForMonth = (
  item,
  year,
  monthIndex,
  rates
) => {
  const priceTL = convertToTL(
    item.price,
    item.currency || 'TRY',
    rates
  );

  const startYear =
    Number(item.billingYear || year);

  const startMonth = Math.max(
    0,
    Math.min(
      11,
      Number(item.billingMonth || 1) - 1
    )
  );

  const targetKey =
    year * 12 + monthIndex;

  const startKey =
    startYear * 12 + startMonth;

  if (
    item.status === 'cancelled' ||
    targetKey < startKey
  ) {
    return 0;
  }

  if (item.period === 'monthly') {
    return priceTL;
  }

  return monthIndex === startMonth
    ? priceTL
    : 0;
};

export default function App() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;
  const isMobile = width < 480;

  const [isDarkMode, setIsDarkMode] =
    useState(true);

  const [subscriptions, setSubscriptions] =
    useState([]);

  const [exchangeRates, setExchangeRates] =
    useState(DEFAULT_RATES);

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [
    selectedPaymentFilter,
    setSelectedPaymentFilter
  ] = useState('ALL');

  const [
    selectedPeriodFilter,
    setSelectedPeriodFilter
  ] = useState('ALL');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [sortMode, setSortMode] =
    useState('renewal');

  const [
    templatesList,
    setTemplatesList
  ] = useState(DEFAULT_TEMPLATES);

  const [
    paymentMethodsList,
    setPaymentMethodsList
  ] = useState(DEFAULT_PAYMENT_METHODS);

  const [activeTab, setActiveTab] =
    useState('list');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const now = new Date();

  const clampedYear = Math.min(
    2030,
    Math.max(2025, now.getFullYear())
  );

  const [calMonth, setCalMonth] =
    useState(
      clampedYear === now.getFullYear()
        ? now.getMonth()
        : 0
    );

  const [calYear, setCalYear] =
    useState(clampedYear);

  const [
    selectedAnalysisYear,
    setSelectedAnalysisYear
  ] = useState(clampedYear);

  const [formName, setFormName] =
    useState('');

  const [formPrice, setFormPrice] =
    useState('');

  const [formCurrency, setFormCurrency] =
    useState('TRY');

  const [formDay, setFormDay] =
    useState('1');

  const [formMonth, setFormMonth] =
    useState('8');

  const [formYear, setFormYear] =
    useState(String(clampedYear));

  const [formCategory, setFormCategory] =
    useState('Eğlence');

  const [
    formPaymentMethod,
    setFormPaymentMethod
  ] = useState('Garanti Bonus');

  const [formPeriod, setFormPeriod] =
    useState('monthly');

  const [
    formCancelUrl,
    setFormCancelUrl
  ] = useState('');

  const [formColor, setFormColor] =
    useState('#6366F1');

  const [
    formNotificationDays,
    setFormNotificationDays
  ] = useState(2);

  const [
    showTemplateForm,
    setShowTemplateForm
  ] = useState(false);

  const [
    newTemplateName,
    setNewTemplateName
  ] = useState('');

  const [
    newTemplatePrice,
    setNewTemplatePrice
  ] = useState('');

  const [
    newTemplateCurrency,
    setNewTemplateCurrency
  ] = useState('TRY');

  const [
    newTemplateCategory,
    setNewTemplateCategory
  ] = useState('Diğer');

  const [
    showPaymentMethodForm,
    setShowPaymentMethodForm
  ] = useState(false);

  const [
    newPaymentMethodName,
    setNewPaymentMethodName
  ] = useState('');

  useEffect(() => {
    try {
      const savedSubscriptions =
        localStorage.getItem(
          'cebin_subscriptions_v5'
        );

      if (savedSubscriptions) {
        const parsedSubscriptions =
          JSON.parse(savedSubscriptions);

        setSubscriptions(
          Array.isArray(parsedSubscriptions)
            ? parsedSubscriptions
            : []
        );
      } else {
        setSubscriptions([]);
      }

      const savedRates =
        localStorage.getItem(
          'cebin_exchange_rates_v1'
        );

      if (savedRates) {
        const parsedRates =
          JSON.parse(savedRates);

        setExchangeRates({
          USD:
            Number(parsedRates.USD) ||
            DEFAULT_RATES.USD,
          EUR:
            Number(parsedRates.EUR) ||
            DEFAULT_RATES.EUR,
        });
      }

      const savedTemplates =
        localStorage.getItem(
          'cebin_templates_v1'
        );

      setTemplatesList(
        savedTemplates
          ? JSON.parse(savedTemplates)
          : DEFAULT_TEMPLATES
      );

      const savedMethods =
        localStorage.getItem(
          'cebin_payment_methods_v1'
        );

      setPaymentMethodsList(
        savedMethods
          ? JSON.parse(savedMethods)
          : DEFAULT_PAYMENT_METHODS
      );
    } catch (error) {
      console.log(
        'LocalStorage okuma hatası:',
        error
      );
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_subscriptions_v5',
        JSON.stringify(subscriptions)
      );
    } catch (error) {
      console.log(error);
    }
  }, [subscriptions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_templates_v1',
        JSON.stringify(templatesList)
      );
    } catch (error) {
      console.log(error);
    }
  }, [templatesList, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_payment_methods_v1',
        JSON.stringify(paymentMethodsList)
      );
    } catch (error) {
      console.log(error);
    }
  }, [paymentMethodsList, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_exchange_rates_v1',
        JSON.stringify(exchangeRates)
      );
    } catch (error) {
      console.log(error);
    }
  }, [exchangeRates, isLoaded]);

  const safeList =
    Array.isArray(subscriptions)
      ? subscriptions
      : [];

  const theme = isDarkMode
    ? {
        bg: '#0c1018',
        headerBg: '#141a24',
        cardBg: '#141a24',
        summaryBg: '#312e81',
        summaryBorder: '#4338ca',
        cardBorder: '#242c3b',
        textPrimary: '#eef1f6',
        textSecondary: '#b6bfcc',
        textMuted: '#8992a3',
        inputBg: '#0f1420',
        accent: '#4dabf7',
        danger: '#f87171',
      }
    : {
        bg: '#eef1f6',
        headerBg: '#ffffff',
        cardBg: '#ffffff',
        summaryBg: '#4f46e5',
        summaryBorder: '#6366f1',
        cardBorder: '#dfe3ea',
        textPrimary: '#1b2230',
        textSecondary: '#525c6e',
        textMuted: '#7c8798',
        inputBg: '#eef1f6',
        accent: '#2563eb',
        danger: '#dc2626',
      };

  const handleDelete = id => {
    const item = safeList.find(
      subscription =>
        subscription.id === id
    );

    const confirmed = confirmAction(
      `“${item?.name || 'Bu abonelik'}” kalıcı olarak silinsin mi?`
    );

    if (!confirmed) {
      return;
    }

    setSubscriptions(
      safeList.filter(
        subscription =>
          subscription.id !== id
      )
    );
  };

  const handleExportCSV = () => {
    if (safeList.length === 0) {
      alert(
        'Dışa aktarılacak abonelik bulunmuyor.'
      );

      return;
    }

    let csvContent =
      '\uFEFFServis Adi;Fiyat;Para Birimi;Kategori;Odeme Yontemi;Periyot;Odeme Gunu;Odeme Ayi;Odeme Yili\n';

    safeList.forEach(subscription => {
      csvContent +=
        `"${subscription.name}";` +
        `${subscription.price};` +
        `"${subscription.currency}";` +
        `"${subscription.category}";` +
        `"${subscription.paymentMethod}";` +
        `"${subscription.period}";` +
        `${subscription.billingDay};` +
        `${subscription.billingMonth};` +
        `${subscription.billingYear}\n`;
    });

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.setAttribute('href', url);

    link.setAttribute(
      'download',
      `cebin_abonelikler_${calYear}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const backup = {
      version: 1,
      exportedAt:
        new Date().toISOString(),
      subscriptions,
      templates: templatesList,
      paymentMethods:
        paymentMethodsList,
      exchangeRates
    };

    const dataString =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          backup,
          null,
          2
        )
      );

    const downloadElement =
      document.createElement('a');

    downloadElement.setAttribute(
      'href',
      dataString
    );

    downloadElement.setAttribute(
      'download',
      `cebin_yedek_${Date.now()}.json`
    );

    document.body.appendChild(
      downloadElement
    );

    downloadElement.click();

    document.body.removeChild(
      downloadElement
    );
  };

  const handleImportJSON = () => {
    if (typeof document === 'undefined') {
      return;
    }

    const input =
      document.createElement('input');

    input.type = 'file';

    input.accept =
      'application/json,.json';

    input.onchange = async event => {
      try {
        const file =
          event.target.files?.[0];

        if (!file) {
          return;
        }

        const fileText =
          await file.text();

        const parsed =
          JSON.parse(fileText);

        const importedSubscriptions =
          Array.isArray(parsed)
            ? parsed
            : parsed.subscriptions;

        if (
          !Array.isArray(
            importedSubscriptions
          )
        ) {
          throw new Error(
            'Geçersiz yedek biçimi'
          );
        }

        const confirmed =
          confirmAction(
            `${importedSubscriptions.length} kayıt içe aktarılacak ve mevcut liste değiştirilecek. Devam edilsin mi?`
          );

        if (!confirmed) {
          return;
        }

        setSubscriptions(
          importedSubscriptions
        );

        if (
          Array.isArray(
            parsed.templates
          )
        ) {
          setTemplatesList(
            parsed.templates
          );
        }

        if (
          Array.isArray(
            parsed.paymentMethods
          )
        ) {
          setPaymentMethodsList(
            parsed.paymentMethods
          );
        }

        if (
          parsed.exchangeRates
        ) {
          setExchangeRates({
            USD:
              Number(
                parsed.exchangeRates
                  .USD
              ) ||
              DEFAULT_RATES.USD,
            EUR:
              Number(
                parsed.exchangeRates
                  .EUR
              ) ||
              DEFAULT_RATES.EUR,
          });
        }

        alert(
          'Yedek başarıyla geri yüklendi.'
        );
      } catch (error) {
        alert(
          `Yedek yüklenemedi: ${error.message}`
        );
      }
    };

    input.click();
  };
    const filteredSubscriptions = safeList
    .filter(
      sub =>
        selectedPaymentFilter === 'ALL' ||
        sub.paymentMethod === selectedPaymentFilter
    )
    .filter(
      sub =>
        selectedPeriodFilter === 'ALL' ||
        sub.period === selectedPeriodFilter
    )
    .filter(sub => {
      const query = normalizeText(searchQuery);

      if (!query) {
        return true;
      }

      return [
        sub.name,
        sub.category,
        sub.paymentMethod,
        sub.currency
      ].some(value =>
        normalizeText(value).includes(query)
      );
    })
    .sort((a, b) => {
      if (sortMode === 'price-desc') {
        return (
          convertToTL(
            b.price,
            b.currency,
            exchangeRates
          ) -
          convertToTL(
            a.price,
            a.currency,
            exchangeRates
          )
        );
      }

      if (sortMode === 'name') {
        return String(a.name).localeCompare(
          String(b.name),
          'tr'
        );
      }

      return (
        getNextRenewal(a, new Date()) -
        getNextRenewal(b, new Date())
      );
    });

  const monthlyTotalTL = safeList.reduce(
    (sum, item) => {
      if (!item) {
        return sum;
      }

      const priceTL = convertToTL(
        item.price,
        item.currency || 'TRY',
        exchangeRates
      );

      return (
        sum +
        (
          item.period === 'yearly'
            ? priceTL / 12
            : priceTL
        )
      );
    },
    0
  );

  const getDetailedMonthlyBreakdown =
    targetYear => {
      const monthlyTotals =
        Array(12).fill(0);

      const monthlyDominantColor =
        Array(12).fill('#6366f1');

      for (
        let monthIndex = 0;
        monthIndex < 12;
        monthIndex += 1
      ) {
        let monthSum = 0;

        const categorySumsInMonth = {};

        safeList.forEach(item => {
          const itemCategory =
            item.category || 'Diğer';

          const cost =
            getSubscriptionCostForMonth(
              item,
              targetYear,
              monthIndex,
              exchangeRates
            );

          if (cost > 0) {
            monthSum += cost;

            categorySumsInMonth[
              itemCategory
            ] =
              (
                categorySumsInMonth[
                  itemCategory
                ] || 0
              ) + cost;
          }
        });

        monthlyTotals[monthIndex] =
          monthSum;

        let maximumCategoryAmount = 0;

        let dominantCategory =
          'Eğlence';

        Object.entries(
          categorySumsInMonth
        ).forEach(
          ([category, amount]) => {
            if (
              amount >
              maximumCategoryAmount
            ) {
              maximumCategoryAmount =
                amount;

              dominantCategory =
                category;
            }
          }
        );

        if (
          maximumCategoryAmount > 0
        ) {
          monthlyDominantColor[
            monthIndex
          ] =
            CATEGORY_COLORS[
              dominantCategory
            ] || '#6366f1';
        }
      }

      return {
        monthlyTotals,
        monthlyDominantColor
      };
    };

  const {
    monthlyTotals,
    monthlyDominantColor
  } = getDetailedMonthlyBreakdown(
    selectedAnalysisYear
  );

  const totalYearlyExpenseForSelectedYear =
    monthlyTotals.reduce(
      (total, amount) =>
        total + amount,
      0
    );

  const maxMonthlyExpense = Math.max(
    ...monthlyTotals,
    1
  );

  const monthsWithSpending =
    monthlyTotals.filter(
      value => value > 0
    ).length;

  const averageMonthlyExpense =
    monthsWithSpending > 0
      ? totalYearlyExpenseForSelectedYear /
        monthsWithSpending
      : 0;

  const yearlyPaymentMethodStats =
    safeList.reduce(
      (accumulator, item) => {
        const method =
          item.paymentMethod || 'Diğer';

        const amount = Array.from(
          { length: 12 },
          (_, monthIndex) =>
            getSubscriptionCostForMonth(
              item,
              selectedAnalysisYear,
              monthIndex,
              exchangeRates
            )
        ).reduce(
          (sum, value) =>
            sum + value,
          0
        );

        if (amount > 0) {
          accumulator[method] =
            (
              accumulator[method] || 0
            ) + amount;
        }

        return accumulator;
      },
      {}
    );

  const yearlyCategoryStats =
    safeList.reduce(
      (accumulator, item) => {
        const category =
          item.category || 'Diğer';

        const amount = Array.from(
          { length: 12 },
          (_, monthIndex) =>
            getSubscriptionCostForMonth(
              item,
              selectedAnalysisYear,
              monthIndex,
              exchangeRates
            )
        ).reduce(
          (sum, value) =>
            sum + value,
          0
        );

        if (amount > 0) {
          accumulator[category] =
            (
              accumulator[category] || 0
            ) + amount;
        }

        return accumulator;
      },
      {}
    );

  const sortedPaymentMethodEntries =
    Object.entries(
      yearlyPaymentMethodStats
    ).sort(
      (a, b) => b[1] - a[1]
    );

  const sortedCategoryEntries =
    Object.entries(
      yearlyCategoryStats
    ).sort(
      (a, b) => b[1] - a[1]
    );

  const topCategoryLabel =
    sortedCategoryEntries[0]?.[0] ||
    '-';

  const mostExpensiveSub =
    safeList.reduce(
      (top, item) => {
        const priceTL = convertToTL(
          item.price,
          item.currency || 'TRY',
          exchangeRates
        );

        const monthlyEquivalent =
          item.period === 'yearly'
            ? priceTL / 12
            : priceTL;

        if (
          !top ||
          monthlyEquivalent >
            top.monthlyEquivalent
        ) {
          return {
            item,
            monthlyEquivalent
          };
        }

        return top;
      },
      null
    );

  const todayForRenewals =
    new Date();

  const upcomingRenewals =
    safeList
      .map(item => {
        const nextDate =
          getNextRenewal(
            item,
            todayForRenewals
          );

        const startOfToday =
          new Date(
            todayForRenewals.getFullYear(),
            todayForRenewals.getMonth(),
            todayForRenewals.getDate()
          );

        const daysUntil =
          Math.round(
            (
              nextDate -
              startOfToday
            ) / 86400000
          );

        return {
          item,
          nextDate,
          daysUntil
        };
      })
      .filter(
        renewal =>
          renewal.daysUntil >= 0 &&
          renewal.daysUntil <= 14
      )
      .sort(
        (a, b) =>
          a.daysUntil -
          b.daysUntil
      );

  const openForm = (
    item = null
  ) => {
    if (item) {
      setEditingId(item.id);
      setFormName(item.name || '');

      setFormPrice(
        String(item.price || '')
      );

      setFormCurrency(
        item.currency || 'TRY'
      );

      setFormDay(
        String(
          item.billingDay || '1'
        )
      );

      setFormMonth(
        String(
          item.billingMonth || '8'
        )
      );

      setFormYear(
        String(
          item.billingYear ||
          clampedYear
        )
      );

      setFormCategory(
        item.category || 'Eğlence'
      );

      setFormPaymentMethod(
        item.paymentMethod ||
        paymentMethodsList[0]
      );

      setFormPeriod(
        item.period || 'monthly'
      );

      setFormCancelUrl(
        item.cancelUrl || ''
      );

      setFormColor(
        item.color ||
        getServiceColor(
          item.name,
          templatesList
        )
      );

      setFormNotificationDays(
        item.notificationDays !==
        undefined
          ? item.notificationDays
          : 2
      );
    } else {
      setEditingId(null);
      setFormName('');
      setFormPrice('');
      setFormCurrency('TRY');
      setFormDay('1');
      setFormMonth(
        String(calMonth + 1)
      );
      setFormYear(
        String(calYear)
      );
      setFormCategory('Eğlence');

      setFormPaymentMethod(
        paymentMethodsList[0] ||
        'Garanti Bonus'
      );

      setFormPeriod('monthly');
      setFormCancelUrl('');
      setFormColor('#6366F1');

      setFormNotificationDays(2);
    }

    setShowTemplateForm(false);

    setShowPaymentMethodForm(false);

    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    const numericPrice =
      Number(
        String(formPrice).replace(
          ',',
          '.'
        )
      );

    const numericDay =
      Number(formDay);

    const numericMonth =
      Number(formMonth);

    const numericYear =
      Number(formYear);

    if (!formName.trim()) {
      alert(
        'Lütfen servis adını giriniz.'
      );

      return;
    }

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <= 0
    ) {
      alert(
        'Lütfen sıfırdan büyük geçerli bir fiyat giriniz.'
      );

      return;
    }

    if (
      numericDay < 1 ||
      numericDay > 31
    ) {
      alert(
        'Ödeme günü 1 ile 31 arasında olmalıdır.'
      );

      return;
    }

    if (
      numericMonth < 1 ||
      numericMonth > 12
    ) {
      alert(
        'Ödeme ayı 1 ile 12 arasında olmalıdır.'
      );

      return;
    }

    if (
      !YEARS.includes(
        numericYear
      )
    ) {
      alert(
        'Lütfen geçerli bir ödeme yılı seçiniz.'
      );

      return;
    }

    if (
      !formPaymentMethod
    ) {
      alert(
        'Lütfen bir ödeme yöntemi seçiniz.'
      );

      return;
    }

    if (
      !isValidUrl(
        formCancelUrl
      )
    ) {
      alert(
        'İptal bağlantısı http:// veya https:// ile başlayan geçerli bir adres olmalıdır.'
      );

      return;
    }

    const existingItem =
      safeList.find(
        item =>
          item.id === editingId
      );

    const payload = {
      ...existingItem,

      id:
        editingId ||
        String(Date.now()),

      name: formName.trim(),

      price: String(
        numericPrice
      ),

      currency:
        formCurrency,

      billingDay:
        String(numericDay),

      billingMonth:
        String(numericMonth),

      billingYear:
        String(numericYear),

      category:
        formCategory,

      paymentMethod:
        formPaymentMethod,

      period:
        formPeriod,

      cancelUrl:
        formCancelUrl.trim(),

      color:
        formColor,

      notificationDays:
        formNotificationDays,

      status:
        existingItem?.status ||
        'active',
    };

    setSubscriptions(
      editingId
        ? safeList.map(item =>
            item.id === editingId
              ? payload
              : item
          )
        : [
            ...safeList,
            payload
          ]
    );

    setIsModalOpen(false);
  };

  const addTemplate = () => {
    const numericPrice =
      Number(
        String(
          newTemplatePrice
        ).replace(',', '.')
      );

    if (
      !newTemplateName.trim()
    ) {
      alert(
        'Lütfen şablon adını giriniz.'
      );

      return;
    }

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <= 0
    ) {
      alert(
        'Lütfen geçerli bir şablon fiyatı giriniz.'
      );

      return;
    }

    const templateExists =
      templatesList.some(
        template =>
          normalizeText(
            template.name
          ) ===
          normalizeText(
            newTemplateName
          )
      );

    if (templateExists) {
      alert(
        'Bu isimde bir şablon zaten bulunuyor.'
      );

      return;
    }

    const color =
      TEMPLATE_COLOR_PALETTE[
        templatesList.length %
        TEMPLATE_COLOR_PALETTE.length
      ];

    setTemplatesList([
      ...templatesList,
      {
        name:
          newTemplateName.trim(),

        price:
          String(numericPrice),

        currency:
          newTemplateCurrency,

        category:
          newTemplateCategory,

        color,
      }
    ]);

    setNewTemplateName('');
    setNewTemplatePrice('');
    setNewTemplateCurrency('TRY');

    setNewTemplateCategory(
      'Diğer'
    );

    setShowTemplateForm(false);
  };

  const removeTemplate =
    index => {
      const template =
        templatesList[index];

      const confirmed =
        confirmAction(
          `“${template?.name || 'Şablon'}” şablonu silinsin mi?`
        );

      if (!confirmed) {
        return;
      }

      setTemplatesList(
        templatesList.filter(
          (_, currentIndex) =>
            currentIndex !== index
        )
      );
    };

  const addPaymentMethod =
    () => {
      const name =
        newPaymentMethodName.trim();

      if (!name) {
        alert(
          'Lütfen ödeme yöntemi adını giriniz.'
        );

        return;
      }

      const methodExists =
        paymentMethodsList.some(
          method =>
            normalizeText(method) ===
            normalizeText(name)
        );

      if (methodExists) {
        alert(
          'Bu ödeme yöntemi zaten bulunuyor.'
        );

        return;
      }

      setPaymentMethodsList([
        ...paymentMethodsList,
        name
      ]);

      setFormPaymentMethod(name);

      setNewPaymentMethodName('');

      setShowPaymentMethodForm(false);
    };

  const removePaymentMethod =
    method => {
      const usageCount =
        safeList.filter(
          item =>
            item.paymentMethod ===
            method
        ).length;

      if (usageCount > 0) {
        alert(
          `Bu ödeme yöntemi ${usageCount} abonelikte kullanılıyor. Önce ilgili abonelikleri güncelleyin.`
        );

        return;
      }

      const confirmed =
        confirmAction(
          `“${method}” ödeme yöntemi silinsin mi?`
        );

      if (!confirmed) {
        return;
      }

      const updatedMethods =
        paymentMethodsList.filter(
          item =>
            item !== method
        );

      setPaymentMethodsList(
        updatedMethods
      );

      if (
        formPaymentMethod ===
        method
      ) {
        setFormPaymentMethod(
          updatedMethods[0] || ''
        );
      }

      if (
        selectedPaymentFilter ===
        method
      ) {
        setSelectedPaymentFilter(
          'ALL'
        );
      }
    };

  const daysInCurrentMonth =
    getDaysInMonth(
      calMonth,
      calYear
    );

  const firstDayOffset =
    (
      new Date(
        calYear,
        calMonth,
        1
      ).getDay() + 6
    ) % 7;

  const s = createStyles(
    theme,
    isMobile
  );

  return (
    <SafeAreaView
      style={[
        s.container,
        {
          backgroundColor:
            theme.bg
        }
      ]}
    >
      <StatusBar
        barStyle={
          isDarkMode
            ? 'light-content'
            : 'dark-content'
        }
      />

      <View
        style={[
          s.appWrapper,
          isDesktop &&
            s.appWrapperDesktop
        ]}
      >
        {isDesktop && (
          <View
            style={[
              s.sidebarContainer,
              {
                backgroundColor:
                  theme.headerBg,

                borderRightColor:
                  theme.cardBorder
              }
            ]}
          >
            <View
              style={
                s.sidebarHeader
              }
            >
              <Text
                style={[
                  s.headerTitle,
                  {
                    color:
                      theme.textPrimary
                  }
                ]}
              >
                Cebin
              </Text>

              <View
                style={s.proBadge}
              >
                <Text
                  style={
                    s.proBadgeText
                  }
                >
                  PRO
                </Text>
              </View>
            </View>

            <Text
              style={[
                s.headerSubtitle,
                {
                  color:
                    theme.textSecondary,

                  marginBottom: 24
                }
              ]}
            >
              Akıllı Abonelik & Bütçe Asistanı
            </Text>

            <View
              style={
                s.sidebarNavGroup
              }
            >
              {[
                {
                  key: 'list',
                  icon: '💳',
                  label:
                    'Abonelikler'
                },
                {
                  key: 'calendar',
                  icon: '📅',
                  label: 'Takvim'
                },
                {
                  key: 'analytics',
                  icon: '📊',
                  label:
                    'Analiz & Raporlar'
                },
              ].map(nav => (
                <TouchableOpacity
                  key={nav.key}
                  style={[
                    s.sidebarNavBtn,

                    activeTab ===
                      nav.key &&
                      s.sidebarNavBtnActive
                  ]}
                  onPress={() =>
                    setActiveTab(
                      nav.key
                    )
                  }
                >
                  <Text
                    style={{
                      fontSize: 18
                    }}
                  >
                    {nav.icon}
                  </Text>

                  <Text
                    style={[
                      s.sidebarNavText,
                      {
                        color:
                          activeTab ===
                          nav.key
                            ? '#6366f1'
                            : theme.textSecondary
                      }
                    ]}
                  >
                    {nav.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                marginTop: 'auto',
                gap: 8
              }}
            >
              <TouchableOpacity
                style={[
                  s.exportBtn,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder,

                    borderWidth: 1
                  }
                ]}
                onPress={
                  handleExportCSV
                }
              >
                <Text
                  style={{
                    color:
                      theme.textPrimary,

                    fontSize: 12,

                    fontWeight:
                      'bold'
                  }}
                >
                  📄 CSV Excel İndir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.exportBtn,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder,

                    borderWidth: 1
                  }
                ]}
                onPress={
                  handleExportJSON
                }
              >
                <Text
                  style={{
                    color:
                      theme.accent,

                    fontSize: 12,

                    fontWeight:
                      'bold'
                  }}
                >
                  💾 JSON Yedek Al
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.exportBtn,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder,

                    borderWidth: 1
                  }
                ]}
                onPress={
                  handleImportJSON
                }
              >
                <Text
                  style={{
                    color:
                      theme.textSecondary,

                    fontSize: 12,

                    fontWeight:
                      'bold'
                  }}
                >
                  ↩️ Yedeği Geri Yükle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.addBtn}
                onPress={() =>
                  openForm()
                }
              >
                <Text
                  style={
                    s.addBtnText
                  }
                >
                  + Yeni Abonelik Ekle
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View
          style={[
            s.responsiveWrapper,
            activeTab === 'calendar' && {
              maxWidth: 1040
            }
          ]}
        >
          <View
            style={[
              s.header,
              {
                backgroundColor:
                  theme.headerBg,

                borderBottomColor:
                  theme.cardBorder
              }
            ]}
          >
            <View>
              <Text
                style={[
                  s.headerTitle,
                  {
                    color:
                      theme.textPrimary
                  }
                ]}
              >
                Cebin
              </Text>

              <Text
                style={[
                  s.headerSubtitle,
                  {
                    color:
                      theme.textSecondary
                  }
                ]}
              >
                Abonelik & Sabit Gider Takibi
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}
            >
              <TouchableOpacity
                style={[
                  s.themeToggleIconBtn,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={() =>
                  setIsDarkMode(
                    !isDarkMode
                  )
                }
              >
                <Text
                  style={{
                    fontSize: 18
                  }}
                >
                  {isDarkMode
                    ? '☀️'
                    : '🌙'}
                </Text>
              </TouchableOpacity>

              {!isDesktop && (
                <TouchableOpacity
                  style={s.addBtn}
                  onPress={() =>
                    openForm()
                  }
                >
                  <Text
                    style={
                      s.addBtnText
                    }
                  >
                    + Ekle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[
              s.scrollContent,
              isDesktop && {
                paddingBottom: 40
              }
            ]}
          >
            {activeTab !==
              'analytics' && (
              <View
                style={[
                  s.currencyBar,
                  {
                    backgroundColor:
                      theme.cardBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
              >
                <Text
                  style={[
                    s.currencyBarTitle,
                    {
                      color:
                        theme.textSecondary
                    }
                  ]}
                >
                  💱 Kullanılan Kurlar:
                </Text>

                <View
                  style={
                    s.currencyBadgeGroup
                  }
                >
                  <View
                    style={
                      s.currencyBadge
                    }
                  >
                    <Text
                      style={
                        s.currencyBadgeText
                      }
                    >
                      USD: {exchangeRates.USD} ₺
                    </Text>
                  </View>

                  <View
                    style={
                      s.currencyBadge
                    }
                  >
                    <Text
                      style={
                        s.currencyBadgeText
                      }
                    >
                      EUR: {exchangeRates.EUR} ₺
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab ===
              'list' && (
              <>
                <View
                  style={[
                    s.summaryCard,
                    {
                      backgroundColor:
                        theme.summaryBg,

                      borderColor:
                        theme.summaryBorder
                    }
                  ]}
                >
                  <Text
                    style={
                      s.summaryLabel
                    }
                  >
                    Toplam Aylık Taahhüt
                  </Text>

                  <Text
                    style={
                      s.summaryValue
                    }
                  >
                    {formatCurrency(
                      monthlyTotalTL,
                      'TRY'
                    )}
                  </Text>

                  <View
                    style={s.statsRow}
                  >
                    <View
                      style={
                        s.statBox
                      }
                    >
                      <Text
                        style={
                          s.statLabel
                        }
                      >
                        Günlük Tahmini Maliyet
                      </Text>

                      <Text
                        style={
                          s.statValue
                        }
                      >
                        {formatCurrency(
                          monthlyTotalTL /
                            30,
                          'TRY'
                        )}
                      </Text>
                    </View>

                    <View
                      style={
                        s.statBox
                      }
                    >
                      <Text
                        style={
                          s.statLabel
                        }
                      >
                        Yıllık Projeksiyon
                      </Text>

                      <Text
                        style={
                          s.statValue
                        }
                      >
                        {formatCurrency(
                          monthlyTotalTL *
                            12,
                          'TRY'
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={
                    s.listToolbar
                  }
                >
                  <TextInput
                    style={[
                      s.searchInput,
                      {
                        backgroundColor:
                          theme.inputBg,

                        color:
                          theme.textPrimary,

                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                    placeholder="Abonelik, kategori veya kart ara..."
                    placeholderTextColor={
                      theme.textMuted
                    }
                    value={
                      searchQuery
                    }
                    onChangeText={
                      setSearchQuery
                    }
                  />

                  <View
                    style={
                      s.compactFilterRow
                    }
                  >
                    {[
                      {
                        key: 'ALL',
                        label: 'Tümü'
                      },
                      {
                        key: 'monthly',
                        label: 'Aylık'
                      },
                      {
                        key: 'yearly',
                        label: 'Yıllık'
                      },
                    ].map(option => (
                      <TouchableOpacity
                        key={
                          option.key
                        }
                        style={[
                          s.filterChip,
                          {
                            backgroundColor:
                              theme.cardBg,

                            borderColor:
                              theme.cardBorder
                          },

                          selectedPeriodFilter ===
                            option.key &&
                            s.filterChipActive
                        ]}
                        onPress={() =>
                          setSelectedPeriodFilter(
                            option.key
                          )
                        }
                      >
                        <Text
                          style={[
                            s.filterChipText,
                            {
                              color:
                                theme.textSecondary
                            },

                            selectedPeriodFilter ===
                              option.key &&
                              s.filterChipTextActive
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    {[
                      {
                        key: 'renewal',
                        label:
                          'Tarihe göre'
                      },
                      {
                        key: 'price-desc',
                        label:
                          'Fiyata göre'
                      },
                      {
                        key: 'name',
                        label:
                          'Ada göre'
                      },
                    ].map(option => (
                      <TouchableOpacity
                        key={
                          option.key
                        }
                        style={[
                          s.filterChip,
                          {
                            backgroundColor:
                              theme.cardBg,

                            borderColor:
                              theme.cardBorder
                          },

                          sortMode ===
                            option.key &&
                            s.filterChipActive
                        ]}
                        onPress={() =>
                          setSortMode(
                            option.key
                          )
                        }
                      >
                        <Text
                          style={[
                            s.filterChipText,
                            {
                              color:
                                theme.textSecondary
                            },

                            sortMode ===
                              option.key &&
                              s.filterChipTextActive
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 14
                  }}
                >
                  <Text
                    style={{
                      color:
                        theme.textPrimary,

                      fontSize: 12,

                      fontWeight:
                        'bold',

                      marginBottom: 6
                    }}
                  >
                    💳 Ödeme Yöntemine Göre Filtrele:
                  </Text>

                  <View
                    style={{
                      flexDirection:
                        'row',

                      flexWrap: 'wrap',

                      gap: 6
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        s.filterChip,
                        {
                          backgroundColor:
                            theme.cardBg,

                          borderColor:
                            theme.cardBorder
                        },

                        selectedPaymentFilter ===
                          'ALL' &&
                          s.filterChipActive
                      ]}
                      onPress={() =>
                        setSelectedPaymentFilter(
                          'ALL'
                        )
                      }
                    >
                      <Text
                        style={[
                          s.filterChipText,
                          {
                            color:
                              theme.textSecondary
                          },

                          selectedPaymentFilter ===
                            'ALL' &&
                            s.filterChipTextActive
                        ]}
                      >
                        Tüm Kartlar
                      </Text>
                    </TouchableOpacity>

                    {paymentMethodsList.map(
                      method => (
                        <TouchableOpacity
                          key={
                            method
                          }
                          style={[
                            s.filterChip,
                            {
                              backgroundColor:
                                theme.cardBg,

                              borderColor:
                                theme.cardBorder
                            },

                            selectedPaymentFilter ===
                              method &&
                              s.filterChipActive
                          ]}
                          onPress={() =>
                            setSelectedPaymentFilter(
                              method
                            )
                          }
                        >
                          <Text
                            style={[
                              s.filterChipText,
                              {
                                color:
                                  theme.textSecondary
                              },

                              selectedPaymentFilter ===
                                method &&
                                s.filterChipTextActive
                            ]}
                          >
                            {method}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>

                <Text
                  style={[
                    s.sectionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Kayıtlı Abonelikler ({filteredSubscriptions.length})
                </Text>

                {filteredSubscriptions.length ===
                0 ? (
                  <View
                    style={[
                      s.emptyCard,
                      {
                        backgroundColor:
                          theme.cardBg,

                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        marginBottom: 8
                      }}
                    >
                      💳
                    </Text>

                    <Text
                      style={{
                        color:
                          theme.textPrimary,

                        fontWeight:
                          'bold',

                        fontSize: 16
                      }}
                    >
                      Abonelik Bulunamadı
                    </Text>

                    <Text
                      style={{
                        color:
                          theme.textSecondary,

                        fontSize: 12,

                        marginTop: 4,

                        textAlign:
                          'center'
                      }}
                    >
                      Arama veya filtrelere uygun kayıt bulunamadı. Filtreleri temizleyebilir ya da yeni abonelik ekleyebilirsiniz.
                    </Text>
                  </View>
                ) : (
                  filteredSubscriptions.map(
                    item => {
                      const priceInTL =
                        convertToTL(
                          item.price,

                          item.currency ||
                            'TRY',

                          exchangeRates
                        );

                      const isYearly =
                        item.period ===
                        'yearly';

                      const notifOpt =
                        NOTIFICATION_OPTIONS.find(
                          option =>
                            option.value ===
                            item.notificationDays
                        ) ||
                        NOTIFICATION_OPTIONS[3];

                      const serviceColor =
                        item.color ||
                        getServiceColor(
                          item.name,
                          templatesList
                        );

                      return (
                        <View
                          key={
                            item.id
                          }
                          style={[
                            s.card,
                            {
                              backgroundColor:
                                theme.cardBg,

                              borderColor:
                                theme.cardBorder
                            }
                          ]}
                        >
                          <View
                            style={
                              s.leftSection
                            }
                          >
                            <View
                              style={[
                                s.brandIconBox,
                                {
                                  backgroundColor:
                                    serviceColor
                                }
                              ]}
                            >
                              <Text
                                style={
                                  s.brandIconText
                                }
                              >
                                {item.name
                                  ? item.name
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()
                                  : 'C'}
                              </Text>
                            </View>

                            <View
                              style={{
                                flex: 1
                              }}
                            >
                              <View
                                style={{
                                  flexDirection:
                                    'row',

                                  alignItems:
                                    'center',

                                  gap: 6,

                                  flexWrap:
                                    'wrap'
                                }}
                              >
                                <Text
                                  style={[
                                    s.cardTitle,
                                    {
                                      color:
                                        theme.textPrimary
                                    }
                                  ]}
                                >
                                  {item.name}
                                </Text>

                                {item.paymentMethod && (
                                  <View
                                    style={[
                                      s.cardTag,
                                      {
                                        backgroundColor:
                                          theme.inputBg,

                                        borderColor:
                                          theme.cardBorder,

                                        borderWidth: 1
                                      }
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        s.cardTagText,
                                        {
                                          color:
                                            theme.textSecondary
                                        }
                                      ]}
                                    >
                                      💳 {item.paymentMethod}
                                    </Text>
                                  </View>
                                )}

                                {notifOpt.value !==
                                  -1 && (
                                  <View
                                    style={[
                                      s.cardTag,
                                      {
                                        backgroundColor:
                                          theme.inputBg,

                                        borderColor:
                                          theme.cardBorder,

                                        borderWidth: 1
                                      }
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        s.cardTagText,
                                        {
                                          color:
                                            theme.accent
                                        }
                                      ]}
                                    >
                                      {notifOpt.badgeLabel}
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <Text
                                style={[
                                  s.cardSubtitle,
                                  {
                                    color:
                                      theme.textSecondary
                                  }
                                ]}
                              >
                                {item.category} •{' '}
                                {isYearly
                                  ? `${item.billingDay}/${item.billingMonth}/${item.billingYear}`
                                  : `Her ayın ${item.billingDay}. günü`}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={
                              s.rightSection
                            }
                          >
                            <Text
                              style={[
                                s.price,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {formatCurrency(
                                item.price,
                                item.currency ||
                                  'TRY'
                              )}{' '}
                              {isYearly
                                ? '/yıl'
                                : '/ay'}
                            </Text>

                            {item.currency !==
                              'TRY' && (
                              <Text
                                style={{
                                  fontSize: 12,

                                  fontWeight:
                                    'bold',

                                  color:
                                    theme.accent,

                                  marginTop: 1
                                }}
                              >
                                ≈{' '}
                                {formatCurrency(
                                  priceInTL,
                                  'TRY'
                                )}
                              </Text>
                            )}

                            <View
                              style={
                                s.actionButtons
                              }
                            >
                              <TouchableOpacity
                                style={[
                                  s.editBtn,
                                  {
                                    backgroundColor:
                                      theme.inputBg,

                                    borderColor:
                                      theme.cardBorder,

                                    borderWidth: 1
                                  }
                                ]}
                                onPress={() =>
                                  openForm(
                                    item
                                  )
                                }
                              >
                                <Text
                                  style={{
                                    color:
                                      theme.textSecondary,

                                    fontSize: 11,

                                    fontWeight:
                                      'bold'
                                  }}
                                >
                                  Düzenle
                                </Text>
                              </TouchableOpacity>

                              {item.cancelUrl ? (
                                <TouchableOpacity
                                  style={[
                                    s.cancelBtn,
                                    {
                                      backgroundColor:
                                        theme.inputBg,

                                      borderColor:
                                        theme.cardBorder,

                                      borderWidth: 1
                                    }
                                  ]}
                                  onPress={() =>
                                    Linking.openURL(
                                      item.cancelUrl
                                    )
                                  }
                                >
                                  <Text
                                    style={[
                                      s.cancelText,
                                      {
                                        color:
                                          theme.accent
                                      }
                                    ]}
                                  >
                                    İptal 🔗
                                  </Text>
                                </TouchableOpacity>
                              ) : null}

                              <TouchableOpacity
                                onPress={() =>
                                  handleDelete(
                                    item.id
                                  )
                                }
                                style={[
                                  s.deleteBtn,
                                  {
                                    backgroundColor:
                                      theme.inputBg,

                                    borderColor:
                                      theme.cardBorder,

                                    borderWidth: 1
                                  }
                                ]}
                              >
                                <Text
                                  style={{
                                    color:
                                      theme.danger,

                                    fontSize: 12
                                  }}
                                >
                                  🗑️
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  )
                )}
              </>
            )}

            {activeTab ===
              'calendar' && (
              <View
                style={{
                  marginTop: 10
                }}
              >
                <View
                  style={
                    s.calendarHeaderNav
                  }
                >
                  <TouchableOpacity
                    style={[
                      s.arrowBtn,
                      {
                        backgroundColor:
                          theme.inputBg,

                        borderColor:
                          theme.cardBorder,

                        borderWidth: 1
                      }
                    ]}
                    onPress={() => {
                      if (
                        calMonth === 0
                      ) {
                        setCalMonth(
                          11
                        );

                        setCalYear(
                          Math.max(
                            2025,
                            calYear -
                              1
                          )
                        );
                      } else {
                        setCalMonth(
                          calMonth -
                            1
                        );
                      }
                    }}
                  >
                    <Text
                      style={[
                        s.arrowText,
                        {
                          color:
                            theme.accent
                        }
                      ]}
                    >
                      ◀ Önceki
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[
                      s.calendarTitleText,
                      {
                        color:
                          theme.textPrimary
                      }
                    ]}
                  >
                    {MONTH_NAMES[calMonth]} {calYear}
                  </Text>

                  <TouchableOpacity
                    style={[
                      s.arrowBtn,
                      {
                        backgroundColor:
                          theme.inputBg,

                        borderColor:
                          theme.cardBorder,

                        borderWidth: 1
                      }
                    ]}
                    onPress={() => {
                      if (
                        calMonth === 11
                      ) {
                        setCalMonth(
                          0
                        );

                        setCalYear(
                          Math.min(
                            2030,
                            calYear +
                              1
                          )
                        );
                      } else {
                        setCalMonth(
                          calMonth +
                            1
                        );
                      }
                    }}
                  >
                    <Text
                      style={[
                        s.arrowText,
                        {
                          color:
                            theme.accent
                        }
                      ]}
                    >
                      Sonraki ▶
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  style={{
                    marginBottom: 16
                  }}
                >
                  {YEARS.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        s.yearChip,
                        {
                          backgroundColor:
                            theme.cardBg,

                          borderColor:
                            theme.cardBorder,

                          borderWidth: 1
                        },

                        calYear ===
                          year &&
                          s.yearChipActive
                      ]}
                      onPress={() =>
                        setCalYear(
                          year
                        )
                      }
                    >
                      <Text
                        style={[
                          s.yearChipText,
                          {
                            color:
                              theme.textSecondary
                          },

                          calYear ===
                            year &&
                            s.yearChipTextActive
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View
                  style={
                    s.calendarWrapper
                  }
                >
                  <View
                    style={
                      s.weekHeaderRow
                    }
                  >
                    {[
                      'Pzt',
                      'Sal',
                      'Çar',
                      'Per',
                      'Cum',
                      'Cmt',
                      'Paz'
                    ].map(
                      (
                        dayName,
                        index
                      ) => (
                        <View
                          key={
                            index
                          }
                          style={
                            s.weekHeaderCell
                          }
                        >
                          <Text
                            style={[
                              s.weekHeaderText,
                              {
                                color:
                                  theme.textSecondary
                              }
                            ]}
                          >
                            {dayName}
                          </Text>
                        </View>
                      )
                    )}
                  </View>

                  <View
                    style={
                      s.calendarGrid
                    }
                  >
                    {Array.from({
                      length:
                        firstDayOffset
                    }).map(
                      (
                        _,
                        index
                      ) => (
                        <View
                          key={`empty-${index}`}
                          style={[
                            s.calendarDayBox,
                            s.calendarEmptyDay,
                            {
                              borderColor:
                                'transparent'
                            }
                          ]}
                        />
                      )
                    )}

                    {Array.from({
                      length:
                        daysInCurrentMonth
                    }).map(
                      (
                        _,
                        index
                      ) => {
                        const dayNumber =
                          index + 1;

                        const subscriptionsOnDay =
                          safeList.filter(
                            subscription => {
                              if (
                                subscription.period ===
                                'monthly'
                              ) {
                                return (
                                  Number(
                                    subscription.billingDay
                                  ) ===
                                  dayNumber
                                );
                              }

                              if (
                                subscription.period ===
                                'yearly'
                              ) {
                                return (
                                  Number(
                                    subscription.billingDay
                                  ) ===
                                    dayNumber &&
                                  Number(
                                    subscription.billingMonth
                                  ) ===
                                    calMonth +
                                      1 &&
                                  Number(
                                    subscription.billingYear
                                  ) ===
                                    calYear
                                );
                              }

                              return false;
                            }
                          );

                        return (
                          <View
                            key={
                              dayNumber
                            }
                            style={[
                              s.calendarDayBox,
                              {
                                backgroundColor:
                                  theme.cardBg,

                                borderColor:
                                  theme.cardBorder
                              },

                              subscriptionsOnDay.length >
                                0 &&
                                s.activeDayBox
                            ]}
                          >
                            <Text
                              style={[
                                s.dayNumber,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {dayNumber}
                            </Text>

                            {subscriptionsOnDay.map(
                              (
                                subscription,
                                subscriptionIndex
                              ) => (
                                <View
                                  key={
                                    subscriptionIndex
                                  }
                                  style={[
                                    s.daySubBadge,
                                    {
                                      backgroundColor:
                                        subscription.color ||
                                        getServiceColor(
                                          subscription.name,
                                          templatesList
                                        )
                                    }
                                  ]}
                                >
                                  <Text
                                    style={
                                      s.daySubText
                                    }
                                    numberOfLines={
                                      1
                                    }
                                  >
                                    {subscription.name}
                                  </Text>

                                  <Text
                                    style={
                                      s.daySubPrice
                                    }
                                  >
                                    {formatShortCurrency(
                                      convertToTL(
                                        subscription.price,

                                        subscription.currency,

                                        exchangeRates
                                      )
                                    )}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>
              </View>
            )}
            {activeTab === 'analytics' && (
              <View style={{ marginTop: 4 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: theme.textPrimary,
                    marginBottom: 4
                  }}
                >
                  Finansal Analiz & Raporlar
                </Text>

                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 13,
                    marginBottom: 16
                  }}
                >
                  Aylık harcama dağılımları, ödeme yöntemi analizi ve trendler (2025 - 2030)
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 16 }}
                >
                  {YEARS.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        s.yearChip,
                        {
                          backgroundColor: theme.cardBg,
                          borderColor: theme.cardBorder,
                          borderWidth: 1
                        },
                        selectedAnalysisYear === year &&
                          s.yearChipActive
                      ]}
                      onPress={() =>
                        setSelectedAnalysisYear(year)
                      }
                    >
                      <Text
                        style={[
                          s.yearChipText,
                          {
                            color: theme.textSecondary
                          },
                          selectedAnalysisYear === year &&
                            s.yearChipTextActive
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={s.summaryMiniRow}>
                  <View
                    style={[
                      s.summaryMiniCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        s.summaryMiniLabel,
                        {
                          color: theme.textSecondary
                        }
                      ]}
                    >
                      Aylık Ortalama
                    </Text>

                    <Text
                      style={[
                        s.summaryMiniValue,
                        {
                          color: theme.textPrimary
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {formatShortCurrency(
                        averageMonthlyExpense,
                        'TRY'
                      )}
                    </Text>
                  </View>

                  <View
                    style={[
                      s.summaryMiniCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        s.summaryMiniLabel,
                        {
                          color: theme.textSecondary
                        }
                      ]}
                    >
                      En Yüksek Kategori
                    </Text>

                    <Text
                      style={[
                        s.summaryMiniValue,
                        {
                          color: theme.textPrimary
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {topCategoryLabel}
                    </Text>
                  </View>

                  <View
                    style={[
                      s.summaryMiniCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        s.summaryMiniLabel,
                        {
                          color: theme.textSecondary
                        }
                      ]}
                    >
                      En Pahalı Abonelik
                    </Text>

                    <Text
                      style={[
                        s.summaryMiniValue,
                        {
                          color: theme.textPrimary
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {mostExpensiveSub
                        ? mostExpensiveSub.item.name
                        : '-'}
                    </Text>
                  </View>

                  <View
                    style={[
                      s.summaryMiniCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        s.summaryMiniLabel,
                        {
                          color: theme.textSecondary
                        }
                      ]}
                    >
                      Toplam Abonelik
                    </Text>

                    <Text
                      style={[
                        s.summaryMiniValue,
                        {
                          color: theme.textPrimary
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {safeList.length} adet
                    </Text>
                  </View>
                </View>

                {upcomingRenewals.length > 0 && (
                  <View
                    style={[
                      s.chartContainer,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: theme.textPrimary,
                        marginBottom: 10
                      }}
                    >
                      ⏰ Yaklaşan Yenilemeler (14 gün)
                    </Text>

                    {upcomingRenewals.map(
                      ({ item, daysUntil }) => (
                        <View
                          key={item.id}
                          style={s.renewalRow}
                        >
                          <View
                            style={[
                              s.renewalDot,
                              {
                                backgroundColor:
                                  item.color ||
                                  getServiceColor(
                                    item.name,
                                    templatesList
                                  )
                              }
                            ]}
                          />

                          <Text
                            style={[
                              s.renewalName,
                              {
                                color: theme.textPrimary
                              }
                            ]}
                          >
                            {item.name}
                          </Text>

                          <Text
                            style={[
                              s.renewalDays,
                              {
                                color:
                                  daysUntil <= 2
                                    ? theme.danger
                                    : theme.textSecondary
                              }
                            ]}
                          >
                            {daysUntil === 0
                              ? 'Bugün'
                              : daysUntil === 1
                                ? 'Yarın'
                                : `${daysUntil} gün sonra`}
                          </Text>

                          <Text
                            style={[
                              s.renewalAmount,
                              {
                                color: theme.textPrimary
                              }
                            ]}
                          >
                            {formatCurrency(
                              item.price,
                              item.currency
                            )}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                <View
                  style={[
                    s.chartContainer,
                    {
                      backgroundColor: theme.cardBg,
                      borderColor: theme.cardBorder
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: theme.textPrimary,
                      marginBottom: 14
                    }}
                  >
                    {selectedAnalysisYear} Aylık Harcama Grafiği (TL)
                  </Text>

                  <View style={s.barsAreaContainer}>
                    {monthlyTotals.map(
                      (total, monthIndex) => {
                        const heightPercent =
                          maxMonthlyExpense > 0
                            ? (total /
                                maxMonthlyExpense) *
                              100
                            : 0;

                        const barColor =
                          total > 0
                            ? monthlyDominantColor[
                                monthIndex
                              ]
                            : 'transparent';

                        return (
                          <View
                            key={monthIndex}
                            style={s.barColumn}
                          >
                            <View
                              style={[
                                s.barTrack,
                                {
                                  backgroundColor:
                                    theme.inputBg
                                }
                              ]}
                            >
                              <View
                                style={[
                                  s.barFill,
                                  {
                                    height: `${
                                      total > 0
                                        ? Math.max(
                                            heightPercent,
                                            6
                                          )
                                        : 0
                                    }%`,
                                    backgroundColor:
                                      barColor
                                  }
                                ]}
                              />
                            </View>

                            <Text
                              style={[
                                s.barLabel,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {MONTH_NAMES[
                                monthIndex
                              ].substring(0, 3)}
                            </Text>

                            <Text
                              style={[
                                s.barAmountText,
                                {
                                  color:
                                    theme.textSecondary
                                }
                              ]}
                            >
                              {total > 0
                                ? formatShortCurrency(
                                    total,
                                    'TRY'
                                  )
                                : '-'}
                            </Text>
                          </View>
                        );
                      }
                    )}
                  </View>

                  <View
                    style={[
                      s.chartFooter,
                      {
                        borderTopColor:
                          theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={{
                        color: theme.textPrimary,
                        fontSize: 14,
                        fontWeight: 'bold'
                      }}
                    >
                      Yıllık Toplam Harcama ({selectedAnalysisYear}):
                    </Text>

                    <Text
                      style={{
                        color: theme.accent,
                        fontSize: 18,
                        fontWeight: 'bold'
                      }}
                    >
                      {formatCurrency(
                        totalYearlyExpenseForSelectedYear,
                        'TRY'
                      )}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: theme.textPrimary,
                    marginTop: 18,
                    marginBottom: 10
                  }}
                >
                  💳 Ödeme Yöntemine Göre Harcama Dağılımı ({selectedAnalysisYear})
                </Text>

                {sortedPaymentMethodEntries.length ===
                0 ? (
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontStyle: 'italic',
                      fontSize: 12
                    }}
                  >
                    Kayıtlı ödeme yöntemi verisi bulunamadı.
                  </Text>
                ) : (
                  sortedPaymentMethodEntries.map(
                    ([method, amount]) => {
                      const percentage =
                        totalYearlyExpenseForSelectedYear >
                        0
                          ? (
                              (amount /
                                totalYearlyExpenseForSelectedYear) *
                              100
                            ).toFixed(1)
                          : 0;

                      return (
                        <View
                          key={method}
                          style={[
                            s.categoryCard,
                            {
                              backgroundColor:
                                theme.cardBg,
                              borderColor:
                                theme.cardBorder
                            }
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent:
                                'space-between',
                              marginBottom: 6
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  theme.textPrimary,
                                fontWeight: 'bold',
                                fontSize: 13
                              }}
                            >
                              💳 {method}
                            </Text>

                            <Text
                              style={{
                                color:
                                  theme.textPrimary,
                                fontWeight: 'bold',
                                fontSize: 13
                              }}
                            >
                              {formatCurrency(
                                amount,
                                'TRY'
                              )}{' '}
                              (%{percentage})
                            </Text>
                          </View>

                          <View
                            style={[
                              s.progressBarBg,
                              {
                                backgroundColor:
                                  theme.inputBg
                              }
                            ]}
                          >
                            <View
                              style={[
                                s.progressBarFill,
                                {
                                  width: `${percentage}%`,
                                  backgroundColor:
                                    theme.accent
                                }
                              ]}
                            />
                          </View>
                        </View>
                      );
                    }
                  )
                )}

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: theme.textPrimary,
                    marginTop: 18,
                    marginBottom: 10
                  }}
                >
                  📂 Kategori Bazlı Dağılım ({selectedAnalysisYear})
                </Text>

                {sortedCategoryEntries.length ===
                0 ? (
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontStyle: 'italic',
                      fontSize: 12
                    }}
                  >
                    Kayıtlı veri bulunamadı.
                  </Text>
                ) : (
                  sortedCategoryEntries.map(
                    ([category, amount]) => {
                      const categoryColor =
                        CATEGORY_COLORS[
                          category
                        ] || '#6366f1';

                      const percentage =
                        totalYearlyExpenseForSelectedYear >
                        0
                          ? (
                              (amount /
                                totalYearlyExpenseForSelectedYear) *
                              100
                            ).toFixed(1)
                          : 0;

                      return (
                        <View
                          key={category}
                          style={[
                            s.categoryCard,
                            {
                              backgroundColor:
                                theme.cardBg,
                              borderColor:
                                theme.cardBorder
                            }
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent:
                                'space-between',
                              marginBottom: 6
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  theme.textPrimary,
                                fontWeight: 'bold',
                                fontSize: 13
                              }}
                            >
                              {category}
                            </Text>

                            <Text
                              style={{
                                color:
                                  theme.textPrimary,
                                fontWeight: 'bold',
                                fontSize: 13
                              }}
                            >
                              {formatCurrency(
                                amount,
                                'TRY'
                              )}{' '}
                              (%{percentage})
                            </Text>
                          </View>

                          <View
                            style={[
                              s.progressBarBg,
                              {
                                backgroundColor:
                                  theme.inputBg
                              }
                            ]}
                          >
                            <View
                              style={[
                                s.progressBarFill,
                                {
                                  width: `${percentage}%`,
                                  backgroundColor:
                                    categoryColor
                                }
                              ]}
                            />
                          </View>
                        </View>
                      );
                    }
                  )
                )}

                {!isDesktop && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 10,
                      marginTop: 20
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        s.exportBtn,
                        {
                          flexGrow: 1,
                          backgroundColor:
                            theme.inputBg,
                          borderColor:
                            theme.cardBorder,
                          borderWidth: 1
                        }
                      ]}
                      onPress={handleExportCSV}
                    >
                      <Text
                        style={{
                          color: theme.textPrimary,
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        📄 CSV İndir
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        s.exportBtn,
                        {
                          flexGrow: 1,
                          backgroundColor:
                            theme.inputBg,
                          borderColor:
                            theme.cardBorder,
                          borderWidth: 1
                        }
                      ]}
                      onPress={handleExportJSON}
                    >
                      <Text
                        style={{
                          color: theme.accent,
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        💾 JSON Yedek Al
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        s.exportBtn,
                        {
                          flexGrow: 1,
                          backgroundColor:
                            theme.inputBg,
                          borderColor:
                            theme.cardBorder,
                          borderWidth: 1
                        }
                      ]}
                      onPress={handleImportJSON}
                    >
                      <Text
                        style={{
                          color:
                            theme.textSecondary,
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        ↩️ Geri Yükle
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {!isDesktop && (
            <View
              style={[
                s.bottomNav,
                {
                  backgroundColor:
                    theme.headerBg,
                  borderTopColor:
                    theme.cardBorder
                }
              ]}
            >
              {[
                {
                  key: 'list',
                  icon: '💳',
                  label: 'Abonelikler'
                },
                {
                  key: 'calendar',
                  icon: '📅',
                  label: 'Takvim'
                },
                {
                  key: 'analytics',
                  icon: '📊',
                  label: 'Analiz'
                },
              ].map(nav => (
                <TouchableOpacity
                  key={nav.key}
                  style={s.navItem}
                  onPress={() =>
                    setActiveTab(nav.key)
                  }
                >
                  <Text
                    style={{
                      fontSize: 18
                    }}
                  >
                    {nav.icon}
                  </Text>

                  <Text
                    style={[
                      s.navText,
                      {
                        color:
                          activeTab === nav.key
                            ? '#6366f1'
                            : theme.textSecondary
                      }
                    ]}
                  >
                    {nav.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={isModalOpen}
        animationType="fade"
        transparent
      >
        <View style={s.modalOverlay}>
          <View
            style={[
              s.modalContent,
              {
                backgroundColor:
                  theme.cardBg,
                borderColor:
                  theme.cardBorder
              }
            ]}
          >
            <Text
              style={[
                s.modalTitle,
                {
                  color: theme.textPrimary
                }
              ]}
            >
              {editingId
                ? 'Abonelik Düzenle'
                : 'Yeni Abonelik Ekle'}
            </Text>

            <ScrollView
              style={{
                maxHeight: isMobile
                  ? '72%'
                  : 590
              }}
              showsVerticalScrollIndicator={
                false
              }
            >
              {!editingId && (
                <View
                  style={{
                    marginBottom: 14
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      marginBottom: 8
                    }}
                  >
                    <Text
                      style={{
                        color:
                          theme.textSecondary,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}
                    >
                      HIZLI ŞABLON SEÇ
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setShowTemplateForm(
                          !showTemplateForm
                        )
                      }
                    >
                      <Text
                        style={{
                          color: theme.accent,
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        {showTemplateForm
                          ? '✕ Kapat'
                          : '+ Şablon Ekle'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 10
                    }}
                  >
                    {templatesList.map(
                      (template, index) => (
                        <View
                          key={`${template.name}-${index}`}
                          style={{
                            position: 'relative'
                          }}
                        >
                          <TouchableOpacity
                            style={[
                              s.templateChip,
                              {
                                backgroundColor:
                                  template.color
                              }
                            ]}
                            onPress={() => {
                              setFormName(
                                template.name
                              );

                              setFormPrice(
                                template.price
                              );

                              setFormCurrency(
                                template.currency
                              );

                              setFormCategory(
                                template.category
                              );

                              setFormColor(
                                template.color
                              );
                            }}
                          >
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 'bold'
                              }}
                            >
                              {template.name}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={s.removeBadge}
                            onPress={() =>
                              removeTemplate(
                                index
                              )
                            }
                          >
                            <Text
                              style={
                                s.removeBadgeText
                              }
                            >
                              ×
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    )}
                  </View>

                  {showTemplateForm && (
                    <View
                      style={[
                        s.inlineForm,
                        {
                          backgroundColor:
                            theme.inputBg,
                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                    >
                      <TextInput
                        style={[
                          s.textInput,
                          {
                            backgroundColor:
                              theme.cardBg,
                            color:
                              theme.textPrimary,
                            borderColor:
                              theme.cardBorder
                          }
                        ]}
                        placeholder="Şablon adı (örn: Disney+)"
                        placeholderTextColor={
                          theme.textMuted
                        }
                        value={
                          newTemplateName
                        }
                        onChangeText={
                          setNewTemplateName
                        }
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8
                        }}
                      >
                        <TextInput
                          style={[
                            s.textInput,
                            {
                              flex: 1,
                              backgroundColor:
                                theme.cardBg,
                              color:
                                theme.textPrimary,
                              borderColor:
                                theme.cardBorder
                            }
                          ]}
                          placeholder="Fiyat"
                          placeholderTextColor={
                            theme.textMuted
                          }
                          keyboardType="numeric"
                          value={
                            newTemplatePrice
                          }
                          onChangeText={
                            setNewTemplatePrice
                          }
                        />

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 4
                          }}
                        >
                          {[
                            'TRY',
                            'USD',
                            'EUR'
                          ].map(currency => (
                            <TouchableOpacity
                              key={currency}
                              style={[
                                s.currBtn,
                                {
                                  backgroundColor:
                                    theme.cardBg,
                                  borderColor:
                                    theme.cardBorder,
                                  borderWidth: 1
                                },
                                newTemplateCurrency ===
                                  currency &&
                                  s.currBtnActive
                              ]}
                              onPress={() =>
                                setNewTemplateCurrency(
                                  currency
                                )
                              }
                            >
                              <Text
                                style={[
                                  s.currBtnText,
                                  {
                                    color:
                                      theme.textSecondary
                                  },
                                  newTemplateCurrency ===
                                    currency &&
                                    s.currBtnTextActive
                                ]}
                              >
                                {currency}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 6,
                          marginTop: 6
                        }}
                      >
                        {Object.keys(
                          CATEGORY_COLORS
                        ).map(category => (
                          <TouchableOpacity
                            key={category}
                            style={[
                              s.filterChip,
                              {
                                backgroundColor:
                                  theme.cardBg,
                                borderColor:
                                  theme.cardBorder
                              },
                              newTemplateCategory ===
                                category &&
                                s.filterChipActive
                            ]}
                            onPress={() =>
                              setNewTemplateCategory(
                                category
                              )
                            }
                          >
                            <Text
                              style={[
                                s.filterChipText,
                                {
                                  color:
                                    theme.textSecondary
                                },
                                newTemplateCategory ===
                                  category &&
                                  s.filterChipTextActive
                              ]}
                            >
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={[
                          s.modalSaveBtn,
                          {
                            marginTop: 10,
                            paddingVertical: 9
                          }
                        ]}
                        onPress={addTemplate}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 13
                          }}
                        >
                          Şablonu Kaydet
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              <Text
                style={[
                  s.inputLabel,
                  {
                    color:
                      theme.textSecondary
                  }
                ]}
              >
                Servis / Abonelik Adı
              </Text>

              <TextInput
                style={[
                  s.textInput,
                  {
                    backgroundColor:
                      theme.inputBg,
                    color:
                      theme.textPrimary,
                    borderColor:
                      theme.cardBorder
                  }
                ]}
                placeholder="Örn: Netflix, Spotify"
                placeholderTextColor={
                  theme.textMuted
                }
                value={formName}
                onChangeText={setFormName}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10
                }}
              >
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      s.inputLabel,
                      {
                        color:
                          theme.textSecondary
                      }
                    ]}
                  >
                    Tutar / Fiyat
                  </Text>

                  <TextInput
                    style={[
                      s.textInput,
                      {
                        backgroundColor:
                          theme.inputBg,
                        color:
                          theme.textPrimary,
                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                    placeholder="0.00"
                    placeholderTextColor={
                      theme.textMuted
                    }
                    keyboardType="numeric"
                    value={formPrice}
                    onChangeText={
                      setFormPrice
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      s.inputLabel,
                      {
                        color:
                          theme.textSecondary
                      }
                    ]}
                  >
                    Para Birimi
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 4,
                      marginTop: 4
                    }}
                  >
                    {[
                      'TRY',
                      'USD',
                      'EUR'
                    ].map(currency => (
                      <TouchableOpacity
                        key={currency}
                        style={[
                          s.currBtn,
                          {
                            backgroundColor:
                              theme.inputBg,
                            borderColor:
                              theme.cardBorder,
                            borderWidth: 1
                          },
                          formCurrency ===
                            currency &&
                            s.currBtnActive
                        ]}
                        onPress={() =>
                          setFormCurrency(
                            currency
                          )
                        }
                      >
                        <Text
                          style={[
                            s.currBtnText,
                            {
                              color:
                                theme.textSecondary
                            },
                            formCurrency ===
                              currency &&
                              s.currBtnTextActive
                          ]}
                        >
                          {currency}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text
                style={[
                  s.inputLabel,
                  {
                    color:
                      theme.textSecondary,
                    marginTop: 10
                  }
                ]}
              >
                Ödeme Periyodu
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  marginTop: 4
                }}
              >
                <TouchableOpacity
                  style={[
                    s.periodBtn,
                    {
                      backgroundColor:
                        theme.inputBg,
                      borderColor:
                        theme.cardBorder,
                      borderWidth: 1
                    },
                    formPeriod ===
                      'monthly' &&
                      s.periodBtnActive
                  ]}
                  onPress={() =>
                    setFormPeriod(
                      'monthly'
                    )
                  }
                >
                  <Text
                    style={[
                      s.periodBtnText,
                      {
                        color:
                          theme.textSecondary
                      },
                      formPeriod ===
                        'monthly' &&
                        s.periodBtnTextActive
                    ]}
                  >
                    Aylık
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    s.periodBtn,
                    {
                      backgroundColor:
                        theme.inputBg,
                      borderColor:
                        theme.cardBorder,
                      borderWidth: 1
                    },
                    formPeriod ===
                      'yearly' &&
                      s.periodBtnActive
                  ]}
                  onPress={() =>
                    setFormPeriod(
                      'yearly'
                    )
                  }
                >
                  <Text
                    style={[
                      s.periodBtnText,
                      {
                        color:
                          theme.textSecondary
                      },
                      formPeriod ===
                        'yearly' &&
                        s.periodBtnTextActive
                    ]}
                  >
                    Yıllık
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginTop: 12
                }}
              >
                <Text
                  style={[
                    s.inputLabel,
                    {
                      color:
                        theme.textSecondary,
                      marginTop: 0
                    }
                  ]}
                >
                  Ödeme Yapılan Kart / Hesap
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setShowPaymentMethodForm(
                      !showPaymentMethodForm
                    )
                  }
                >
                  <Text
                    style={{
                      color: theme.accent,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  >
                    {showPaymentMethodForm
                      ? '✕ Kapat'
                      : '+ Yöntem Ekle'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 6
                }}
              >
                {paymentMethodsList.map(
                  paymentMethod => (
                    <View
                      key={paymentMethod}
                      style={{
                        position: 'relative'
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          s.filterChip,
                          {
                            backgroundColor:
                              theme.inputBg,
                            borderColor:
                              theme.cardBorder
                          },
                          formPaymentMethod ===
                            paymentMethod &&
                            s.filterChipActive
                        ]}
                        onPress={() =>
                          setFormPaymentMethod(
                            paymentMethod
                          )
                        }
                      >
                        <Text
                          style={[
                            s.filterChipText,
                            {
                              color:
                                theme.textSecondary
                            },
                            formPaymentMethod ===
                              paymentMethod &&
                              s.filterChipTextActive
                          ]}
                        >
                          {paymentMethod}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          s.removeBadgeSmall
                        }
                        onPress={() =>
                          removePaymentMethod(
                            paymentMethod
                          )
                        }
                      >
                        <Text
                          style={
                            s.removeBadgeText
                          }
                        >
                          ×
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>

              {showPaymentMethodForm && (
                <View
                  style={[
                    s.inlineForm,
                    {
                      backgroundColor:
                        theme.inputBg,
                      borderColor:
                        theme.cardBorder
                    }
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 8
                    }}
                  >
                    <TextInput
                      style={[
                        s.textInput,
                        {
                          flex: 1,
                          marginBottom: 0,
                          backgroundColor:
                            theme.cardBg,
                          color:
                            theme.textPrimary,
                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                      placeholder="Örn: Akbank Axess"
                      placeholderTextColor={
                        theme.textMuted
                      }
                      value={
                        newPaymentMethodName
                      }
                      onChangeText={
                        setNewPaymentMethodName
                      }
                    />

                    <TouchableOpacity
                      style={[
                        s.modalSaveBtn,
                        {
                          flex: 0,
                          paddingHorizontal: 16
                        }
                      ]}
                      onPress={
                        addPaymentMethod
                      }
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 13
                        }}
                      >
                        Ekle
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <Text
                style={[
                  s.inputLabel,
                  {
                    color:
                      theme.textSecondary,
                    marginTop: 12
                  }
                ]}
              >
                Kategori
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 4
                }}
              >
                {Object.keys(
                  CATEGORY_COLORS
                ).map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      s.filterChip,
                      {
                        backgroundColor:
                          theme.inputBg,
                        borderColor:
                          theme.cardBorder
                      },
                      formCategory ===
                        category &&
                        s.filterChipActive
                    ]}
                    onPress={() =>
                      setFormCategory(
                        category
                      )
                    }
                  >
                    <Text
                      style={[
                        s.filterChipText,
                        {
                          color:
                            theme.textSecondary
                        },
                        formCategory ===
                          category &&
                          s.filterChipTextActive
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={[
                  s.inputLabel,
                  {
                    color:
                      theme.textSecondary,
                    marginTop: 12
                  }
                ]}
              >
                İlk / Yenileme Tarihi
              </Text>

              <View
                style={s.dateInputRow}
              >
                <TextInput
                  style={[
                    s.textInput,
                    s.dateInput,
                    {
                      backgroundColor:
                        theme.inputBg,
                      color:
                        theme.textPrimary,
                      borderColor:
                        theme.cardBorder
                    }
                  ]}
                  placeholder="Gün"
                  placeholderTextColor={
                    theme.textMuted
                  }
                  keyboardType="numeric"
                  value={formDay}
                  onChangeText={setFormDay}
                />

                <TextInput
                  style={[
                    s.textInput,
                    s.dateInput,
                    {
                      backgroundColor:
                        theme.inputBg,
                      color:
                        theme.textPrimary,
                      borderColor:
                        theme.cardBorder
                    }
                  ]}
                  placeholder="Ay"
                  placeholderTextColor={
                    theme.textMuted
                  }
                  keyboardType="numeric"
                  value={formMonth}
                  onChangeText={
                    setFormMonth
                  }
                />

                <TextInput
                  style={[
                    s.textInput,
                    s.dateInputYear,
                    {
                      backgroundColor:
                        theme.inputBg,
                      color:
                        theme.textPrimary,
                      borderColor:
                        theme.cardBorder
                    }
                  ]}
                  placeholder="Yıl"
                  placeholderTextColor={
                    theme.textMuted
                  }
                  keyboardType="numeric"
                  value={formYear}
                  onChangeText={
                    setFormYear
                  }
                />
              </View>

              <Text
                style={[
                  s.helperText,
                  {
                    color: theme.textMuted
                  }
                ]}
              >
                Aylık aboneliklerde başlangıç ayı; yıllık aboneliklerde tahsilat ayı olarak kullanılır.
              </Text>

              <Text
                style={[
                  s.inputLabel,
                  {
                    color:
                      theme.textSecondary,
                    marginTop: 12
                  }
                ]}
              >
                İptal / Yönetim Bağlantısı (isteğe bağlı)
              </Text>

              <TextInput
                style={[
                  s.textInput,
                  {
                    backgroundColor:
                      theme.inputBg,
                    color:
                      theme.textPrimary,
                    borderColor:
                      theme.cardBorder
                  }
                ]}
                placeholder="https://..."
                placeholderTextColor={
                  theme.textMuted
                }
                autoCapitalize="none"
                value={formCancelUrl}
                onChangeText={
                  setFormCancelUrl
                }
              />

              <Text
                style={[
                  s.inputLabel,
                  {
                    color:
                      theme.textSecondary,
                    marginTop: 12
                  }
                ]}
              >
                Hatırlatıcı Kuralı
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 4
                }}
              >
                {NOTIFICATION_OPTIONS.map(
                  option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        s.filterChip,
                        {
                          backgroundColor:
                            theme.inputBg,
                          borderColor:
                            theme.cardBorder
                        },
                        formNotificationDays ===
                          option.value &&
                          s.filterChipActive
                      ]}
                      onPress={() =>
                        setFormNotificationDays(
                          option.value
                        )
                      }
                    >
                      <Text
                        style={[
                          s.filterChipText,
                          {
                            color:
                              theme.textSecondary
                          },
                          formNotificationDays ===
                            option.value &&
                            s.filterChipTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>

            <View
              style={
                s.modalFooterButtons
              }
            >
              <TouchableOpacity
                style={[
                  s.modalCancelBtn,
                  {
                    backgroundColor:
                      theme.inputBg,
                    borderColor:
                      theme.cardBorder,
                    borderWidth: 1
                  }
                ]}
                onPress={() =>
                  setIsModalOpen(false)
                }
              >
                <Text
                  style={{
                    color:
                      theme.textSecondary,
                    fontWeight: 'bold'
                  }}
                >
                  İptal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.modalSaveBtn}
                onPress={handleSaveForm}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                >
                  Kaydet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(
  theme,
  isMobile
) {
  return StyleSheet.create({
    container: {
      flex: 1
    },

    appWrapper: {
      flex: 1
    },

    appWrapperDesktop: {
      flexDirection: 'row'
    },

    sidebarContainer: {
      width: 250,
      borderRightWidth: 1,
      padding: 20,
      justifyContent: 'flex-start'
    },

    sidebarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4
    },

    sidebarNavGroup: {
      gap: 8,
      marginTop: 12
    },

    sidebarNavBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10
    },

    sidebarNavBtnActive: {
      backgroundColor: '#6366f120'
    },

    sidebarNavText: {
      fontSize: 14,
      fontWeight: 'bold'
    },

    exportBtn: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center'
    },

    responsiveWrapper: {
      maxWidth: 980,
      width: '100%',
      marginHorizontal: 'auto',
      alignSelf: 'center',
      flex: 1
    },

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      paddingHorizontal:
        isMobile ? 14 : 20,
      paddingTop: 20,
      paddingBottom: 14,
      borderBottomWidth: 1
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      letterSpacing: 0.5
    },

    headerSubtitle: {
      fontSize: 12,
      marginTop: 2
    },

    proBadge: {
      backgroundColor: '#6366f1',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4
    },

    proBadgeText: {
      color: '#ffffff',
      fontSize: 9,
      fontWeight: 'bold'
    },

    themeToggleIconBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },

    addBtn: {
      backgroundColor: '#6366f1',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center'
    },

    addBtnText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 13
    },

    scrollContent: {
      paddingHorizontal:
        isMobile ? 12 : 16,
      paddingBottom: 90,
      paddingTop: 14
    },

    listToolbar: {
      marginBottom: 14,
      gap: 8
    },

    searchInput: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 9,
      borderWidth: 1,
      fontSize: 13
    },

    compactFilterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },

    currencyBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 12
    },

    currencyBarTitle: {
      fontSize: 12,
      fontWeight: 'bold'
    },

    currencyBadgeGroup: {
      flexDirection: 'row',
      gap: 8
    },

    currencyBadge: {
      backgroundColor:
        '#6366f122',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },

    currencyBadgeText: {
      color: '#6366f1',
      fontSize: 11,
      fontWeight: 'bold'
    },

    summaryCard: {
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1
    },

    summaryLabel: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
      opacity: 0.9
    },

    summaryValue: {
      color: '#ffffff',
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 4
    },

    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 8
    },

    statBox: {
      flex: 1,
      backgroundColor:
        'rgba(255,255,255,0.15)',
      padding: 8,
      borderRadius: 8
    },

    statLabel: {
      color: '#ffffff',
      fontSize: 11,
      opacity: 0.9
    },

    statValue: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: 'bold',
      marginTop: 2
    },

    sectionTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 10
    },

    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1
    },

    filterChipActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1'
    },

    filterChipText: {
      fontSize: 12,
      fontWeight: '600'
    },

    filterChipTextActive: {
      color: '#ffffff',
      fontWeight: 'bold'
    },

    emptyCard: {
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      alignItems: 'center'
    },

    card: {
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      borderWidth: 1
    },

    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1
    },

    brandIconBox: {
      width: 38,
      height: 38,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },

    brandIconText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold'
    },

    cardTitle: {
      fontSize: 14,
      fontWeight: 'bold'
    },

    cardTag: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4
    },

    cardTagText: {
      fontSize: 11,
      fontWeight: 'bold'
    },

    cardSubtitle: {
      fontSize: 12,
      marginTop: 2,
      fontWeight: '500'
    },

    rightSection: {
      alignItems: 'flex-end'
    },

    price: {
      fontSize: 14,
      fontWeight: 'bold'
    },

    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6
    },

    editBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },

    cancelBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },

    cancelText: {
      fontSize: 11,
      fontWeight: 'bold'
    },

    deleteBtn: {
      padding: 4,
      borderRadius: 6
    },

    calendarHeaderNav: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 14
    },

    calendarTitleText: {
      fontSize:
        isMobile ? 17 : 20,
      fontWeight: 'bold'
    },

    arrowBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1
    },

    arrowText: {
      fontSize: 13,
      fontWeight: 'bold'
    },

    calendarWrapper: {
      width: '100%'
    },

    weekHeaderRow: {
      flexDirection: 'row',
      marginBottom: 8
    },

    weekHeaderCell: {
      width: '14.28%',
      alignItems: 'center'
    },

    weekHeaderText: {
      fontSize: 13,
      fontWeight: 'bold'
    },

    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },

    calendarDayBox: {
      width: '14.28%',
      minHeight:
        isMobile ? 78 : 104,
      borderRadius: 6,
      padding: 4,
      borderWidth: 1,
      marginBottom: 4
    },

    activeDayBox: {
      borderColor: '#6366f1',
      borderWidth: 1.5
    },

    calendarEmptyDay: {
      backgroundColor:
        'transparent',
      opacity: 0
    },

    dayNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 3
    },

    daySubBadge: {
      borderRadius: 4,
      padding: 3,
      marginTop: 2
    },

    daySubText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: 'bold'
    },

    daySubPrice: {
      color: '#ffffff',
      fontSize: 8,
      fontWeight: '600'
    },

    yearChip: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 16,
      marginRight: 6,
      borderWidth: 1
    },

    yearChipActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1'
    },

    yearChipText: {
      fontWeight: '600',
      fontSize: 13
    },

    yearChipTextActive: {
      color: '#ffffff',
      fontWeight: 'bold'
    },

    summaryMiniRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 14
    },

    summaryMiniCard: {
      flexGrow: 1,
      minWidth:
        isMobile ? '46%' : 150,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1
    },

    summaryMiniLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4
    },

    summaryMiniValue: {
      fontSize: 15,
      fontWeight: 'bold'
    },

    renewalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor:
        theme.cardBorder
    },

    renewalDot: {
      width: 8,
      height: 8,
      borderRadius: 4
    },

    renewalName: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600'
    },

    renewalDays: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 10
    },

    renewalAmount: {
      fontSize: 13,
      fontWeight: 'bold'
    },

    chartContainer: {
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
      borderWidth: 1
    },

    barsAreaContainer: {
      flexDirection: 'row',
      height: 160,
      alignItems: 'flex-end',
      justifyContent:
        'space-between',
      paddingVertical: 8
    },

    barColumn: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent:
        'flex-end'
    },

    barTrack: {
      width: isMobile ? 10 : 16,
      height: 100,
      borderRadius: 6,
      justifyContent:
        'flex-end',
      overflow: 'hidden'
    },

    barFill: {
      width: '100%',
      borderRadius: 6
    },

    barLabel: {
      fontSize: isMobile ? 9 : 11,
      marginTop: 6,
      fontWeight: 'bold'
    },

    barAmountText: {
      fontSize: isMobile ? 7 : 9,
      marginTop: 2,
      fontWeight: '600'
    },

    chartFooter: {
      borderTopWidth: 1,
      paddingTop: 10,
      marginTop: 10,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6
    },

    categoryCard: {
      padding: 10,
      borderRadius: 8,
      marginBottom: 6,
      borderWidth: 1
    },

    progressBarBg: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden'
    },

    progressBarFill: {
      height: '100%',
      borderRadius: 3
    },

    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      height: 58,
      borderTopWidth: 1,
      justifyContent:
        'space-around',
      alignItems: 'center'
    },

    navItem: {
      alignItems: 'center',
      justifyContent: 'center'
    },

    navText: {
      fontSize: 10,
      fontWeight: 'bold',
      marginTop: 2
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 14
    },

    modalContent: {
      width:
        isMobile ? '96%' : '100%',
      maxWidth: 760,
      maxHeight: '90%',
      borderRadius: 16,
      padding:
        isMobile ? 18 : 24,
      borderWidth: 1
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16
    },

    inputLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 4
    },

    textInput: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      fontSize: 14,
      marginBottom: 10
    },

    dateInputRow: {
      flexDirection: 'row',
      gap: 8
    },

    dateInput: {
      flex: 1
    },

    dateInputYear: {
      flex: 1.4
    },

    helperText: {
      fontSize: 10,
      lineHeight: 15,
      marginTop: -5,
      marginBottom: 2
    },

    currBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
      borderWidth: 1
    },

    currBtnActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1'
    },

    currBtnText: {
      fontSize: 12,
      fontWeight: 'bold'
    },

    currBtnTextActive: {
      color: '#fff'
    },

    periodBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
      borderWidth: 1
    },

    periodBtnActive: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1'
    },

    periodBtnText: {
      fontSize: 12,
      fontWeight: 'bold'
    },

    periodBtnTextActive: {
      color: '#fff'
    },

    templateChip: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8
    },

    removeBadge: {
      position: 'absolute',
      top: -7,
      right: -7,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor:
        theme.danger,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2
    },

    removeBadgeSmall: {
      position: 'absolute',
      top: -7,
      right: -7,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor:
        theme.danger,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2
    },

    removeBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
      lineHeight: 14
    },

    inlineForm: {
      borderRadius: 10,
      borderWidth: 1,
      padding: 12,
      marginTop: 10
    },

    modalFooterButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
      alignItems: 'center',
      justifyContent:
        'space-between'
    },

    modalCancelBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },

    modalSaveBtn: {
      flex: 2,
      backgroundColor: '#6366f1',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
}

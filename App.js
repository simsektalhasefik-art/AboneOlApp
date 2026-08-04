import React, {
  useEffect,
  useRef,
  useState
} from 'react';

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
  Linking,
  Platform
} from 'react-native';

const DEFAULT_RATES = {
  USD: 47.56,
  EUR: 54.77
};

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
  }
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
  {
    label: 'Bildirim Yok',
    badgeLabel: null,
    value: -1
  },
  {
    label: 'Aynı Gün',
    badgeLabel: '🔔 Aynı Gün',
    value: 0
  },
  {
    label: '1 Gün Önce',
    badgeLabel: '🔔 1 Gün Önce',
    value: 1
  },
  {
    label: '2 Gün Önce',
    badgeLabel: '🔔 2 Gün Önce',
    value: 2
  },
  {
    label: '3 Gün Önce',
    badgeLabel: '🔔 3 Gün Önce',
    value: 3
  },
  {
    label: '1 Hafta Önce',
    badgeLabel: '🔔 1 Hafta Önce',
    value: 7
  }
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

const YEARS = [
  2025,
  2026,
  2027,
  2028,
  2029,
  2030
];

const VIEW_FILTER_OPTIONS = [
  {
    key: 'ALL',
    label: 'Tüm Abonelikler'
  },
  {
    key: 'MONTHLY',
    label: 'Aylık Ödemeler'
  },
  {
    key: 'YEARLY',
    label: 'Yıllık Ödemeler'
  },
  {
    key: 'UPCOMING',
    label: 'Yaklaşan Ödemeler'
  },
  {
    key: 'EXPENSIVE',
    label: 'En Yüksek Tutar'
  },
  {
    key: 'NAME',
    label: 'Ada Göre'
  }
];

const BACKGROUND_PRESETS = {
  smoke: {
    label: 'Açık Füme',
    dark: true,

    bg: '#30353c',
    sidebarBg: '#373d45',
    headerBg: '#3a4048',
    cardBg: '#414852',
    inputBg: '#343a42',
    cardBorder: '#58616d',

    textPrimary: '#f4f6f8',
    textSecondary: '#d2d7de',
    textMuted: '#aeb7c2',

    summaryBg: '#5b58d6',
    summaryBorder: '#7470ef',
    accent: '#63b3ff'
  },

  anthracite: {
    label: 'Antrasit',
    dark: true,

    bg: '#20242a',
    sidebarBg: '#272c33',
    headerBg: '#2a3038',
    cardBg: '#303741',
    inputBg: '#252b33',
    cardBorder: '#434c58',

    textPrimary: '#f4f5f7',
    textSecondary: '#cbd1d9',
    textMuted: '#98a2af',

    summaryBg: '#4f46c8',
    summaryBorder: '#6860df',
    accent: '#55aaff'
  },

  navy: {
    label: 'Lacivert',
    dark: true,

    bg: '#111827',
    sidebarBg: '#182131',
    headerBg: '#1c2636',
    cardBg: '#222d3d',
    inputBg: '#172131',
    cardBorder: '#344154',

    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',

    summaryBg: '#3730a3',
    summaryBorder: '#4f46e5',
    accent: '#60a5fa'
  },

  sage: {
    label: 'Adaçayı',
    dark: false,

    bg: '#dfe8df',
    sidebarBg: '#cedbce',
    headerBg: '#eaf1ea',
    cardBg: '#f5f8f4',
    inputBg: '#e7eee6',
    cardBorder: '#afc1ae',

    textPrimary: '#26352a',
    textSecondary: '#506353',
    textMuted: '#748278',

    summaryBg: '#4f7c5a',
    summaryBorder: '#6d9977',
    accent: '#d97706'
  },

  mint: {
    label: 'Açık Yeşil',
    dark: false,

    bg: '#dff3ea',
    sidebarBg: '#c9e6d9',
    headerBg: '#ebf8f2',
    cardBg: '#f6fcf9',
    inputBg: '#e3f2eb',
    cardBorder: '#a8cfbc',

    textPrimary: '#17392b',
    textSecondary: '#3f6857',
    textMuted: '#708d80',

    summaryBg: '#0f766e',
    summaryBorder: '#14b8a6',
    accent: '#ea580c'
  },

  apricot: {
    label: 'Kayısı',
    dark: false,

    bg: '#f5e3d1',
    sidebarBg: '#ebd1b8',
    headerBg: '#faeee3',
    cardBg: '#fff8f1',
    inputBg: '#f2e3d5',
    cardBorder: '#d7bba1',

    textPrimary: '#3b291d',
    textSecondary: '#6e5340',
    textMuted: '#927764',

    summaryBg: '#d97706',
    summaryBorder: '#f59e0b',
    accent: '#0f766e'
  },

  sand: {
    label: 'Kum',
    dark: false,

    bg: '#eee8dc',
    sidebarBg: '#e0d7c7',
    headerBg: '#f5f1e8',
    cardBg: '#fcfaf5',
    inputBg: '#ece5d9',
    cardBorder: '#cbc0ae',

    textPrimary: '#3a342b',
    textSecondary: '#665e51',
    textMuted: '#8a8173',

    summaryBg: '#8b6f47',
    summaryBorder: '#a98b60',
    accent: '#2563eb'
  },

  lavender: {
    label: 'Lavanta',
    dark: false,

    bg: '#e9e4f4',
    sidebarBg: '#dcd4eb',
    headerBg: '#f1edf8',
    cardBg: '#faf8fd',
    inputBg: '#e8e2f1',
    cardBorder: '#c5bad8',

    textPrimary: '#302740',
    textSecondary: '#625570',
    textMuted: '#85768f',

    summaryBg: '#7c5cbf',
    summaryBorder: '#9676d4',
    accent: '#d97706'
  },

  rose: {
    label: 'Gül Kurusu',
    dark: false,

    bg: '#f1e1e3',
    sidebarBg: '#e5cfd2',
    headerBg: '#f8ecee',
    cardBg: '#fff8f9',
    inputBg: '#f0dfe2',
    cardBorder: '#d3b5ba',

    textPrimary: '#42282e',
    textSecondary: '#704d55',
    textMuted: '#93737a',

    summaryBg: '#be5f73',
    summaryBorder: '#d17b8d',
    accent: '#2563eb'
  },

  light: {
    label: 'Açık',
    dark: false,

    bg: '#edf1f5',
    sidebarBg: '#ffffff',
    headerBg: '#ffffff',
    cardBg: '#ffffff',
    inputBg: '#f1f4f8',
    cardBorder: '#d8dee7',

    textPrimary: '#1f2937',
    textSecondary: '#566171',
    textMuted: '#7d8999',

    summaryBg: '#4f46e5',
    summaryBorder: '#6366f1',
    accent: '#2563eb'
  }
};

const FONT_SCALE_OPTIONS = [
  {
    key: 'small',
    label: 'Küçük',
    scale: 0.9
  },
  {
    key: 'normal',
    label: 'Normal',
    scale: 1
  },
  {
    key: 'large',
    label: 'Büyük',
    scale: 1.12
  },
  {
    key: 'xlarge',
    label: 'Çok Büyük',
    scale: 1.24
  }
];
const getDaysInMonth = (
  month,
  year
) =>
  new Date(
    year,
    month + 1,
    0
  ).getDate();

const formatCurrency = (
  value,
  currency = 'TRY'
) => {
  const numberValue =
    Number(value) || 0;

  const symbol =
    currency === 'USD'
      ? '$'
      : currency === 'EUR'
        ? '€'
        : '₺';

  return `${numberValue.toLocaleString(
    'tr-TR',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  )} ${symbol}`;
};

const formatShortCurrency = (
  value,
  currency = 'TRY'
) => {
  const numberValue =
    Number(value) || 0;

  const symbol =
    currency === 'USD'
      ? '$'
      : currency === 'EUR'
        ? '€'
        : '₺';

  return `${Math.round(
    numberValue
  ).toLocaleString(
    'tr-TR'
  )} ${symbol}`;
};

const convertToTL = (
  price,
  currency,
  rates = DEFAULT_RATES
) => {
  const numericPrice =
    Number(price) || 0;

  if (currency === 'USD') {
    return (
      numericPrice *
      (
        Number(rates.USD) ||
        DEFAULT_RATES.USD
      )
    );
  }

  if (currency === 'EUR') {
    return (
      numericPrice *
      (
        Number(rates.EUR) ||
        DEFAULT_RATES.EUR
      )
    );
  }

  return numericPrice;
};

const normalizeText = (
  value = ''
) =>
  String(value)
    .toLocaleLowerCase(
      'tr-TR'
    )
    .replace(
      /\s+/g,
      ' '
    )
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
    const parsedUrl =
      new URL(value);

    return [
      'http:',
      'https:'
    ].includes(
      parsedUrl.protocol
    );
  } catch {
    return false;
  }
};

const getServiceColor = (
  name,
  templates
) => {
  const source =
    Array.isArray(templates) &&
    templates.length > 0
      ? templates
      : DEFAULT_TEMPLATES;

  const matchedTemplate =
    source.find(
      template =>
        normalizeText(
          template.name
        ) ===
        normalizeText(name)
    );

  return (
    matchedTemplate?.color ||
    '#6366f1'
  );
};

const getNextRenewal = (
  item,
  today
) => {
  const day =
    Number(
      item.billingDay
    ) || 1;

  if (
    item.period === 'yearly'
  ) {
    const month =
      Math.max(
        0,
        Math.min(
          11,
          (
            Number(
              item.billingMonth
            ) || 1
          ) - 1
        )
      );

    let renewalDate =
      new Date(
        today.getFullYear(),
        month,
        day
      );

    if (
      renewalDate < today
    ) {
      renewalDate =
        new Date(
          today.getFullYear() + 1,
          month,
          day
        );
    }

    return renewalDate;
  }

  let renewalDate =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      day
    );

  if (
    renewalDate < today
  ) {
    renewalDate =
      new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        day
      );
  }

  return renewalDate;
};

const getSubscriptionCostForMonth = (
  item,
  year,
  monthIndex,
  rates
) => {
  if (
    !item ||
    item.status === 'cancelled'
  ) {
    return 0;
  }

  const priceInTL =
    convertToTL(
      item.price,
      item.currency || 'TRY',
      rates
    );

  const billingYear =
    Number(
      item.billingYear
    ) || year;

  const billingMonth =
    Math.max(
      0,
      Math.min(
        11,
        (
          Number(
            item.billingMonth
          ) || 1
        ) - 1
      )
    );

  const targetMonthKey =
    year * 12 +
    monthIndex;

  const billingMonthKey =
    billingYear * 12 +
    billingMonth;

  if (
    targetMonthKey <
    billingMonthKey
  ) {
    return 0;
  }

  if (
    item.period === 'monthly'
  ) {
    return priceInTL;
  }

  return (
    monthIndex === billingMonth
      ? priceInTL
      : 0
  );
};

export default function App() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 900;

  const isMobile =
    width < 768;

  /*
    Ana sayfanın kaydırma alanı.
    Kayıt ekleme ve düzenleme sonrasında
    mevcut sayfa konumu korunur.
  */
  const mainScrollRef =
    useRef(null);

  const mainScrollPositionRef =
    useRef(0);

  const scrollMainToTop = (
    animated = false
  ) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainScrollRef.current
          ?.scrollTo?.({
            y: 0,
            animated
          });

        mainScrollPositionRef.current =
          0;
      });
    });
  };

  const restoreMainScrollPosition =
    position => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mainScrollRef.current
            ?.scrollTo?.({
              y:
                Number(position) ||
                0,
              animated: false
            });
        });
      });
    };

  const [
    subscriptions,
    setSubscriptions
  ] = useState([]);

  const [
    exchangeRates,
    setExchangeRates
  ] = useState(
    DEFAULT_RATES
  );

  const [
    templatesList,
    setTemplatesList
  ] = useState(
    DEFAULT_TEMPLATES
  );

  const [
    paymentMethodsList,
    setPaymentMethodsList
  ] = useState(
    DEFAULT_PAYMENT_METHODS
  );

  const [
    isLoaded,
    setIsLoaded
  ] = useState(false);

  const [
    activeTab,
    setActiveTab
  ] = useState('list');

  const [
    viewFilter,
    setViewFilter
  ] = useState('ALL');

  const [
    searchQuery,
    setSearchQuery
  ] = useState('');

  const [
    backgroundPreset,
    setBackgroundPreset
  ] = useState('smoke');

  const [
    fontScaleKey,
    setFontScaleKey
  ] = useState('normal');

  const [
    isAppearanceModalOpen,
    setIsAppearanceModalOpen
  ] = useState(false);

  const [
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen
  ] = useState(false);

  const [
    duplicateWarning,
    setDuplicateWarning
  ] = useState({
    visible: false,
    name: ''
  });

  const [
    editingId,
    setEditingId
  ] = useState(null);

  const currentDate =
    new Date();

  const clampedYear =
    Math.min(
      2030,
      Math.max(
        2025,
        currentDate.getFullYear()
      )
    );

  const [
    calendarMonth,
    setCalendarMonth
  ] = useState(
    clampedYear ===
      currentDate.getFullYear()
      ? currentDate.getMonth()
      : 0
  );

  const [
    calendarYear,
    setCalendarYear
  ] = useState(
    clampedYear
  );

  const [
    selectedAnalysisYear,
    setSelectedAnalysisYear
  ] = useState(
    clampedYear
  );

  /* ---------------------------------------------------------------------- */
  /*                              FORM STATES                               */
  /* ---------------------------------------------------------------------- */

  const [
    formName,
    setFormName
  ] = useState('');

  const [
    formPrice,
    setFormPrice
  ] = useState('');

  const [
    formCurrency,
    setFormCurrency
  ] = useState('TRY');

  const [
    formDay,
    setFormDay
  ] = useState('1');

  const [
    formMonth,
    setFormMonth
  ] = useState(
    String(
      currentDate.getMonth() + 1
    )
  );

  const [
    formYear,
    setFormYear
  ] = useState(
    String(clampedYear)
  );

  const [
    formCategory,
    setFormCategory
  ] = useState('Eğlence');

  const [
    formPaymentMethod,
    setFormPaymentMethod
  ] = useState(
    DEFAULT_PAYMENT_METHODS[0]
  );

  const [
    formPeriod,
    setFormPeriod
  ] = useState('monthly');

  const [
    formCancelUrl,
    setFormCancelUrl
  ] = useState('');

  const [
    formColor,
    setFormColor
  ] = useState('#6366f1');

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
    /* ---------------------------------------------------------------------- */
  /*                         LOCALSTORAGE YÜKLEME                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    try {
      const savedSubscriptions =
        localStorage.getItem(
          'cebin_subscriptions_v5'
        );

      if (savedSubscriptions) {
        const parsedSubscriptions =
          JSON.parse(
            savedSubscriptions
          );

        setSubscriptions(
          Array.isArray(
            parsedSubscriptions
          )
            ? parsedSubscriptions
            : []
        );
      }

      const savedTemplates =
        localStorage.getItem(
          'cebin_templates_v1'
        );

      if (savedTemplates) {
        const parsedTemplates =
          JSON.parse(
            savedTemplates
          );

        setTemplatesList(
          Array.isArray(
            parsedTemplates
          )
            ? parsedTemplates
            : DEFAULT_TEMPLATES
        );
      }

      const savedPaymentMethods =
        localStorage.getItem(
          'cebin_payment_methods_v1'
        );

      if (savedPaymentMethods) {
        const parsedPaymentMethods =
          JSON.parse(
            savedPaymentMethods
          );

        setPaymentMethodsList(
          Array.isArray(
            parsedPaymentMethods
          )
            ? parsedPaymentMethods
            : DEFAULT_PAYMENT_METHODS
        );
      }

      const savedRates =
        localStorage.getItem(
          'cebin_exchange_rates_v1'
        );

      if (savedRates) {
        const parsedRates =
          JSON.parse(
            savedRates
          );

        setExchangeRates({
          USD:
            Number(
              parsedRates?.USD
            ) ||
            DEFAULT_RATES.USD,

          EUR:
            Number(
              parsedRates?.EUR
            ) ||
            DEFAULT_RATES.EUR
        });
      }

      const savedAppearance =
        localStorage.getItem(
          'cebin_appearance_v1'
        );

      if (savedAppearance) {
        const parsedAppearance =
          JSON.parse(
            savedAppearance
          );

        if (
          BACKGROUND_PRESETS[
            parsedAppearance
              ?.backgroundPreset
          ]
        ) {
          setBackgroundPreset(
            parsedAppearance
              .backgroundPreset
          );
        }

        if (
          FONT_SCALE_OPTIONS.some(
            option =>
              option.key ===
              parsedAppearance
                ?.fontScaleKey
          )
        ) {
          setFontScaleKey(
            parsedAppearance
              .fontScaleKey
          );
        }
      }
    } catch (error) {
      console.log(
        'Kayıtlı veriler okunamadı:',
        error
      );
    }

    setIsLoaded(true);
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                         LOCALSTORAGE KAYIT                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_subscriptions_v5',
        JSON.stringify(
          subscriptions
        )
      );
    } catch (error) {
      console.log(
        'Abonelikler kaydedilemedi:',
        error
      );
    }
  }, [
    subscriptions,
    isLoaded
  ]);

  /* ---------------------------------------------------------------------- */
  /*                         GÜNCEL DÖVİZ KURLARI                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;

    const fetchExchangeRates =
      async () => {
        try {
          const [
            usdResponse,
            eurResponse
          ] = await Promise.all([
            fetch(
              'https://api.frankfurter.dev/v2/rate/USD/TRY?providers=TCMB'
            ),
            fetch(
              'https://api.frankfurter.dev/v2/rate/EUR/TRY?providers=TCMB'
            )
          ]);

          if (
            !usdResponse.ok ||
            !eurResponse.ok
          ) {
            throw new Error(
              'Kur servisi yanıt vermedi.'
            );
          }

          const usdData =
            await usdResponse.json();

          const eurData =
            await eurResponse.json();

          if (!isMounted) {
            return;
          }

          const usdRate =
            Number(
              usdData?.rate
            );

          const eurRate =
            Number(
              eurData?.rate
            );

          if (
            !Number.isFinite(
              usdRate
            ) ||
            !Number.isFinite(
              eurRate
            )
          ) {
            throw new Error(
              'Kur değerleri geçersiz.'
            );
          }

          setExchangeRates({
            USD: usdRate,
            EUR: eurRate
          });
        } catch (error) {
          console.log(
            'Güncel döviz kurları alınamadı:',
            error
          );

          /*
            API çalışmazsa localStorage'daki
            veya varsayılan kur değerleri kullanılmaya
            devam eder.
          */
        }
      };

    fetchExchangeRates();

    const intervalId =
      setInterval(
        fetchExchangeRates,
        6 * 60 * 60 * 1000
      );

    return () => {
      isMounted = false;

      clearInterval(
        intervalId
      );
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_templates_v1',
        JSON.stringify(
          templatesList
        )
      );
    } catch (error) {
      console.log(
        'Şablonlar kaydedilemedi:',
        error
      );
    }
  }, [
    templatesList,
    isLoaded
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_payment_methods_v1',
        JSON.stringify(
          paymentMethodsList
        )
      );
    } catch (error) {
      console.log(
        'Ödeme yöntemleri kaydedilemedi:',
        error
      );
    }
  }, [
    paymentMethodsList,
    isLoaded
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_exchange_rates_v1',
        JSON.stringify(
          exchangeRates
        )
      );
    } catch (error) {
      console.log(
        'Kurlar kaydedilemedi:',
        error
      );
    }
  }, [
    exchangeRates,
    isLoaded
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        'cebin_appearance_v1',
        JSON.stringify({
          backgroundPreset,
          fontScaleKey
        })
      );
    } catch (error) {
      console.log(
        'Görünüm ayarları kaydedilemedi:',
        error
      );
    }
  }, [
    backgroundPreset,
    fontScaleKey,
    isLoaded
  ]);

  /*
    Sadece sekme veya analiz yılı değiştiğinde
    sayfa en üste alınır.

    Abonelik ekleme veya düzenleme subscriptions
    değerini değiştirdiğinde sayfa otomatik olarak
    en üste çıkmaz.
  */
  useEffect(() => {
    scrollMainToTop(false);
  }, [
    activeTab,
    selectedAnalysisYear
  ]);

  /* ---------------------------------------------------------------------- */
  /*                               TEMA                                     */
  /* ---------------------------------------------------------------------- */

  const selectedPreset =
    BACKGROUND_PRESETS[
      backgroundPreset
    ] ||
    BACKGROUND_PRESETS.smoke;

  const selectedFontOption =
    FONT_SCALE_OPTIONS.find(
      option =>
        option.key ===
        fontScaleKey
    ) ||
    FONT_SCALE_OPTIONS[1];

  const fontScale =
    selectedFontOption.scale;

  const theme = {
    ...selectedPreset,

    danger: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',

    activeButton: '#6965e8',

    activeButtonBorder:
      '#7c78f0',

    activeButtonSoft:
      '#7772ff26'
  };

  const safeList =
    Array.isArray(
      subscriptions
    )
      ? subscriptions
      : [];

  const safeTemplates =
    Array.isArray(
      templatesList
    )
      ? templatesList
      : [];

  const safePaymentMethods =
    Array.isArray(
      paymentMethodsList
    )
      ? paymentMethodsList
      : [];

  /* ---------------------------------------------------------------------- */
  /*                         ABONELİK FİLTRELEME                             */
  /* ---------------------------------------------------------------------- */

  const todayForFiltering =
    new Date();

  const filteredSubscriptions =
    safeList
      .filter(subscription => {
        const query =
          normalizeText(
            searchQuery
          );

        if (!query) {
          return true;
        }

        return [
          subscription.name,
          subscription.category,
          subscription.paymentMethod,
          subscription.currency
        ].some(value =>
          normalizeText(
            value
          ).includes(query)
        );
      })
      .filter(subscription => {
        if (
          viewFilter === 'ALL'
        ) {
          return true;
        }

        if (
          viewFilter === 'MONTHLY'
        ) {
          return (
            subscription.period ===
            'monthly'
          );
        }

        if (
          viewFilter === 'YEARLY'
        ) {
          return (
            subscription.period ===
            'yearly'
          );
        }

        if (
          viewFilter === 'UPCOMING'
        ) {
          const nextRenewal =
            getNextRenewal(
              subscription,
              todayForFiltering
            );

          const todayStart =
            new Date(
              todayForFiltering
                .getFullYear(),
              todayForFiltering
                .getMonth(),
              todayForFiltering
                .getDate()
            );

          const daysUntil =
            Math.round(
              (
                nextRenewal -
                todayStart
              ) /
              86400000
            );

          return (
            daysUntil >= 0 &&
            daysUntil <= 14
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (
          viewFilter ===
          'EXPENSIVE'
        ) {
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

        if (
          viewFilter ===
          'NAME'
        ) {
          return String(
            a.name || ''
          ).localeCompare(
            String(
              b.name || ''
            ),
            'tr'
          );
        }

        if (
          viewFilter ===
          'UPCOMING'
        ) {
          return (
            getNextRenewal(
              a,
              todayForFiltering
            ) -
            getNextRenewal(
              b,
              todayForFiltering
            )
          );
        }

        return String(
          a.name || ''
        ).localeCompare(
          String(
            b.name || ''
          ),
          'tr'
        );
      });

  const selectedViewFilterLabel =
    VIEW_FILTER_OPTIONS.find(
      option =>
        option.key ===
        viewFilter
    )?.label ||
    'Tüm Abonelikler';
    /* ---------------------------------------------------------------------- */
  /*                         ÖZET HESAPLAMALARI                              */
  /* ---------------------------------------------------------------------- */

  const monthlyTotalTL =
    safeList.reduce(
      (
        total,
        subscription
      ) => {
        if (
          !subscription ||
          subscription.status ===
            'cancelled'
        ) {
          return total;
        }

        const priceInTL =
          convertToTL(
            subscription.price,
            subscription.currency ||
              'TRY',
            exchangeRates
          );

        if (
          subscription.period ===
          'yearly'
        ) {
          return (
            total +
            priceInTL / 12
          );
        }

        return (
          total +
          priceInTL
        );
      },
      0
    );

  const dailyAverageTL =
    monthlyTotalTL / 30;

  const yearlyProjectionTL =
    monthlyTotalTL * 12;

  /* ---------------------------------------------------------------------- */
  /*                         ANALİZ HESAPLAMALARI                            */
  /* ---------------------------------------------------------------------- */

  const getDetailedMonthlyBreakdown =
    targetYear => {
      const monthlyTotals =
        Array(12).fill(0);

      const monthlyCategoryBreakdown =
        Array.from(
          {
            length: 12
          },
          () => []
        );

      for (
        let monthIndex = 0;
        monthIndex < 12;
        monthIndex += 1
      ) {
        let monthTotal = 0;

        const categoryTotals =
          {};

        safeList.forEach(
          subscription => {
            const category =
              subscription.category ||
              'Diğer';

            const amount =
              getSubscriptionCostForMonth(
                subscription,
                targetYear,
                monthIndex,
                exchangeRates
              );

            if (amount <= 0) {
              return;
            }

            monthTotal += amount;

            categoryTotals[
              category
            ] =
              (
                categoryTotals[
                  category
                ] || 0
              ) + amount;
          }
        );

        monthlyTotals[
          monthIndex
        ] = monthTotal;

        monthlyCategoryBreakdown[
          monthIndex
        ] = Object.entries(
          categoryTotals
        )
          .sort(
            (a, b) =>
              b[1] -
              a[1]
          )
          .map(
            ([
              category,
              amount
            ]) => ({
              category,
              amount,

              color:
                CATEGORY_COLORS[
                  category
                ] ||
                CATEGORY_COLORS
                  .Diğer
            })
          );
      }

      return {
        monthlyTotals,
        monthlyCategoryBreakdown
      };
    };

  const {
    monthlyTotals,
    monthlyCategoryBreakdown
  } =
    getDetailedMonthlyBreakdown(
      selectedAnalysisYear
    );

  const totalYearlyExpense =
    monthlyTotals.reduce(
      (
        total,
        amount
      ) =>
        total + amount,
      0
    );

  const monthsWithExpense =
    monthlyTotals.filter(
      amount =>
        amount > 0
    ).length;

  const averageMonthlyExpense =
    monthsWithExpense > 0
      ? totalYearlyExpense /
        monthsWithExpense
      : 0;

  const maxMonthlyExpense =
    Math.max(
      ...monthlyTotals,
      1
    );

  const yearlyPaymentMethodStats =
    safeList.reduce(
      (
        accumulator,
        subscription
      ) => {
        const paymentMethod =
          subscription.paymentMethod ||
          'Nakit / Diğer';

        const yearlyAmount =
          Array.from(
            {
              length: 12
            },
            (
              _,
              monthIndex
            ) =>
              getSubscriptionCostForMonth(
                subscription,
                selectedAnalysisYear,
                monthIndex,
                exchangeRates
              )
          ).reduce(
            (
              total,
              amount
            ) =>
              total + amount,
            0
          );

        if (
          yearlyAmount <= 0
        ) {
          return accumulator;
        }

        accumulator[
          paymentMethod
        ] =
          (
            accumulator[
              paymentMethod
            ] || 0
          ) + yearlyAmount;

        return accumulator;
      },
      {}
    );

  const yearlyCategoryStats =
    safeList.reduce(
      (
        accumulator,
        subscription
      ) => {
        const category =
          subscription.category ||
          'Diğer';

        const yearlyAmount =
          Array.from(
            {
              length: 12
            },
            (
              _,
              monthIndex
            ) =>
              getSubscriptionCostForMonth(
                subscription,
                selectedAnalysisYear,
                monthIndex,
                exchangeRates
              )
          ).reduce(
            (
              total,
              amount
            ) =>
              total + amount,
            0
          );

        if (
          yearlyAmount <= 0
        ) {
          return accumulator;
        }

        accumulator[
          category
        ] =
          (
            accumulator[
              category
            ] || 0
          ) + yearlyAmount;

        return accumulator;
      },
      {}
    );

  const sortedPaymentMethodEntries =
    Object.entries(
      yearlyPaymentMethodStats
    ).sort(
      (a, b) =>
        b[1] -
        a[1]
    );

  const sortedCategoryEntries =
    Object.entries(
      yearlyCategoryStats
    ).sort(
      (a, b) =>
        b[1] -
        a[1]
    );

  const topCategoryLabel =
    sortedCategoryEntries[
      0
    ]?.[0] || '-';

  const mostExpensiveSubscription =
    safeList.reduce(
      (
        currentHighest,
        subscription
      ) => {
        if (
          subscription.status ===
          'cancelled'
        ) {
          return currentHighest;
        }

        const priceInTL =
          convertToTL(
            subscription.price,
            subscription.currency ||
              'TRY',
            exchangeRates
          );

        const monthlyEquivalent =
          subscription.period ===
          'yearly'
            ? priceInTL / 12
            : priceInTL;

        if (
          !currentHighest ||
          monthlyEquivalent >
            currentHighest
              .monthlyEquivalent
        ) {
          return {
            item:
              subscription,

            monthlyEquivalent
          };
        }

        return currentHighest;
      },
      null
    );

  const todayForRenewals =
    new Date();

  const upcomingRenewals =
    safeList
      .filter(
        subscription =>
          subscription.status !==
          'cancelled'
      )
      .map(
        subscription => {
          const nextDate =
            getNextRenewal(
              subscription,
              todayForRenewals
            );

          const todayStart =
            new Date(
              todayForRenewals
                .getFullYear(),
              todayForRenewals
                .getMonth(),
              todayForRenewals
                .getDate()
            );

          const daysUntil =
            Math.round(
              (
                nextDate -
                todayStart
              ) /
                86400000
            );

          return {
            item:
              subscription,

            nextDate,

            daysUntil
          };
        }
      )
      .filter(
        renewal =>
          renewal.daysUntil >=
            0 &&
          renewal.daysUntil <=
            14
      )
      .sort(
        (a, b) =>
          a.daysUntil -
          b.daysUntil
      );

  /* ---------------------------------------------------------------------- */
  /*                     ABONELİK FORMUNU AÇMA/KAPATMA                       */
  /* ---------------------------------------------------------------------- */

  const openSubscriptionForm =
    (
      item = null
    ) => {
      if (item) {
        setEditingId(
          item.id
        );

        setFormName(
          item.name || ''
        );

        setFormPrice(
          String(
            item.price || ''
          )
        );

        setFormCurrency(
          item.currency ||
          'TRY'
        );

        setFormDay(
          String(
            item.billingDay ||
              '1'
          )
        );

        setFormMonth(
          String(
            item.billingMonth ||
              calendarMonth + 1
          )
        );

        setFormYear(
          String(
            item.billingYear ||
              calendarYear
          )
        );

        setFormCategory(
          item.category ||
          'Diğer'
        );

        setFormPaymentMethod(
          item.paymentMethod ||
          safePaymentMethods[
            0
          ] ||
          ''
        );

        setFormPeriod(
          item.period ||
          'monthly'
        );

        setFormCancelUrl(
          item.cancelUrl ||
          ''
        );

        setFormColor(
          item.color ||
          getServiceColor(
            item.name,
            safeTemplates
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

        setFormCurrency(
          'TRY'
        );

        setFormDay('1');

        setFormMonth(
          String(
            currentDate.getMonth() +
              1
          )
        );

        setFormYear(
          String(
            clampedYear
          )
        );

        setFormCategory(
          'Eğlence'
        );

        setFormPaymentMethod(
          safePaymentMethods[
            0
          ] ||
          DEFAULT_PAYMENT_METHODS[
            0
          ]
        );

        setFormPeriod(
          'monthly'
        );

        setFormCancelUrl('');

        setFormColor(
          '#6366f1'
        );

        setFormNotificationDays(
          2
        );
      }

      setShowTemplateForm(
        false
      );

      setShowPaymentMethodForm(
        false
      );

      setIsSubscriptionModalOpen(
        true
      );
    };

  const closeSubscriptionForm =
    () => {
      setIsSubscriptionModalOpen(
        false
      );

      setEditingId(null);

      setShowTemplateForm(
        false
      );

      setShowPaymentMethodForm(
        false
      );
    };

  /* ---------------------------------------------------------------------- */
  /*                         ABONELİK KAYDETME                               */
  /* ---------------------------------------------------------------------- */

  const handleSaveSubscription =
    () => {
      const preservedScrollPosition =
        mainScrollPositionRef.current;

      const normalizedPrice =
        String(
          formPrice
        ).replace(
          ',',
          '.'
        );

      const numericPrice =
        Number(
          normalizedPrice
        );

      const numericDay =
        Number(formDay);

      const numericMonth =
        Number(formMonth);

      const numericYear =
        Number(formYear);

      if (
        !formName.trim()
      ) {
        alert(
          'Lütfen abonelik veya gider adını giriniz.'
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
          'Lütfen sıfırdan büyük geçerli bir tutar giriniz.'
        );

        return;
      }

      if (
        !Number.isInteger(
          numericMonth
        ) ||
        numericMonth < 1 ||
        numericMonth > 12
      ) {
        alert(
          'Ay değeri 1 ile 12 arasında olmalıdır.'
        );

        return;
      }

      if (
        !YEARS.includes(
          numericYear
        )
      ) {
        alert(
          'Lütfen geçerli bir yıl seçiniz.'
        );

        return;
      }

      const maximumDay =
        getDaysInMonth(
          numericMonth - 1,
          numericYear
        );

      if (
        !Number.isInteger(
          numericDay
        ) ||
        numericDay < 1 ||
        numericDay >
          maximumDay
      ) {
        alert(
          `Seçilen ay için gün 1 ile ${maximumDay} arasında olmalıdır.`
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
          'Yönetim bağlantısı http:// veya https:// ile başlamalıdır.'
        );

        return;
      }

      /*
        Aynı isim ve aynı ödeme periyoduna sahip
        aktif bir kayıt bulunursa kullanıcı uyarılır.
      */
      const duplicateSubscription =
        safeList.find(
          subscription =>
            subscription.id !==
              editingId &&
            normalizeText(
              subscription.name
            ) ===
              normalizeText(
                formName
              ) &&
            subscription.period ===
              formPeriod &&
            subscription.status !==
              'cancelled'
        );

      if (
        duplicateSubscription
      ) {
        setDuplicateWarning({
          visible: true,
          name:
            duplicateSubscription.name ||
            formName.trim()
        });

        return;
      }

      const existingSubscription =
        safeList.find(
          subscription =>
            subscription.id ===
            editingId
        );
         const payload = {
        ...existingSubscription,

        id:
          editingId ||
          String(
            Date.now()
          ),

        name:
          formName.trim(),

        price:
          String(
            numericPrice
          ),

        currency:
          formCurrency,

        billingDay:
          String(
            numericDay
          ),

        billingMonth:
          String(
            numericMonth
          ),

        billingYear:
          String(
            numericYear
          ),

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
          existingSubscription
            ?.status ||
          'active'
      };

      const updatedSubscriptions =
        editingId
          ? safeList.map(
              subscription =>
                subscription.id ===
                editingId
                  ? payload
                  : subscription
            )
          : [
              ...safeList,
              payload
            ];

      setSubscriptions(
        updatedSubscriptions
      );

      closeSubscriptionForm();

      /*
        Modal kapandıktan ve liste yeniden render edildikten sonra
        kullanıcının önceki kaydırma konumu geri yüklenir.
      */
      restoreMainScrollPosition(
        preservedScrollPosition
      );
    };

  /* ---------------------------------------------------------------------- */
  /*                         ABONELİK SİLME                                  */
  /* ---------------------------------------------------------------------- */

  const handleDeleteSubscription =
    id => {
      const preservedScrollPosition =
        mainScrollPositionRef.current;

      const targetSubscription =
        safeList.find(
          subscription =>
            subscription.id === id
        );

      const confirmed =
        confirmAction(
          `“${
            targetSubscription?.name ||
            'Bu kayıt'
          }” kalıcı olarak silinsin mi?`
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

      restoreMainScrollPosition(
        preservedScrollPosition
      );
    };

  /* ---------------------------------------------------------------------- */
  /*                             ŞABLONLAR                                   */
  /* ---------------------------------------------------------------------- */

  const addTemplate = () => {
    const numericPrice =
      Number(
        String(
          newTemplatePrice
        ).replace(
          ',',
          '.'
        )
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
        'Lütfen sıfırdan büyük geçerli bir şablon fiyatı giriniz.'
      );

      return;
    }

    const templateAlreadyExists =
      safeTemplates.some(
        template =>
          normalizeText(
            template.name
          ) ===
          normalizeText(
            newTemplateName
          )
      );

    if (
      templateAlreadyExists
    ) {
      alert(
        'Bu isimde bir şablon zaten bulunuyor.'
      );

      return;
    }

    const templateColor =
      TEMPLATE_COLOR_PALETTE[
        safeTemplates.length %
        TEMPLATE_COLOR_PALETTE.length
      ];

    setTemplatesList([
      ...safeTemplates,
      {
        name:
          newTemplateName.trim(),

        price:
          String(
            numericPrice
          ),

        currency:
          newTemplateCurrency,

        category:
          newTemplateCategory,

        color:
          templateColor
      }
    ]);

    setNewTemplateName('');

    setNewTemplatePrice('');

    setNewTemplateCurrency(
      'TRY'
    );

    setNewTemplateCategory(
      'Diğer'
    );

    setShowTemplateForm(
      false
    );
  };

  const removeTemplate =
    index => {
      const targetTemplate =
        safeTemplates[index];

      const confirmed =
        confirmAction(
          `“${
            targetTemplate?.name ||
            'Bu şablon'
          }” silinsin mi?`
        );

      if (!confirmed) {
        return;
      }

      setTemplatesList(
        safeTemplates.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
      );
    };

  /* ---------------------------------------------------------------------- */
  /*                         ÖDEME YÖNTEMLERİ                                */
  /* ---------------------------------------------------------------------- */

  const addPaymentMethod = () => {
    const methodName =
      newPaymentMethodName.trim();

    if (!methodName) {
      alert(
        'Lütfen ödeme yöntemi adını giriniz.'
      );

      return;
    }

    const methodAlreadyExists =
      safePaymentMethods.some(
        method =>
          normalizeText(
            method
          ) ===
          normalizeText(
            methodName
          )
      );

    if (methodAlreadyExists) {
      alert(
        'Bu ödeme yöntemi zaten bulunuyor.'
      );

      return;
    }

    setPaymentMethodsList([
      ...safePaymentMethods,
      methodName
    ]);

    setFormPaymentMethod(
      methodName
    );

    setNewPaymentMethodName('');

    setShowPaymentMethodForm(
      false
    );
  };

  const removePaymentMethod =
    paymentMethod => {
      const usageCount =
        safeList.filter(
          subscription =>
            subscription.paymentMethod ===
            paymentMethod
        ).length;

      if (usageCount > 0) {
        alert(
          `Bu ödeme yöntemi ${usageCount} kayıtta kullanılıyor. Önce ilgili kayıtların ödeme yöntemini değiştiriniz.`
        );

        return;
      }

      const confirmed =
        confirmAction(
          `“${paymentMethod}” ödeme yöntemi silinsin mi?`
        );

      if (!confirmed) {
        return;
      }

      const updatedMethods =
        safePaymentMethods.filter(
          method =>
            method !==
            paymentMethod
        );

      setPaymentMethodsList(
        updatedMethods
      );

      if (
        formPaymentMethod ===
        paymentMethod
      ) {
        setFormPaymentMethod(
          updatedMethods[0] ||
          ''
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /*                         CSV VE JSON İŞLEMLERİ                           */
  /* ---------------------------------------------------------------------- */

  const handleExportCSV = () => {
    if (safeList.length === 0) {
      alert(
        'Dışa aktarılacak kayıt bulunmuyor.'
      );

      return;
    }

    let csvContent =
      '\uFEFFServis Adi;Fiyat;Para Birimi;Kategori;Odeme Yontemi;Periyot;Odeme Gunu;Odeme Ayi;Odeme Yili\n';

    safeList.forEach(
      subscription => {
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
      }
    );

    const csvBlob =
      new Blob(
        [csvContent],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );

    const fileUrl =
      URL.createObjectURL(
        csvBlob
      );

    const downloadLink =
      document.createElement(
        'a'
      );

    downloadLink.setAttribute(
      'href',
      fileUrl
    );

    downloadLink.setAttribute(
      'download',
      `cebin_abonelikler_${calendarYear}.csv`
    );

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
      downloadLink
    );

    URL.revokeObjectURL(
      fileUrl
    );
  };

  const handleExportJSON = () => {
    const backupData = {
      version: 3,

      exportedAt:
        new Date().toISOString(),

      subscriptions:
        safeList,

      templates:
        safeTemplates,

      paymentMethods:
        safePaymentMethods,

      exchangeRates,

      appearance: {
        backgroundPreset,
        fontScaleKey
      }
    };

    const fileContent =
      JSON.stringify(
        backupData,
        null,
        2
      );

    const backupBlob =
      new Blob(
        [fileContent],
        {
          type:
            'application/json;charset=utf-8;'
        }
      );

    const fileUrl =
      URL.createObjectURL(
        backupBlob
      );

    const downloadLink =
      document.createElement(
        'a'
      );

    downloadLink.setAttribute(
      'href',
      fileUrl
    );

    downloadLink.setAttribute(
      'download',
      `cebin_yedek_${Date.now()}.json`
    );

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
      downloadLink
    );

    URL.revokeObjectURL(
      fileUrl
    );
  };

  const handleImportJSON = () => {
    if (
      typeof document ===
      'undefined'
    ) {
      return;
    }

    const fileInput =
      document.createElement(
        'input'
      );

    fileInput.type = 'file';

    fileInput.accept =
      'application/json,.json';

    fileInput.onchange =
      async event => {
        try {
          const selectedFile =
            event.target
              .files?.[0];

          if (!selectedFile) {
            return;
          }

          const fileText =
            await selectedFile.text();

          const parsedBackup =
            JSON.parse(
              fileText
            );
                   const importedSubscriptions =
            Array.isArray(
              parsedBackup
            )
              ? parsedBackup
              : parsedBackup
                  .subscriptions;

          if (
            !Array.isArray(
              importedSubscriptions
            )
          ) {
            throw new Error(
              'Abonelik listesi bulunamadı.'
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
              parsedBackup
                .templates
            )
          ) {
            setTemplatesList(
              parsedBackup
                .templates
            );
          }

          if (
            Array.isArray(
              parsedBackup
                .paymentMethods
            )
          ) {
            setPaymentMethodsList(
              parsedBackup
                .paymentMethods
            );
          }

          if (
            parsedBackup
              .exchangeRates
          ) {
            setExchangeRates({
              USD:
                Number(
                  parsedBackup
                    .exchangeRates
                    .USD
                ) ||
                DEFAULT_RATES.USD,

              EUR:
                Number(
                  parsedBackup
                    .exchangeRates
                    .EUR
                ) ||
                DEFAULT_RATES.EUR
            });
          }

          const importedAppearance =
            parsedBackup
              .appearance;

          if (
            importedAppearance &&
            BACKGROUND_PRESETS[
              importedAppearance
                .backgroundPreset
            ]
          ) {
            setBackgroundPreset(
              importedAppearance
                .backgroundPreset
            );
          }

          if (
            importedAppearance &&
            FONT_SCALE_OPTIONS.some(
              option =>
                option.key ===
                importedAppearance
                  .fontScaleKey
            )
          ) {
            setFontScaleKey(
              importedAppearance
                .fontScaleKey
            );
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

    fileInput.click();
  };

  /* ---------------------------------------------------------------------- */
  /*                         TAKVİM VE STİL HAZIRLIĞI                        */
  /* ---------------------------------------------------------------------- */

  const daysInCurrentMonth =
    getDaysInMonth(
      calendarMonth,
      calendarYear
    );

  const firstDayOffset =
    (
      new Date(
        calendarYear,
        calendarMonth,
        1
      ).getDay() + 6
    ) % 7;

  const styles =
    createStyles(
      theme,
      isMobile,
      fontScale
    );

  const handleAnalysisYearChange =
    year => {
      scrollMainToTop(false);

      setSelectedAnalysisYear(
        year
      );
    };

  const handleTabChange =
    tabKey => {
      scrollMainToTop(false);

      setActiveTab(
        tabKey
      );
    };

  /* ---------------------------------------------------------------------- */
  /*                                EKRAN                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme.bg
        }
      ]}
    >
      <StatusBar
        barStyle={
          theme.dark
            ? 'light-content'
            : 'dark-content'
        }
      />

      <View
        style={[
          styles.appWrapper,

          isDesktop &&
            styles.appWrapperDesktop
        ]}
      >
        {isDesktop && (
          <View
            style={[
              styles.sidebarContainer,
              {
                backgroundColor:
                  theme.sidebarBg,

                borderRightColor:
                  theme.cardBorder
              }
            ]}
          >
            <View
              style={
                styles.sidebarHeader
              }
            >
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color:
                      theme.textPrimary
                  }
                ]}
              >
                Cebin
              </Text>

              <View
                style={
                  styles.proBadge
                }
              >
                <Text
                  style={
                    styles.proBadgeText
                  }
                >
                  PRO
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color:
                    theme.textSecondary
                }
              ]}
            >
              Akıllı Abonelik & Bütçe Asistanı
            </Text>

            <View
              style={
                styles.sidebarNavGroup
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
                  label:
                    'Takvim'
                },
                {
                  key: 'analytics',
                  icon: '📊',
                  label:
                    'Analiz & Raporlar'
                }
              ].map(navItem => (
                <TouchableOpacity
                  key={
                    navItem.key
                  }
                  style={[
                    styles.sidebarNavButton,

                    activeTab ===
                      navItem.key &&
                      styles.sidebarNavButtonActive
                  ]}
                  onPress={() =>
                    handleTabChange(
                      navItem.key
                    )
                  }
                >
                  <Text
                    style={
                      styles.sidebarNavIcon
                    }
                  >
                    {navItem.icon}
                  </Text>

                  <Text
                    style={[
                      styles.sidebarNavText,
                      {
                        color:
                          activeTab ===
                          navItem.key
                            ? '#9b98ff'
                            : theme.textSecondary
                      }
                    ]}
                  >
                    {navItem.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={
                styles.sidebarFooter
              }
            >
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={
                  handleExportCSV
                }
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  📄 CSV Excel İndir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={
                  handleExportJSON
                }
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color:
                        theme.accent
                    }
                  ]}
                >
                  💾 JSON Yedek Al
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={
                  handleImportJSON
                }
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color:
                        theme.textSecondary
                    }
                  ]}
                >
                  ↩️ Yedeği Geri Yükle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.primaryButton
                }
                onPress={() =>
                  openSubscriptionForm()
                }
              >
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  + Yeni Abonelik Ekle
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          style={
            styles.contentWrapper
          }
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor:
                  theme.headerBg,

                borderBottomColor:
                  theme.cardBorder
              }
            ]}
          >
            <View
              style={
                styles.pageHeaderInfo
              }
            >
              <Text
                style={[
                  styles.pageHeaderTitle,
                  {
                    color:
                      theme.textPrimary
                  }
                ]}
              >
                {activeTab === 'list'
                  ? 'Abonelikler'
                  : activeTab === 'calendar'
                    ? 'Ödeme Takvimi'
                    : 'Finansal Analiz'}
              </Text>

              <Text
                style={[
                  styles.pageHeaderDescription,
                  {
                    color:
                      theme.textSecondary
                  }
                ]}
              >
                {activeTab === 'list'
                  ? 'Aboneliklerinizi ve düzenli ödemelerinizi yönetin.'
                  : activeTab === 'calendar'
                    ? 'Yaklaşan ödeme tarihlerini takvim üzerinden takip edin.'
                    : 'Harcama eğilimlerinizi ve yıllık maliyetlerinizi inceleyin.'}
              </Text>
            </View>

            <View
              style={
                styles.headerActions
              }
            >
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={() =>
                  setIsAppearanceModalOpen(
                    true
                  )
                }
              >
                <Text
                  style={
                    styles.iconButtonText
                  }
                >
                  ⚙️
                </Text>
              </TouchableOpacity>

              {!isDesktop && (
                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }
                  onPress={() =>
                    openSubscriptionForm()
                  }
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    + Ekle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            ref={
              mainScrollRef
            }
            style={[
              styles.mainScroll,
              {
                overflowAnchor:
                  'none',

                scrollbarWidth:
                  'thin',

                scrollbarColor:
                  `${theme.cardBorder} transparent`
              }
            ]}
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator={
              true
            }
            scrollEventThrottle={16}
            onScroll={event => {
              mainScrollPositionRef.current =
                event.nativeEvent
                  .contentOffset.y;
            }}
          >
            {activeTab !==
              'analytics' && (
              <View
                style={[
                  styles.currencyBar,
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
                    styles.currencyBarLeft
                  }
                >
                  <View
                    style={[
                      styles.currencyIconBox,
                      {
                        backgroundColor:
                          theme.activeButtonSoft,

                        borderColor:
                          theme.activeButtonBorder
                      }
                    ]}
                  >
                    <Text
                      style={
                        styles.currencyBarIcon
                      }
                    >
                      💱
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.currencyBarTitle,
                      {
                        color:
                          theme.textPrimary
                      }
                    ]}
                  >
                    Döviz Kurları
                  </Text>
                </View>

                <View
                  style={
                    styles.currencyBadgeGroup
                  }
                >
                  <View
                    style={[
                      styles.currencyBadge,
                      {
                        backgroundColor:
                          theme.activeButtonSoft,

                        borderColor:
                          theme.activeButtonBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyBadgeText,
                        {
                          color:
                            theme.accent
                        }
                      ]}
                    >
                      USD:{' '}
                      {Number(
                        exchangeRates.USD
                      ).toFixed(2)} ₺
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.currencyBadge,
                      {
                        backgroundColor:
                          theme.activeButtonSoft,

                        borderColor:
                          theme.activeButtonBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyBadgeText,
                        {
                          color:
                            theme.accent
                        }
                      ]}
                    >
                      EUR:{' '}
                      {Number(
                        exchangeRates.EUR
                      ).toFixed(2)} ₺
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
                    styles.summaryCard,
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
                      styles.summaryLabel
                    }
                  >
                    Aylık Maliyet
                  </Text>

                  <Text
                    style={
                      styles.summaryValue
                    }
                  >
                    {formatCurrency(
                      monthlyTotalTL,
                      'TRY'
                    )}
                  </Text>

                  <View
                    style={
                      styles.summaryStatsRow
                    }
                  >
                    <View
                      style={
                        styles.summaryStatBox
                      }
                    >
                      <Text
                        style={
                          styles.summaryStatLabel
                        }
                      >
                        Günlük Maliyet
                      </Text>

                      <Text
                        style={
                          styles.summaryStatValue
                        }
                      >
                        {formatCurrency(
                          dailyAverageTL,
                          'TRY'
                        )}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.summaryStatBox
                      }
                    >
                      <Text
                        style={
                          styles.summaryStatLabel
                        }
                      >
                        Yıllık Toplam Maliyet
                      </Text>

                      <Text
                        style={
                          styles.summaryStatValue
                        }
                      >
                        {formatCurrency(
                          yearlyProjectionTL,
                          'TRY'
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor:
                        theme.inputBg,

                      color:
                        theme.textPrimary,

                      borderColor:
                        theme.cardBorder
                    }
                  ]}
                  placeholder="Abonelik, kategori veya ödeme yöntemi ara..."
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
                    styles.singleFilterSection
                  }
                >
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color:
                          theme.textPrimary
                      }
                    ]}
                  >
                    Görünüm Filtresi
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                    contentContainerStyle={
                      styles.horizontalOptionRow
                    }
                  >
                    {VIEW_FILTER_OPTIONS.map(
                      option => (
                        <TouchableOpacity
                          key={
                            option.key
                          }
                          style={[
                            styles.filterOption,
                            {
                              backgroundColor:
                                theme.cardBg,

                              borderColor:
                                theme.cardBorder
                            },

                            viewFilter ===
                              option.key &&
                              styles.filterOptionActive
                          ]}
                          onPress={() =>
                            setViewFilter(
                              option.key
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.filterOptionText,
                              {
                                color:
                                  theme.textSecondary
                              },

                              viewFilter ===
                                option.key &&
                                styles.filterOptionTextActive
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View> 
                <View
                  style={
                    styles.sectionTitleRow
                  }
                >
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color:
                          theme.textPrimary
                      }
                    ]}
                  >
                    {selectedViewFilterLabel}
                  </Text>

                  <Text
                    style={[
                      styles.resultCount,
                      {
                        color:
                          theme.textMuted
                      }
                    ]}
                  >
                    {filteredSubscriptions.length} kayıt
                  </Text>
                </View>

                {filteredSubscriptions.length ===
                0 ? (
                  <View
                    style={[
                      styles.emptyCard,
                      {
                        backgroundColor:
                          theme.cardBg,

                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={
                        styles.emptyIcon
                      }
                    >
                      💳
                    </Text>

                    <Text
                      style={[
                        styles.emptyTitle,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                    >
                      Kayıt bulunamadı
                    </Text>

                    <Text
                      style={[
                        styles.emptyDescription,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Arama metnini veya görünüm filtresini değiştiriniz.
                    </Text>
                  </View>
                ) : (
                  filteredSubscriptions.map(
                    subscription => {
                      const priceInTL =
                        convertToTL(
                          subscription.price,
                          subscription.currency ||
                            'TRY',
                          exchangeRates
                        );

                      const notificationOption =
                        NOTIFICATION_OPTIONS.find(
                          option =>
                            option.value ===
                            subscription.notificationDays
                        ) ||
                        NOTIFICATION_OPTIONS[3];

                      const serviceColor =
                        subscription.color ||
                        getServiceColor(
                          subscription.name,
                          safeTemplates
                        );

                      const isYearly =
                        subscription.period ===
                        'yearly';

                      return (
                        <View
                          key={
                            subscription.id
                          }
                          style={[
                            styles.subscriptionCard,
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
                              styles.subscriptionMain
                            }
                          >
                            <View
                              style={[
                                styles.serviceIcon,
                                {
                                  backgroundColor:
                                    serviceColor
                                }
                              ]}
                            >
                              <Text
                                style={
                                  styles.serviceIconText
                                }
                              >
                                {subscription.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  'C'}
                              </Text>
                            </View>

                            <View
                              style={
                                styles.subscriptionInfo
                              }
                            >
                              <View
                                style={
                                  styles.subscriptionTitleRow
                                }
                              >
                                <Text
                                  style={[
                                    styles.subscriptionName,
                                    {
                                      color:
                                        theme.textPrimary
                                    }
                                  ]}
                                >
                                  {subscription.name}
                                </Text>

                                <View
                                  style={[
                                    styles.informationTag,
                                    {
                                      backgroundColor:
                                        theme.inputBg,

                                      borderColor:
                                        theme.cardBorder
                                    }
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.informationTagText,
                                      {
                                        color:
                                          theme.textSecondary
                                      }
                                    ]}
                                  >
                                    💳 {subscription.paymentMethod}
                                  </Text>
                                </View>

                                {notificationOption.value !==
                                  -1 && (
                                  <View
                                    style={[
                                      styles.informationTag,
                                      {
                                        backgroundColor:
                                          theme.inputBg,

                                        borderColor:
                                          theme.cardBorder
                                      }
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.informationTagText,
                                        {
                                          color:
                                            theme.accent
                                        }
                                      ]}
                                    >
                                      {notificationOption.badgeLabel}
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <Text
                                style={[
                                  styles.subscriptionSubtitle,
                                  {
                                    color:
                                      theme.textSecondary
                                  }
                                ]}
                              >
                                {subscription.category} •{' '}
                                {isYearly
                                  ? `${subscription.billingDay}/${subscription.billingMonth}/${subscription.billingYear}`
                                  : `Her ayın ${subscription.billingDay}. günü`}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={
                              styles.subscriptionRight
                            }
                          >
                            <Text
                              style={[
                                styles.subscriptionPrice,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {formatCurrency(
                                subscription.price,
                                subscription.currency ||
                                  'TRY'
                              )}{' '}
                              {isYearly
                                ? '/yıl'
                                : '/ay'}
                            </Text>

                            {subscription.currency !==
                              'TRY' && (
                              <Text
                                style={[
                                  styles.convertedPrice,
                                  {
                                    color:
                                      theme.accent
                                  }
                                ]}
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
                                styles.subscriptionActions
                              }
                            >
                              <TouchableOpacity
                                style={[
                                  styles.smallActionButton,
                                  {
                                    backgroundColor:
                                      theme.inputBg,

                                    borderColor:
                                      theme.cardBorder
                                  }
                                ]}
                                onPress={() =>
                                  openSubscriptionForm(
                                    subscription
                                  )
                                }
                              >
                                <Text
                                  style={[
                                    styles.smallActionText,
                                    {
                                      color:
                                        theme.textSecondary
                                    }
                                  ]}
                                >
                                  Düzenle
                                </Text>
                              </TouchableOpacity>

                              {subscription.cancelUrl ? (
                                <TouchableOpacity
                                  style={[
                                    styles.smallActionButton,
                                    {
                                      backgroundColor:
                                        theme.inputBg,

                                      borderColor:
                                        theme.cardBorder
                                    }
                                  ]}
                                  onPress={() =>
                                    Linking.openURL(
                                      subscription.cancelUrl
                                    )
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.smallActionText,
                                      {
                                        color:
                                          theme.accent
                                      }
                                    ]}
                                  >
                                    Yönet
                                  </Text>
                                </TouchableOpacity>
                              ) : null}

                              <TouchableOpacity
                                style={[
                                  styles.deleteButton,
                                  {
                                    backgroundColor:
                                      theme.inputBg,

                                    borderColor:
                                      theme.cardBorder
                                  }
                                ]}
                                onPress={() =>
                                  handleDeleteSubscription(
                                    subscription.id
                                  )
                                }
                              >
                                <Text
                                  style={
                                    styles.deleteButtonText
                                  }
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
                style={
                  styles.calendarSection
                }
              >
                <View
                  style={
                    styles.calendarNavigation
                  }
                >
                  <TouchableOpacity
                    style={[
                      styles.calendarNavigationButton,
                      {
                        backgroundColor:
                          theme.inputBg,

                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                    onPress={() => {
                      if (
                        calendarMonth === 0
                      ) {
                        setCalendarMonth(
                          11
                        );

                        setCalendarYear(
                          Math.max(
                            YEARS[0],
                            calendarYear - 1
                          )
                        );
                      } else {
                        setCalendarMonth(
                          calendarMonth - 1
                        );
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.calendarNavigationText,
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
                      styles.calendarTitle,
                      {
                        color:
                          theme.textPrimary
                      }
                    ]}
                  >
                    {MONTH_NAMES[
                      calendarMonth
                    ]}{' '}
                    {calendarYear}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.calendarNavigationButton,
                      {
                        backgroundColor:
                          theme.inputBg,

                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                    onPress={() => {
                      if (
                        calendarMonth === 11
                      ) {
                        setCalendarMonth(
                          0
                        );

                        setCalendarYear(
                          Math.min(
                            YEARS[
                              YEARS.length - 1
                            ],
                            calendarYear + 1
                          )
                        );
                      } else {
                        setCalendarMonth(
                          calendarMonth + 1
                        );
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.calendarNavigationText,
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
                  contentContainerStyle={
                    styles.horizontalOptionRow
                  }
                >
                  {YEARS.map(
                    year => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearButton,
                          {
                            backgroundColor:
                              theme.cardBg,

                            borderColor:
                              theme.cardBorder
                          },

                          calendarYear ===
                            year &&
                            styles.yearButtonActive
                        ]}
                        onPress={() =>
                          setCalendarYear(
                            year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.yearButtonText,
                            {
                              color:
                                theme.textSecondary
                            },

                            calendarYear ===
                              year &&
                              styles.yearButtonTextActive
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>

                <View
                  style={
                    styles.calendarContainer
                  }
                >
                  <View
                    style={
                      styles.calendarWeekHeader
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
                    ].map(dayName => (
                      <View
                        key={dayName}
                        style={
                          styles.calendarWeekDay
                        }
                      >
                        <Text
                          style={[
                            styles.calendarWeekDayText,
                            {
                              color:
                                theme.textSecondary
                            }
                          ]}
                        >
                          {dayName}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View
                    style={
                      styles.calendarGrid
                    }
                  >
                    {Array.from({
                      length:
                        firstDayOffset
                    }).map(
                      (
                        _,
                        emptyIndex
                      ) => (
                        <View
                          key={`empty-${emptyIndex}`}
                          style={[
                            styles.calendarDay,
                            styles.calendarDayEmpty
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
                        dayIndex
                      ) => {
                        const dayNumber =
                          dayIndex + 1;

                        const subscriptionsForDay =
                          safeList.filter(
                            subscription => {
                              if (
                                subscription.status ===
                                'cancelled'
                              ) {
                                return false;
                              }

                              const targetMonthKey =
                                calendarYear *
                                  12 +
                                calendarMonth;

                              const billingMonthKey =
                                (
                                  Number(
                                    subscription.billingYear
                                  ) ||
                                  calendarYear
                                ) *
                                  12 +
                                (
                                  (
                                    Number(
                                      subscription.billingMonth
                                    ) ||
                                    1
                                  ) -
                                  1
                                );

                              if (
                                targetMonthKey <
                                billingMonthKey
                              ) {
                                return false;
                              }

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

                              return (
                                Number(
                                  subscription.billingDay
                                ) ===
                                  dayNumber &&
                                Number(
                                  subscription.billingMonth
                                ) ===
                                  calendarMonth +
                                    1 &&
                                Number(
                                  subscription.billingYear
                                ) ===
                                  calendarYear
                              );
                            }
                          );

                        const hasSubscription =
                          subscriptionsForDay.length >
                          0;

                        return (
                          <View
                            key={
                              dayNumber
                            }
                            style={[
                              styles.calendarDay,
                              {
                                backgroundColor:
                                  theme.cardBg,

                                borderColor:
                                  hasSubscription
                                    ? theme.activeButtonBorder
                                    : theme.cardBorder
                              },

                              hasSubscription &&
                                styles.calendarDayActive
                            ]}
                          >
                            <Text
                              style={[
                                styles.calendarDayNumber,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {dayNumber}
                            </Text>

                            <ScrollView
                              style={
                                styles.calendarDayScroll
                              }
                              contentContainerStyle={
                                styles.calendarDayScrollContent
                              }
                              nestedScrollEnabled
                              showsVerticalScrollIndicator={
                                subscriptionsForDay.length >
                                3
                              }
                            >
                              {subscriptionsForDay.map(
                                subscription => {
                                  const badgeColor =
                                    subscription.color ||
                                    CATEGORY_COLORS[
                                      subscription.category
                                    ] ||
                                    CATEGORY_COLORS
                                      .Diğer;

                                  return (
                                    <View
                                      key={
                                        subscription.id
                                      }
                                      style={[
                                        styles.calendarSubscriptionBadge,
                                        {
                                          backgroundColor:
                                            badgeColor
                                        }
                                      ]}
                                    >
                                      <Text
                                        style={
                                          styles.calendarSubscriptionName
                                        }
                                        numberOfLines={
                                          1
                                        }
                                      >
                                        {subscription.name}
                                      </Text>

                                      <Text
                                        style={
                                          styles.calendarSubscriptionPrice
                                        }
                                      >
                                        {formatShortCurrency(
                                          convertToTL(
                                            subscription.price,
                                            subscription.currency,
                                            exchangeRates
                                          ),
                                          'TRY'
                                        )}
                                      </Text>
                                    </View>
                                  );
                                }
                              )}
                            </ScrollView>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>
              </View>
            )}
            {activeTab ===
              'analytics' && (
              <View
                style={
                  styles.analyticsSection
                }
              >
                <Text
                  style={[
                    styles.pageTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Finansal Analiz & Raporlar
                </Text>

                <Text
                  style={[
                    styles.pageDescription,
                    {
                      color:
                        theme.textSecondary
                    }
                  ]}
                >
                  Aylık harcama dağılımları, ödeme yöntemleri ve kategori trendleri
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.horizontalOptionRow
                  }
                >
                  {YEARS.map(
                    year => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearButton,
                          {
                            backgroundColor:
                              theme.cardBg,

                            borderColor:
                              theme.cardBorder
                          },

                          selectedAnalysisYear ===
                            year &&
                            styles.yearButtonActive
                        ]}
                        onPress={() =>
                          handleAnalysisYearChange(
                            year
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.yearButtonText,
                            {
                              color:
                                theme.textSecondary
                            },

                            selectedAnalysisYear ===
                              year &&
                              styles.yearButtonTextActive
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>

                <View
                  style={
                    styles.analyticsSummaryRow
                  }
                >
                  <View
                    style={[
                      styles.analyticsSummaryCard,
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
                        styles.analyticsSummaryLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Aylık Ortalama
                    </Text>

                    <Text
                      style={[
                        styles.analyticsSummaryValue,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                    >
                      {formatShortCurrency(
                        averageMonthlyExpense,
                        'TRY'
                      )}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.analyticsSummaryCard,
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
                        styles.analyticsSummaryLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      En Yüksek Kategori
                    </Text>

                    <Text
                      style={[
                        styles.analyticsSummaryValue,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {topCategoryLabel}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.analyticsSummaryCard,
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
                        styles.analyticsSummaryLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      En Pahalı Abonelik
                    </Text>

                    <Text
                      style={[
                        styles.analyticsSummaryValue,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {mostExpensiveSubscription
                        ?.item?.name ||
                        '-'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.analyticsSummaryCard,
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
                        styles.analyticsSummaryLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Toplam Abonelik
                    </Text>

                    <Text
                      style={[
                        styles.analyticsSummaryValue,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                    >
                      {safeList.length} adet
                    </Text>
                  </View>
                </View>

                {upcomingRenewals.length >
                  0 && (
                  <View
                    style={[
                      styles.panel,
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
                        styles.panelTitle,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                    >
                      ⏰ Yaklaşan Yenilemeler (14 gün)
                    </Text>

                    {upcomingRenewals.map(
                      renewal => {
                        const renewalColor =
                          renewal.item
                            .color ||
                          CATEGORY_COLORS[
                            renewal.item
                              .category
                          ] ||
                          CATEGORY_COLORS
                            .Diğer;

                        return (
                          <View
                            key={
                              renewal.item
                                .id
                            }
                            style={[
                              styles.renewalRow,
                              {
                                borderBottomColor:
                                  theme.cardBorder
                              }
                            ]}
                          >
                            <View
                              style={[
                                styles.renewalDot,
                                {
                                  backgroundColor:
                                    renewalColor
                                }
                              ]}
                            />

                            <Text
                              style={[
                                styles.renewalName,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {renewal.item.name}
                            </Text>

                            <Text
                              style={[
                                styles.renewalDateText,
                                {
                                  color:
                                    renewal.daysUntil <=
                                    2
                                      ? theme.danger
                                      : theme.textSecondary
                                }
                              ]}
                            >
                              {renewal.daysUntil ===
                              0
                                ? 'Bugün'
                                : renewal.daysUntil ===
                                    1
                                  ? 'Yarın'
                                  : `${renewal.daysUntil} gün sonra`}
                            </Text>

                            <Text
                              style={[
                                styles.renewalAmount,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              {formatCurrency(
                                renewal.item
                                  .price,
                                renewal.item
                                  .currency
                              )}
                            </Text>
                          </View>
                        );
                      }
                    )}
                  </View>
                )}

                <View
                  style={[
                    styles.panel,
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
                      styles.panelTitle,
                      {
                        color:
                          theme.textPrimary
                      }
                    ]}
                  >
                    {selectedAnalysisYear} Aylık Harcama Grafiği
                  </Text>

                  <Text
                    style={[
                      styles.panelDescription,
                      {
                        color:
                          theme.textMuted
                      }
                    ]}
                  >
                    Her çubukta o aya ait kategoriler farklı renklerle gösterilir.
                  </Text>

                  <View
                    style={
                      styles.categoryLegend
                    }
                  >
                    {Object.entries(
                      CATEGORY_COLORS
                    ).map(
                      ([
                        category,
                        color
                      ]) => (
                        <View
                          key={category}
                          style={
                            styles.legendItem
                          }
                        >
                          <View
                            style={[
                              styles.legendDot,
                              {
                                backgroundColor:
                                  color
                              }
                            ]}
                          />

                          <Text
                            style={[
                              styles.legendText,
                              {
                                color:
                                  theme.textSecondary
                              }
                            ]}
                          >
                            {category}
                          </Text>
                        </View>
                      )
                    )}
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                    contentContainerStyle={
                      styles.chartScrollContent
                    }
                  >
                    <View
                      style={
                        styles.chartArea
                      }
                    >
                      {monthlyTotals.map(
                        (
                          monthTotal,
                          monthIndex
                        ) => {
                          const heightPercentage =
                            maxMonthlyExpense >
                            0
                              ? (
                                  monthTotal /
                                  maxMonthlyExpense
                                ) * 100
                              : 0;

                          const visibleHeight =
                            monthTotal > 0
                              ? Math.max(
                                  heightPercentage,
                                  8
                                )
                              : 0;

                          const categorySegments =
                            monthlyCategoryBreakdown[
                              monthIndex
                            ] || [];

                          return (
                            <View
                              key={
                                monthIndex
                              }
                              style={
                                styles.chartColumn
                              }
                            >
                              <Text
                                style={[
                                  styles.chartAmount,
                                  {
                                    color:
                                      theme.textSecondary
                                  }
                                ]}
                              >
                                {monthTotal > 0
                                  ? formatShortCurrency(
                                      monthTotal,
                                      'TRY'
                                    )
                                  : ''}
                              </Text>

                              <View
                                style={[
                                  styles.chartTrack,
                                  {
                                    backgroundColor:
                                      theme.inputBg,

                                    borderColor:
                                      theme.cardBorder
                                  }
                                ]}
                              >
                                {monthTotal >
                                  0 && (
                                  <View
                                    style={[
                                      styles.chartStack,
                                      {
                                        height: `${visibleHeight}%`
                                      }
                                    ]}
                                  >
                                    {categorySegments.map(
                                      (
                                        segment,
                                        segmentIndex
                                      ) => (
                                        <View
                                          key={`${segment.category}-${segmentIndex}`}
                                          style={[
                                            styles.chartSegment,
                                            {
                                              height: `${
                                                (
                                                  segment.amount /
                                                  monthTotal
                                                ) *
                                                100
                                              }%`,

                                              backgroundColor:
                                                segment.color
                                            }
                                          ]}
                                        />
                                      )
                                    )}
                                  </View>
                                )}
                              </View>

                              <Text
                                style={[
                                  styles.chartMonthLabel,
                                  {
                                    color:
                                      theme.textPrimary
                                  }
                                ]}
                              >
                                {MONTH_NAMES[
                                  monthIndex
                                ].substring(
                                  0,
                                  3
                                )}
                              </Text>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </ScrollView>

                  <View
                    style={[
                      styles.chartFooter,
                      {
                        borderTopColor:
                          theme.cardBorder
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.chartFooterLabel,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                    >
                      Yıllık Toplam Harcama ({selectedAnalysisYear})
                    </Text>

                    <Text
                      style={[
                        styles.chartFooterValue,
                        {
                          color:
                            theme.accent
                        }
                      ]}
                    >
                      {formatCurrency(
                        totalYearlyExpense,
                        'TRY'
                      )}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.distributionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  💳 Ödeme Yöntemine Göre Harcama Dağılımı
                </Text>

                {sortedPaymentMethodEntries.length ===
                0 ? (
                  <Text
                    style={[
                      styles.noDataText,
                      {
                        color:
                          theme.textSecondary
                      }
                    ]}
                  >
                    Seçilen yıl için ödeme yöntemi verisi bulunamadı.
                  </Text>
                ) : (
                  sortedPaymentMethodEntries.map(
                    ([
                      paymentMethod,
                      amount
                    ]) => {
                      const percentage =
                        totalYearlyExpense >
                        0
                          ? (
                              (
                                amount /
                                totalYearlyExpense
                              ) * 100
                            ).toFixed(
                              1
                            )
                          : 0;

                      return (
                        <View
                          key={
                            paymentMethod
                          }
                          style={[
                            styles.distributionCard,
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
                              styles.distributionHeader
                            }
                          >
                            <Text
                              style={[
                                styles.distributionName,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
                            >
                              💳 {paymentMethod}
                            </Text>

                            <Text
                              style={[
                                styles.distributionAmount,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
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
                              styles.progressTrack,
                              {
                                backgroundColor:
                                  theme.inputBg
                              }
                            ]}
                          >
                            <View
                              style={[
                                styles.progressFill,
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
                  style={[
                    styles.distributionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  📂 Kategori Bazlı Dağılım
                </Text>

                {sortedCategoryEntries.length ===
                0 ? (
                  <Text
                    style={[
                      styles.noDataText,
                      {
                        color:
                          theme.textSecondary
                      }
                    ]}
                  >
                    Seçilen yıl için kategori verisi bulunamadı.
                  </Text>
                ) : (
                  sortedCategoryEntries.map(
                    ([
                      category,
                      amount
                    ]) => {
                      const categoryColor =
                        CATEGORY_COLORS[
                          category
                        ] ||
                        CATEGORY_COLORS
                          .Diğer;

                      const percentage =
                        totalYearlyExpense >
                        0
                          ? (
                              (
                                amount /
                                totalYearlyExpense
                              ) * 100
                            ).toFixed(
                              1
                            )
                          : 0;

                      return (
                        <View
                          key={
                            category
                          }
                          style={[
                            styles.distributionCard,
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
                              styles.distributionHeader
                            }
                          >
                            <View
                              style={
                                styles.distributionNameGroup
                              }
                            >
                              <View
                                style={[
                                  styles.distributionColorDot,
                                  {
                                    backgroundColor:
                                      categoryColor
                                  }
                                ]}
                              />

                              <Text
                                style={[
                                  styles.distributionName,
                                  {
                                    color:
                                      theme.textPrimary
                                  }
                                ]}
                              >
                                {category}
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.distributionAmount,
                                {
                                  color:
                                    theme.textPrimary
                                }
                              ]}
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
                              styles.progressTrack,
                              {
                                backgroundColor:
                                  theme.inputBg
                              }
                            ]}
                          >
                            <View
                              style={[
                                styles.progressFill,
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
              </View>
            )}
          </ScrollView>
          {!isDesktop && (
            <View
              style={[
                styles.bottomNavigation,
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
                }
              ].map(navItem => (
                <TouchableOpacity
                  key={
                    navItem.key
                  }
                  style={
                    styles.bottomNavigationItem
                  }
                  onPress={() =>
                    handleTabChange(
                      navItem.key
                    )
                  }
                >
                  <Text
                    style={
                      styles.bottomNavigationIcon
                    }
                  >
                    {navItem.icon}
                  </Text>

                  <Text
                    style={[
                      styles.bottomNavigationText,
                      {
                        color:
                          activeTab ===
                          navItem.key
                            ? '#9b98ff'
                            : theme.textSecondary
                      }
                    ]}
                  >
                    {navItem.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={
          isAppearanceModalOpen
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setIsAppearanceModalOpen(
            false
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.appearanceModal,
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
                styles.modalHeader
              }
            >
              <View
                style={{
                  flex: 1,
                  paddingRight: 12
                }}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Görünüm Ayarları
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color:
                        theme.textMuted
                    }
                  ]}
                >
                  Arka plan temasını ve yazı boyutunu kişiselleştirin.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.modalCloseButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={() =>
                  setIsAppearanceModalOpen(
                    false
                  )
                }
              >
                <Text
                  style={[
                    styles.modalCloseText,
                    {
                      color:
                        theme.textSecondary
                    }
                  ]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              id="appearance-modal-scroll"
              style={[
                Platform.OS ===
                  'web' && {
                  scrollbarWidth:
                    'thin',

                  scrollbarColor:
                    `${theme.cardBorder} ${theme.inputBg}`
                }
              ]}
              showsVerticalScrollIndicator={
                true
              }
              contentContainerStyle={{
                paddingBottom: 8
              }}
            >
              <Text
                style={[
                  styles.appearanceSectionTitle,
                  {
                    color:
                      theme.textPrimary
                  }
                ]}
              >
                Arka Plan Teması
              </Text>

              <View
                style={
                  styles.appearanceOptionGrid
                }
              >
                {Object.entries(
                  BACKGROUND_PRESETS
                ).map(
                  ([
                    presetKey,
                    preset
                  ]) => (
                    <TouchableOpacity
                      key={
                        presetKey
                      }
                      style={[
                        styles.appearanceThemeOption,
                        {
                          backgroundColor:
                            preset.cardBg,

                          borderColor:
                            backgroundPreset ===
                            presetKey
                              ? theme.activeButtonBorder
                              : preset.cardBorder
                        },

                        backgroundPreset ===
                          presetKey &&
                          styles.appearanceOptionActive
                      ]}
                      onPress={() =>
                        setBackgroundPreset(
                          presetKey
                        )
                      }
                    >
                      <View
                        style={[
                          styles.themePreview,
                          {
                            backgroundColor:
                              preset.bg
                          }
                        ]}
                      >
                        <View
                          style={[
                            styles.themePreviewSidebar,
                            {
                              backgroundColor:
                                preset.sidebarBg
                            }
                          ]}
                        />

                        <View
                          style={
                            styles.themePreviewContent
                          }
                        >
                          <View
                            style={[
                              styles.themePreviewHeader,
                              {
                                backgroundColor:
                                  preset.headerBg
                              }
                            ]}
                          />

                          <View
                            style={[
                              styles.themePreviewCard,
                              {
                                backgroundColor:
                                  preset.summaryBg
                              }
                            ]}
                          />
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.appearanceOptionLabel,
                          {
                            color:
                              preset.textPrimary
                          }
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text
                style={[
                  styles.appearanceSectionTitle,
                  {
                    color:
                      theme.textPrimary
                  }
                ]}
              >
                Yazı Boyutu
              </Text>

              <View
                style={
                  styles.fontScaleRow
                }
              >
                {FONT_SCALE_OPTIONS.map(
                  option => (
                    <TouchableOpacity
                      key={
                        option.key
                      }
                      style={[
                        styles.fontScaleOption,
                        {
                          backgroundColor:
                            theme.inputBg,

                          borderColor:
                            theme.cardBorder
                        },

                        fontScaleKey ===
                          option.key &&
                          styles.fontScaleOptionActive
                      ]}
                      onPress={() =>
                        setFontScaleKey(
                          option.key
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.fontScaleOptionText,
                          {
                            color:
                              theme.textSecondary,

                            fontSize:
                              12 *
                              option.scale
                          },

                          fontScaleKey ===
                            option.key &&
                            styles.fontScaleOptionTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={
                styles.primaryButton
              }
              onPress={() =>
                setIsAppearanceModalOpen(
                  false
                )
              }
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Ayarları Uygula
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={
          isSubscriptionModalOpen
        }
        transparent
        animationType="fade"
        onRequestClose={
          closeSubscriptionForm
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.subscriptionModal,
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
                styles.modalHeader
              }
            >
              <View
                style={{
                  flex: 1,
                  paddingRight: 12
                }}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  {editingId
                    ? 'Abonelik Düzenle'
                    : 'Yeni Abonelik Ekle'}
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color:
                        theme.textMuted
                    }
                  ]}
                >
                  Abonelik veya sabit gider bilgilerini giriniz.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.modalCloseButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={
                  closeSubscriptionForm
                }
              >
                <Text
                  style={[
                    styles.modalCloseText,
                    {
                      color:
                        theme.textSecondary
                    }
                  ]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              id="subscription-modal-scroll"
              style={[
                styles.subscriptionModalScroll,

                Platform.OS ===
                  'web' && {
                  scrollbarWidth:
                    'thin',

                  scrollbarColor:
                    `${theme.cardBorder} ${theme.inputBg}`
                }
              ]}
              contentContainerStyle={
                styles.subscriptionModalContent
              }
              showsVerticalScrollIndicator={
                true
              }
            >
              {!editingId && (
                <View
                  style={
                    styles.formSection
                  }
                >
                  <View
                    style={
                      styles.formSectionHeader
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        paddingRight: 10
                      }}
                    >
                      <Text
                        style={[
                          styles.formSectionTitle,
                          {
                            color:
                              theme.textPrimary
                          }
                        ]}
                      >
                        Hızlı Şablon Seç
                      </Text>

                      <Text
                        style={[
                          styles.formSectionDescription,
                          {
                            color:
                              theme.textMuted
                          }
                        ]}
                      >
                        Hazır bir servis seçerek alanları otomatik doldurun.
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        setShowTemplateForm(
                          !showTemplateForm
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.formSectionAction,
                          {
                            color:
                              theme.accent
                          }
                        ]}
                      >
                        {showTemplateForm
                          ? 'Kapat'
                          : '+ Şablon Ekle'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                    contentContainerStyle={
                      styles.removableOptionRow
                    }
                  >
                    {safeTemplates.map(
                      (
                        template,
                        index
                      ) => (
                        <View
                          key={`${template.name}-${index}`}
                          style={
                            styles.removableOptionWrapper
                          }
                        >
                          <TouchableOpacity
                            style={[
                              styles.templateOption,
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
                              style={
                                styles.templateOptionText
                              }
                              numberOfLines={
                                1
                              }
                            >
                              {template.name}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={
                              styles.removeOptionButton
                            }
                            onPress={() =>
                              removeTemplate(
                                index
                              )
                            }
                          >
                            <Text
                              style={
                                styles.removeOptionText
                              }
                            >
                              ✕
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    )}
                  </ScrollView>
                  {showTemplateForm && (
                    <View
                      style={[
                        styles.inlineForm,
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
                          styles.textInput,
                          {
                            backgroundColor:
                              theme.cardBg,

                            color:
                              theme.textPrimary,

                            borderColor:
                              theme.cardBorder
                          }
                        ]}
                        placeholder="Şablon adı"
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
                        style={
                          styles.inlineInputRow
                        }
                      >
                        <TextInput
                          style={[
                            styles.textInput,
                            styles.flexInput,
                            {
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
                          keyboardType="decimal-pad"
                          value={
                            newTemplatePrice
                          }
                          onChangeText={
                            setNewTemplatePrice
                          }
                        />

                        <View
                          style={
                            styles.currencyOptionRow
                          }
                        >
                          {[
                            'TRY',
                            'USD',
                            'EUR'
                          ].map(
                            currency => (
                              <TouchableOpacity
                                key={
                                  currency
                                }
                                style={[
                                  styles.compactOptionButton,
                                  {
                                    backgroundColor:
                                      theme.cardBg,

                                    borderColor:
                                      theme.cardBorder
                                  },

                                  newTemplateCurrency ===
                                    currency &&
                                    styles.compactOptionButtonActive
                                ]}
                                onPress={() =>
                                  setNewTemplateCurrency(
                                    currency
                                  )
                                }
                              >
                                <Text
                                  style={[
                                    styles.compactOptionText,
                                    {
                                      color:
                                        theme.textSecondary
                                    },

                                    newTemplateCurrency ===
                                      currency &&
                                      styles.compactOptionTextActive
                                  ]}
                                >
                                  {currency}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </View>

                      <View
                        style={
                          styles.wrappedOptionRow
                        }
                      >
                        {Object.keys(
                          CATEGORY_COLORS
                        ).map(
                          category => (
                            <TouchableOpacity
                              key={
                                category
                              }
                              style={[
                                styles.compactOptionButton,
                                {
                                  backgroundColor:
                                    theme.cardBg,

                                  borderColor:
                                    theme.cardBorder
                                },

                                newTemplateCategory ===
                                  category &&
                                  styles.compactOptionButtonActive
                              ]}
                              onPress={() =>
                                setNewTemplateCategory(
                                  category
                                )
                              }
                            >
                              <Text
                                style={[
                                  styles.compactOptionText,
                                  {
                                    color:
                                      theme.textSecondary
                                  },

                                  newTemplateCategory ===
                                    category &&
                                    styles.compactOptionTextActive
                                ]}
                              >
                                {category}
                              </Text>
                            </TouchableOpacity>
                          )
                        )}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.primaryButton,
                          styles.inlineSaveButton
                        ]}
                        onPress={
                          addTemplate
                        }
                      >
                        <Text
                          style={
                            styles.primaryButtonText
                          }
                        >
                          Şablonu Kaydet
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              <View
                style={
                  styles.formSection
                }
              >
                <Text
                  style={[
                    styles.formSectionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Temel Bilgiler
                </Text>

                <View
                  style={[
                    styles.twoColumnRow,
                    isMobile &&
                      styles.singleColumnRow
                  ]}
                >
                  <View
                    style={
                      styles.formColumn
                    }
                  >
                    <Text
                      style={[
                        styles.inputLabel,
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
                        styles.textInput,
                        {
                          backgroundColor:
                            theme.inputBg,

                          color:
                            theme.textPrimary,

                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                      placeholder="Örn: Netflix, Ev Kirası"
                      placeholderTextColor={
                        theme.textMuted
                      }
                      value={
                        formName
                      }
                      onChangeText={
                        setFormName
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.formColumn
                    }
                  >
                    <Text
                      style={[
                        styles.inputLabel,
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
                        styles.textInput,
                        {
                          backgroundColor:
                            theme.inputBg,

                          color:
                            theme.textPrimary,

                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                      placeholder="0,00"
                      placeholderTextColor={
                        theme.textMuted
                      }
                      keyboardType="decimal-pad"
                      value={
                        formPrice
                      }
                      onChangeText={
                        setFormPrice
                      }
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.twoColumnRow,
                    isMobile &&
                      styles.singleColumnRow
                  ]}
                >
                  <View
                    style={
                      styles.formColumn
                    }
                  >
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Para Birimi
                    </Text>

                    <View
                      style={
                        styles.currencyOptionRow
                      }
                    >
                      {[
                        'TRY',
                        'USD',
                        'EUR'
                      ].map(
                        currency => (
                          <TouchableOpacity
                            key={
                              currency
                            }
                            style={[
                              styles.compactOptionButton,
                              styles.flexOptionButton,
                              {
                                backgroundColor:
                                  theme.inputBg,

                                borderColor:
                                  theme.cardBorder
                              },

                              formCurrency ===
                                currency &&
                                styles.compactOptionButtonActive
                            ]}
                            onPress={() =>
                              setFormCurrency(
                                currency
                              )
                            }
                          >
                            <Text
                              style={[
                                styles.compactOptionText,
                                {
                                  color:
                                    theme.textSecondary
                                },

                                formCurrency ===
                                  currency &&
                                  styles.compactOptionTextActive
                              ]}
                            >
                              {currency}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>

                  <View
                    style={
                      styles.formColumn
                    }
                  >
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Ödeme Periyodu
                    </Text>

                    <View
                      style={
                        styles.periodOptionRow
                      }
                    >
                      <TouchableOpacity
                        style={[
                          styles.periodOption,
                          {
                            backgroundColor:
                              theme.inputBg,

                            borderColor:
                              theme.cardBorder
                          },

                          formPeriod ===
                            'monthly' &&
                            styles.periodOptionActive
                        ]}
                        onPress={() =>
                          setFormPeriod(
                            'monthly'
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.periodOptionText,
                            {
                              color:
                                theme.textSecondary
                            },

                            formPeriod ===
                              'monthly' &&
                              styles.periodOptionTextActive
                          ]}
                        >
                          Aylık
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.periodOption,
                          {
                            backgroundColor:
                              theme.inputBg,

                            borderColor:
                              theme.cardBorder
                          },

                          formPeriod ===
                            'yearly' &&
                            styles.periodOptionActive
                        ]}
                        onPress={() =>
                          setFormPeriod(
                            'yearly'
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.periodOptionText,
                            {
                              color:
                                theme.textSecondary
                            },

                            formPeriod ===
                              'yearly' &&
                              styles.periodOptionTextActive
                          ]}
                        >
                          Yıllık
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={
                  styles.formSection
                }
              >
                <View
                  style={
                    styles.formSectionHeader
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      paddingRight: 10
                    }}
                  >
                    <Text
                      style={[
                        styles.formSectionTitle,
                        {
                          color:
                            theme.textPrimary
                        }
                      ]}
                    >
                      Ödeme Yapılan Kart / Hesap
                    </Text>

                    <Text
                      style={[
                        styles.formSectionDescription,
                        {
                          color:
                            theme.textMuted
                        }
                      ]}
                    >
                      Aboneliğin tahsil edildiği yöntemi seçiniz.
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setShowPaymentMethodForm(
                        !showPaymentMethodForm
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.formSectionAction,
                        {
                          color:
                            theme.accent
                        }
                      ]}
                    >
                      {showPaymentMethodForm
                        ? 'Kapat'
                        : '+ Yöntem Ekle'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.removableOptionRow
                  }
                >
                  {safePaymentMethods.map(
                    paymentMethod => (
                      <View
                        key={
                          paymentMethod
                        }
                        style={
                          styles.removableOptionWrapper
                        }
                      >
                        <TouchableOpacity
                          style={[
                            styles.paymentMethodOption,
                            {
                              backgroundColor:
                                theme.inputBg,

                              borderColor:
                                theme.cardBorder
                            },

                            formPaymentMethod ===
                              paymentMethod &&
                              styles.paymentMethodOptionActive
                          ]}
                          onPress={() =>
                            setFormPaymentMethod(
                              paymentMethod
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.paymentMethodOptionText,
                              {
                                color:
                                  formPaymentMethod ===
                                  paymentMethod
                                    ? '#ffffff'
                                    : theme.textSecondary
                              }
                            ]}
                            numberOfLines={1}
                          >
                            {paymentMethod}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={
                            styles.removeOptionButton
                          }
                          onPress={() =>
                            removePaymentMethod(
                              paymentMethod
                            )
                          }
                        >
                          <Text
                            style={
                              styles.removeOptionText
                            }
                          >
                            ✕
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  )}
                </ScrollView>

                {showPaymentMethodForm && (
                  <View
                    style={[
                      styles.inlineForm,
                      {
                        backgroundColor:
                          theme.inputBg,

                        borderColor:
                          theme.cardBorder
                      }
                    ]}
                  >
                    <View
                      style={
                        styles.inlineInputRow
                      }
                    >
                      <TextInput
                        style={[
                          styles.textInput,
                          styles.flexInput,
                          {
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
                          styles.primaryButton,
                          styles.inlineAddButton
                        ]}
                        onPress={
                          addPaymentMethod
                        }
                      >
                        <Text
                          style={
                            styles.primaryButtonText
                          }
                        >
                          Ekle
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View
                style={
                  styles.formSection
                }
              >
                <Text
                  style={[
                    styles.formSectionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Kategori
                </Text>

                <View
                  style={
                    styles.wrappedOptionRow
                  }
                >
                  {Object.keys(
                    CATEGORY_COLORS
                  ).map(
                    category => (
                      <TouchableOpacity
                        key={
                          category
                        }
                        style={[
                          styles.categoryOption,
                          {
                            backgroundColor:
                              theme.inputBg,

                            borderColor:
                              theme.cardBorder
                          },

                          formCategory ===
                            category && {
                            backgroundColor:
                              CATEGORY_COLORS[
                                category
                              ],

                            borderColor:
                              CATEGORY_COLORS[
                                category
                              ]
                          }
                        ]}
                        onPress={() =>
                          setFormCategory(
                            category
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.categoryOptionText,
                            {
                              color:
                                formCategory ===
                                category
                                  ? '#ffffff'
                                  : theme.textSecondary
                            }
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              <View
                style={
                  styles.formSection
                }
              >
                <Text
                  style={[
                    styles.formSectionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Ödeme Tarihi
                </Text>

                <View
                  style={
                    styles.dateInputRow
                  }
                >
                             <View
                    style={
                      styles.dateInputField
                    }
                  >
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Gün
                    </Text>

                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          backgroundColor:
                            theme.inputBg,

                          color:
                            theme.textPrimary,

                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                      placeholder="1"
                      placeholderTextColor={
                        theme.textMuted
                      }
                      keyboardType="number-pad"
                      value={
                        formDay
                      }
                      onChangeText={
                        setFormDay
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.dateInputField
                    }
                  >
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Ay
                    </Text>

                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          backgroundColor:
                            theme.inputBg,

                          color:
                            theme.textPrimary,

                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                      placeholder="1"
                      placeholderTextColor={
                        theme.textMuted
                      }
                      keyboardType="number-pad"
                      value={
                        formMonth
                      }
                      onChangeText={
                        setFormMonth
                      }
                    />
                  </View>

                  <View
                    style={[
                      styles.dateInputField,
                      styles.dateInputYearField
                    ]}
                  >
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          color:
                            theme.textSecondary
                        }
                      ]}
                    >
                      Yıl
                    </Text>

                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          backgroundColor:
                            theme.inputBg,

                          color:
                            theme.textPrimary,

                          borderColor:
                            theme.cardBorder
                        }
                      ]}
                      placeholder="2026"
                      placeholderTextColor={
                        theme.textMuted
                      }
                      keyboardType="number-pad"
                      value={
                        formYear
                      }
                      onChangeText={
                        setFormYear
                      }
                    />
                  </View>
                </View>

                <Text
                  style={[
                    styles.helperText,
                    {
                      color:
                        theme.textMuted
                    }
                  ]}
                >
                  Aylık ödemelerde başlangıç ayı, yıllık ödemelerde tahsilat ayı olarak kullanılır.
                </Text>
              </View>

              <View
                style={
                  styles.formSection
                }
              >
                <Text
                  style={[
                    styles.formSectionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  Hatırlatıcı Kuralı
                </Text>

                <View
                  style={
                    styles.wrappedOptionRow
                  }
                >
                  {NOTIFICATION_OPTIONS.map(
                    option => (
                      <TouchableOpacity
                        key={
                          option.value
                        }
                        style={[
                          styles.compactOptionButton,
                          {
                            backgroundColor:
                              theme.inputBg,

                            borderColor:
                              theme.cardBorder
                          },

                          formNotificationDays ===
                            option.value &&
                            styles.compactOptionButtonActive
                        ]}
                        onPress={() =>
                          setFormNotificationDays(
                            option.value
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.compactOptionText,
                            {
                              color:
                                theme.textSecondary
                            },

                            formNotificationDays ===
                              option.value &&
                              styles.compactOptionTextActive
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              <View
                style={
                  styles.formSection
                }
              >
                <Text
                  style={[
                    styles.formSectionTitle,
                    {
                      color:
                        theme.textPrimary
                    }
                  ]}
                >
                  İptal / Yönetim Bağlantısı
                </Text>

                <TextInput
                  style={[
                    styles.textInput,
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
                  keyboardType="url"
                  autoCapitalize="none"
                  value={
                    formCancelUrl
                  }
                  onChangeText={
                    setFormCancelUrl
                  }
                />
              </View>
            </ScrollView>

            <View
              style={[
                styles.modalFooter,
                {
                  borderTopColor:
                    theme.cardBorder,

                  backgroundColor:
                    theme.cardBg
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  {
                    backgroundColor:
                      theme.inputBg,

                    borderColor:
                      theme.cardBorder
                  }
                ]}
                onPress={
                  closeSubscriptionForm
                }
              >
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    {
                      color:
                        theme.textSecondary
                    }
                  ]}
                >
                  İptal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.modalSaveButton
                }
                onPress={
                  handleSaveSubscription
                }
              >
                <Text
                  style={
                    styles.modalSaveButtonText
                  }
                >
                  Kaydet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={
          duplicateWarning.visible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDuplicateWarning({
            visible: false,
            name: ''
          })
        }
      >
        <View
          style={
            styles.warningOverlay
          }
        >
          <View
            style={[
              styles.warningCard,
              {
                backgroundColor:
                  theme.cardBg,

                borderColor:
                  theme.cardBorder
              }
            ]}
          >
            <View
              style={[
                styles.warningIconBox,
                {
                  backgroundColor:
                    theme.activeButtonSoft,

                  borderColor:
                    theme.activeButtonBorder
                }
              ]}
            >
              <Text
                style={
                  styles.warningIcon
                }
              >
                ⚠️
              </Text>
            </View>

            <Text
              style={[
                styles.warningTitle,
                {
                  color:
                    theme.textPrimary
                }
              ]}
            >
              Mükerrer Kayıt
            </Text>

            <Text
              style={[
                styles.warningMessage,
                {
                  color:
                    theme.textSecondary
                }
              ]}
            >
              “{duplicateWarning.name}”
              isimli abonelik zaten
              kayıtlı.
            </Text>

            <Text
              style={[
                styles.warningHint,
                {
                  color:
                    theme.textMuted
                }
              ]}
            >
              Mevcut kaydı düzenleyebilir
              veya farklı bir ad
              kullanabilirsiniz.
            </Text>

            <TouchableOpacity
              style={
                styles.warningButton
              }
              onPress={() =>
                setDuplicateWarning({
                  visible: false,
                  name: ''
                })
              }
            >
              <Text
                style={
                  styles.warningButtonText
                }
              >
                Tamam
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(
  theme,
  isMobile,
  fontScale
) {
  const font = value =>
    Math.round(
      value * fontScale
    );

  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100vh',
      minHeight: 0,
      overflow: 'hidden'
    },

    appWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
      minHeight: 0,
      overflow: 'hidden'
    },

    appWrapperDesktop: {
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      minHeight: 0,
      overflow: 'hidden'
    },
      emptyDescription: {
      fontSize: font(11),
      textAlign: 'center',
      marginTop: 5
    },

    subscriptionCard: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      flexDirection:
        isMobile
          ? 'column'
          : 'row',
      justifyContent:
        'space-between',
      alignItems:
        isMobile
          ? 'stretch'
          : 'center',
      gap: isMobile ? 10 : 12
    },

    subscriptionMain: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },

    serviceIcon: {
      width: 38,
      height: 38,
      flexShrink: 0,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },

    serviceIconText: {
      color: '#ffffff',
      fontSize: font(15),
      fontWeight: 'bold'
    },

    subscriptionInfo: {
      flex: 1,
      minWidth: 0
    },

    subscriptionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6
    },

    subscriptionName: {
      fontSize: font(13),
      fontWeight: 'bold'
    },

    informationTag: {
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 6,
      paddingVertical: 2
    },

    informationTagText: {
      fontSize: font(9),
      fontWeight: 'bold'
    },

    subscriptionSubtitle: {
      fontSize: font(11),
      marginTop: 3
    },

    subscriptionRight: {
      flexShrink: 0,
      alignItems:
        isMobile
          ? 'flex-start'
          : 'flex-end'
    },

    subscriptionPrice: {
      fontSize: font(13),
      fontWeight: 'bold'
    },

    convertedPrice: {
      fontSize: font(10),
      fontWeight: 'bold',
      marginTop: 2
    },

    subscriptionActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 6
    },

    smallActionButton: {
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 5
    },

    smallActionText: {
      fontSize: font(10),
      fontWeight: 'bold'
    },

    deleteButton: {
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },

    deleteButtonText: {
      fontSize: font(11)
    },

    calendarSection: {
      width: '100%',
      marginTop: 4
    },

    calendarNavigation: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14
    },

    calendarNavigationButton: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal:
        isMobile ? 8 : 12,
      paddingVertical: 8
    },

    calendarNavigationText: {
      fontSize:
        isMobile
          ? font(10)
          : font(12),
      fontWeight: 'bold'
    },

    calendarTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize:
        isMobile
          ? font(16)
          : font(19),
      fontWeight: 'bold'
    },

    yearButton: {
      borderWidth: 1,
      borderRadius: 17,
      paddingHorizontal: 15,
      paddingVertical: 7
    },

    yearButtonActive: {
      backgroundColor:
        theme.activeButton,
      borderColor:
        theme.activeButtonBorder
    },

    yearButtonText: {
      fontSize: font(11),
      fontWeight: '600'
    },

    yearButtonTextActive: {
      color: '#ffffff',
      fontWeight: 'bold'
    },

    calendarContainer: {
      width: '100%',
      marginTop: 14
    },

    calendarWeekHeader: {
      width: '100%',
      flexDirection: 'row',
      marginBottom: 7
    },

    calendarWeekDay: {
      width: '14.2857%',
      alignItems: 'center'
    },

    calendarWeekDayText: {
      fontSize: font(11),
      fontWeight: 'bold'
    },

    calendarGrid: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },

    calendarDay: {
      width: '14.2857%',
      height:
        isMobile ? 88 : 118,
      borderWidth: 1,
      borderRadius: 6,
      padding: 4,
      marginBottom: 4,
      overflow: 'hidden'
    },

    calendarDayEmpty: {
      opacity: 0,
      pointerEvents: 'none'
    },

    calendarDayActive: {
      borderWidth: 1.5
    },

    calendarDayNumber: {
      flexShrink: 0,
      fontSize: font(11),
      fontWeight: 'bold',
      marginBottom: 3
    },

    calendarDayScroll: {
      flex: 1,
      minHeight: 0
    },

    calendarDayScrollContent: {
      paddingBottom: 2
    },

    calendarSubscriptionBadge: {
      width: '100%',
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 3,
      marginTop: 2
    },

    calendarSubscriptionName: {
      color: '#ffffff',
      fontSize: font(8),
      fontWeight: 'bold'
    },

    calendarSubscriptionPrice: {
      color: '#ffffff',
      fontSize: font(7),
      marginTop: 1
    },

    analyticsSection: {
      width: '100%',
      marginTop: 2
    },

    pageTitle: {
      fontSize: font(21),
      fontWeight: 'bold'
    },

    pageDescription: {
      fontSize: font(12),
      marginTop: 4,
      marginBottom: 14
    },

    analyticsSummaryRow: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 14,
      marginBottom: 14
    },

    analyticsSummaryCard: {
      flexGrow: 1,
      flexBasis:
        isMobile
          ? '46%'
          : 150,
      minWidth:
        isMobile
          ? '46%'
          : 150,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12
    },

    analyticsSummaryLabel: {
      fontSize: font(10),
      fontWeight: '600'
    },

    analyticsSummaryValue: {
      fontSize: font(14),
      fontWeight: 'bold',
      marginTop: 4
    },

    panel: {
      width: '100%',
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      marginBottom: 14
    },

    panelTitle: {
      fontSize: font(14),
      fontWeight: 'bold'
    },

    panelDescription: {
      fontSize: font(10),
      marginTop: 4
    },

    renewalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      borderBottomWidth: 1
    },

    renewalDot: {
      width: 8,
      height: 8,
      flexShrink: 0,
      borderRadius: 4
    },

    renewalName: {
      flex: 1,
      minWidth: 0,
      fontSize: font(11),
      fontWeight: '600'
    },

    renewalDateText: {
      fontSize: font(10),
      fontWeight: 'bold'
    },

    renewalAmount: {
      fontSize: font(11),
      fontWeight: 'bold'
    },

    categoryLegend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 9,
      marginTop: 12,
      marginBottom: 12
    },

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },

    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4
    },

    legendText: {
      fontSize: font(9)
    },

    chartScrollContent: {
      minWidth: '100%'
    },

    chartArea: {
      minWidth:
        isMobile ? 620 : 820,
      height: 220,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-end',
      paddingVertical: 8
    },

    chartColumn: {
      width:
        isMobile ? 48 : 62,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },

    chartAmount: {
      fontSize: font(8),
      minHeight: 12,
      marginBottom: 4
    },

    chartTrack: {
      width:
        isMobile ? 24 : 32,
      height: 145,
      borderRadius: 7,
      borderWidth: 1,
      overflow: 'hidden',
      justifyContent: 'flex-end'
    },

    chartStack: {
      width: '100%',
      overflow: 'hidden',
      justifyContent: 'flex-end'
    },

    chartSegment: {
      width: '100%'
    },

    chartMonthLabel: {
      fontSize: font(10),
      fontWeight: 'bold',
      marginTop: 6
    },

    chartFooter: {
      borderTopWidth: 1,
      marginTop: 12,
      paddingTop: 10,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6
    },

    chartFooterLabel: {
      fontSize: font(12),
      fontWeight: 'bold'
    },

    chartFooterValue: {
      fontSize: font(17),
      fontWeight: 'bold'
    },

    distributionTitle: {
      fontSize: font(14),
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 9
    },

    noDataText: {
      fontSize: font(11),
      fontStyle: 'italic'
    },

    distributionCard: {
      width: '100%',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 6
    },

    distributionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 6
    },

    distributionNameGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7
    },

    distributionColorDot: {
      width: 9,
      height: 9,
      borderRadius: 5
    },

    distributionName: {
      fontSize: font(11),
      fontWeight: 'bold'
    },

    distributionAmount: {
      fontSize: font(11),
      fontWeight: 'bold'
    },

    progressTrack: {
      width: '100%',
      height: 6,
      borderRadius: 3,
      overflow: 'hidden'
    },

    progressFill: {
      height: '100%',
      borderRadius: 3
    },

    bottomNavigation: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 64,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopWidth: 1,
      zIndex: 999,
      elevation: 20
    },

    bottomNavigationItem: {
      alignItems: 'center'
    },

    bottomNavigationIcon: {
      fontSize: font(17)
    },

    bottomNavigationText: {
      fontSize: font(9),
      fontWeight: 'bold',
      marginTop: 2
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.58)',
      justifyContent: 'center',
      alignItems: 'center',
      padding:
        isMobile ? 8 : 18
    },

    appearanceModal: {
      width:
        isMobile
          ? '96%'
          : 760,
      maxHeight: '92%',
      minHeight: 0,
      borderWidth: 1,
      borderRadius: 18,
      padding: 20
    },

    subscriptionModal: {
      width:
        isMobile
          ? '98%'
          : '94%',
      maxWidth: 980,
      height:
        isMobile
          ? '96%'
          : '92%',
      maxHeight: 850,
      minHeight: 0,
      borderWidth: 1,
      borderRadius: 18,
      overflow: 'hidden'
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
      flexShrink: 0,
      paddingHorizontal:
        isMobile ? 15 : 22,
      paddingTop:
        isMobile ? 15 : 20,
      paddingBottom: 12
    },

    modalTitle: {
      fontSize:
        isMobile
          ? font(18)
          : font(21),
      fontWeight: 'bold'
    },

    modalSubtitle: {
      fontSize: font(10),
      marginTop: 3
    },

    modalCloseButton: {
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 9,
      borderWidth: 1,
      padding: 0,
      margin: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },

    modalCloseText: {
      width: 30,
      height: 30,
      fontSize: font(12),
      fontWeight: '700',
      lineHeight: 30,
      textAlign: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
      padding: 0,
      margin: 0
    },

    appearanceSectionTitle: {
      fontSize: font(13),
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 9
    },

    appearanceOptionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },

    appearanceThemeOption: {
      width:
        isMobile
          ? '47%'
          : '31.5%',
      minWidth:
        isMobile
          ? 130
          : 150,
      borderWidth: 2,
      borderRadius: 12,
      padding: 9
    },

    appearanceOptionActive: {
      borderWidth: 2
    },

    themePreview: {
      height: 70,
      borderRadius: 7,
      overflow: 'hidden',
      flexDirection: 'row'
    },

    themePreviewSidebar: {
      width: '25%'
    },

    themePreviewContent: {
      flex: 1,
      padding: 5,
      gap: 5
    },

    themePreviewHeader: {
      height: 18,
      borderRadius: 3
    },

    themePreviewCard: {
      flex: 1,
      borderRadius: 4
    },

    appearanceOptionLabel: {
      fontSize: font(10),
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 7
    },

    fontScaleRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 18
    },

    fontScaleOption: {
      flexGrow: 1,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      alignItems: 'center'
    },

    fontScaleOptionActive: {
      backgroundColor:
        theme.activeButton,
      borderColor:
        theme.activeButtonBorder
    },

    fontScaleOptionText: {
      fontWeight: '600'
    },

    fontScaleOptionTextActive: {
      color: '#ffffff',
      fontWeight: 'bold'
    },

    subscriptionModalScroll: {
      flex: 1,
      minHeight: 0
    },

    subscriptionModalContent: {
      width: '100%',
      paddingHorizontal:
        isMobile ? 14 : 22,
      paddingBottom: 20
    },

    formSection: {
      width: '100%',
      marginBottom: 17
    },

    formSectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 10
    },

    formSectionTitle: {
      fontSize: font(12),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.35
    },

    formSectionDescription: {
      fontSize: font(9),
      marginTop: 3
    },

    formSectionAction: {
      fontSize: font(11),
      fontWeight: 'bold'
    },

    twoColumnRow: {
      width: '100%',
      flexDirection: 'row',
      gap: 12
    },

    singleColumnRow: {
      flexDirection: 'column',
      gap: 0
    },

    formColumn: {
      flex: 1,
      minWidth: 0
    },

    inputLabel: {
      fontSize: font(10),
      fontWeight: 'bold',
      marginBottom: 5
    },

    textInput: {
      width: '100%',
      minHeight: 40,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 9,
      fontSize: font(12),
      marginBottom: 10
    },

    removableOptionRow: {
      flexDirection: 'row',
      gap: 9,
      paddingTop: 3,
      paddingBottom: 5,
      paddingRight: 12
    },

    removableOptionWrapper: {
      position: 'relative',
      paddingTop: 2,
      paddingRight: 2
    },

    templateOption: {
      minWidth: 92,
      height: 38,
      borderRadius: 8,
      paddingLeft: 12,
      paddingRight: 32,
      justifyContent: 'center'
    },

    templateOptionText: {
      color: '#ffffff',
      fontSize: font(10),
      fontWeight: 'bold'
    },

    paymentMethodOption: {
      minWidth: 110,
      height: 38,
      borderRadius: 8,
      borderWidth: 1,
      paddingLeft: 12,
      paddingRight: 32,
      justifyContent: 'center'
    },

    paymentMethodOptionActive: {
      backgroundColor:
        theme.activeButton,
      borderColor:
        theme.activeButtonBorder
    },

    paymentMethodOptionText: {
      fontSize: font(10),
      fontWeight: 'bold'
    },

    removeOptionButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 18,
      height: 18,
      borderRadius: 5,
      backgroundColor:
        'rgba(15,23,42,0.82)',
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.24)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
      zIndex: 3
    },

    removeOptionText: {
      width: 16,
      height: 16,
      color: '#ffffff',
      fontSize: font(9),
      fontWeight: '700',
      lineHeight: 16,
      textAlign: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
      padding: 0,
      margin: 0
    },

    inlineForm: {
      width: '100%',
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginTop: 10
    },

    inlineInputRow: {
      flexDirection:
        isMobile
          ? 'column'
          : 'row',
      gap: 8,
      alignItems:
        isMobile
          ? 'stretch'
          : 'center'
    },

    flexInput: {
      flex: 1,
      marginBottom: 0
    },

    inlineAddButton: {
      paddingHorizontal: 18
    },

    inlineSaveButton: {
      marginTop: 12,
      alignSelf: 'stretch'
    },

    currencyOptionRow: {
      flexDirection: 'row',
      gap: 5,
      flex: 1
    },

    wrappedOptionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginTop: 4
    },

    compactOptionButton: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 11,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },

    flexOptionButton: {
      flex: 1
    },

    compactOptionButtonActive: {
      backgroundColor:
        theme.activeButton,
      borderColor:
        theme.activeButtonBorder
    },

    compactOptionText: {
      fontSize: font(10),
      fontWeight: '600'
    },

    compactOptionTextActive: {
      color: '#ffffff',
      fontWeight: 'bold'
    },
     periodOptionRow: {
      flexDirection: 'row',
      gap: 8
    },

    periodOption: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 9,
      alignItems: 'center'
    },

    periodOptionActive: {
      backgroundColor:
        theme.activeButton,
      borderColor:
        theme.activeButtonBorder
    },

    periodOptionText: {
      fontSize: font(11),
      fontWeight: '600'
    },

    periodOptionTextActive: {
      color: '#ffffff',
      fontWeight: 'bold'
    },

    categoryOption: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 11,
      paddingVertical: 8
    },

    categoryOptionText: {
      fontSize: font(10),
      fontWeight: 'bold'
    },

    dateInputRow: {
      width: '100%',
      flexDirection: 'row',
      gap: 9
    },

    dateInputField: {
      flex: 1,
      minWidth: 0
    },

    dateInputYearField: {
      flex: 1.25
    },

    helperText: {
      fontSize: font(9),
      marginTop: -4
    },

    modalFooter: {
      flexDirection: 'row',
      flexShrink: 0,
      gap: 10,
      borderTopWidth: 1,
      paddingHorizontal:
        isMobile ? 14 : 22,
      paddingVertical: 14
    },

    modalCancelButton: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center'
    },

    modalCancelButtonText: {
      fontSize: font(12),
      fontWeight: 'bold'
    },

    modalSaveButton: {
      flex: 2,
      backgroundColor:
        theme.activeButton,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center'
    },

    modalSaveButtonText: {
      color: '#ffffff',
      fontSize: font(12),
      fontWeight: 'bold'
    },

    warningOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(15,23,42,0.72)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },

    warningCard: {
      width: '100%',
      maxWidth: 420,
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 24,
      paddingVertical: 26,
      alignItems: 'center'
    },

    warningIconBox: {
      width: 58,
      height: 58,
      borderWidth: 1,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15
    },

    warningIcon: {
      fontSize: font(27)
    },

    warningTitle: {
      fontSize: font(19),
      fontWeight: 'bold',
      textAlign: 'center'
    },

    warningMessage: {
      fontSize: font(13),
      fontWeight: '600',
      lineHeight: font(20),
      textAlign: 'center',
      marginTop: 10
    },

    warningHint: {
      fontSize: font(11),
      lineHeight: font(17),
      textAlign: 'center',
      marginTop: 8
    },

    warningButton: {
      width: '100%',
      minHeight: 42,
      backgroundColor:
        theme.activeButton,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
    },

    warningButtonText: {
      color: '#ffffff',
      fontSize: font(12),
      fontWeight: 'bold'
    }
  });
}   

import type { Locale } from '@/types/brief';

type OptionMap = Record<string, { en: string; ar: string }>;

const map = (en: string[], ar: string[]): OptionMap => {
  const result: OptionMap = {};
  en.forEach((value, index) => {
    result[value] = { en: value, ar: ar[index] ?? value };
  });
  return result;
};

export const CATEGORY_OPTIONS = map(
  [
    'Corporate Website',
    'E-Commerce Platform',
    'Web Application',
    'SaaS Platform',
    'Portfolio Website',
    'Booking Platform',
    'Dashboard / Admin Panel',
    'Custom Software',
    'Website Redesign',
    'Other',
  ],
  [
    'موقع شركة',
    'منصة تجارة إلكترونية',
    'تطبيق ويب',
    'منصة SaaS',
    'موقع أعمال / معرض',
    'منصة حجوزات',
    'لوحة تحكم / إدارة',
    'برمجيات مخصصة',
    'إعادة تصميم موقع',
    'أخرى',
  ],
);

export const GOAL_OPTIONS = map(
  [
    'Generate leads',
    'Increase sales',
    'Build brand awareness',
    'Improve customer experience',
    'Automate business processes',
    'Launch a new product',
    'Improve existing platform',
    'Other',
  ],
  [
    'توليد عملاء محتملين',
    'زيادة المبيعات',
    'بناء الوعي بالعلامة التجارية',
    'تحسين تجربة العملاء',
    'أتمتة عمليات الأعمال',
    'إطلاق منتج جديد',
    'تطوير منصة قائمة',
    'أخرى',
  ],
);

export const FEATURE_OPTIONS = map(
  [
    'Authentication / Registration',
    'User Profiles',
    'Admin Dashboard',
    'CMS',
    'Product Management',
    'Payment Integration',
    'Booking System',
    'Search & Filtering',
    'Email Notifications',
    'WhatsApp Integration',
    'Analytics',
    'Multilingual Support',
    'Third-Party APIs',
    'Database Integration',
    'Other',
  ],
  [
    'تسجيل الدخول / إنشاء حساب',
    'ملفات المستخدمين',
    'لوحة تحكم للمشرف',
    'نظام إدارة المحتوى',
    'إدارة المنتجات',
    'ربط المدفوعات',
    'نظام الحجوزات',
    'البحث والتصفية',
    'إشعارات البريد الإلكتروني',
    'ربط واتساب',
    'التحليلات',
    'دعم تعدد اللغات',
    'واجهات برمجية خارجية',
    'ربط قواعد البيانات',
    'أخرى',
  ],
);

export const DESIGN_OPTIONS = map(
  [
    'Minimalist',
    'Luxury / Premium',
    'Corporate',
    'Modern',
    'Editorial',
    'Creative',
    'Futuristic',
    'Bold',
    'Elegant',
  ],
  [
    'بسيط',
    'فخم / راقٍ',
    'مؤسسي',
    'عصري',
    'تحريري',
    'إبداعي',
    'مستقبلي',
    'جسور',
    'أنيق',
  ],
);

export const BUDGET_OPTIONS = map(
  [
    'Under 3,000 SAR',
    '3,000–5,000 SAR',
    '5,000–10,000 SAR',
    '10,000–20,000 SAR',
    '20,000–50,000 SAR',
    '50,000+ SAR',
    "Let's discuss",
  ],
  [
    'أقل من 3,000 ريال',
    '3,000–5,000 ريال',
    '5,000–10,000 ريال',
    '10,000–20,000 ريال',
    '20,000–50,000 ريال',
    'أكثر من 50,000 ريال',
    'لنناقش الأمر',
  ],
);

export const CONTACT_OPTIONS = map(
  ['Email', 'WhatsApp', 'Phone'],
  ['البريد الإلكتروني', 'واتساب', 'الهاتف'],
);

export const YES_NO_UNSURE_OPTIONS = map(
  ['Yes', 'No', 'Not sure — advise me'],
  ['نعم', 'لا', 'لست متأكدًا — أرشدوني'],
);

export const BUSINESS_STAGE_OPTIONS = map(
  ['Existing business', 'Startup', 'Not sure — advise me'],
  ['شركة قائمة', 'شركة ناشئة', 'لست متأكدًا — أرشدوني'],
);

export const URGENCY_OPTIONS = map(
  ['Flexible', 'Normal', 'High', 'Urgent'],
  ['مرن', 'عادي', 'مرتفع', 'عاجل'],
);

export const FLEXIBILITY_OPTIONS = map(
  ['Fixed', 'Slightly flexible', 'Very flexible'],
  ['ثابت', 'مرن قليلًا', 'مرن جدًا'],
);

const REGISTRY: Record<string, OptionMap> = {
  category: CATEGORY_OPTIONS,
  goal: GOAL_OPTIONS,
  feature: FEATURE_OPTIONS,
  design: DESIGN_OPTIONS,
  budget: BUDGET_OPTIONS,
  contact: CONTACT_OPTIONS,
  ynu: YES_NO_UNSURE_OPTIONS,
  stage: BUSINESS_STAGE_OPTIONS,
  urgency: URGENCY_OPTIONS,
  flexibility: FLEXIBILITY_OPTIONS,
};

export function translateOption(group: string, value: string, locale: Locale): string {
  const entry = REGISTRY[group]?.[value];
  return entry ? entry[locale] : value;
}

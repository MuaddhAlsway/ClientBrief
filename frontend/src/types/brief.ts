export const PROJECT_CATEGORIES = [
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
] as const;

export const BUSINESS_GOALS = [
  'Generate leads',
  'Increase sales',
  'Build brand awareness',
  'Improve customer experience',
  'Automate business processes',
  'Launch a new product',
  'Improve existing platform',
  'Other',
] as const;

export const FEATURES = [
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
] as const;

export const DESIGN_DIRECTIONS = [
  'Minimalist',
  'Luxury / Premium',
  'Corporate',
  'Modern',
  'Editorial',
  'Creative',
  'Futuristic',
  'Bold',
  'Elegant',
] as const;

export const BUDGETS = [
  'Under 3,000 SAR',
  '3,000–5,000 SAR',
  '5,000–10,000 SAR',
  '10,000–20,000 SAR',
  '20,000–50,000 SAR',
  '50,000+ SAR',
  "Let's discuss",
] as const;

export const CONTACT_METHODS = ['Email', 'WhatsApp', 'Phone'] as const;
export const YES_NO_UNSURE = ['Yes', 'No', 'Not sure — advise me'] as const;
export const URGENCY_LEVELS = ['Flexible', 'Normal', 'High', 'Urgent'] as const;
export const TIMELINE_FLEXIBILITY = ['Fixed', 'Slightly flexible', 'Very flexible'] as const;
export const BUSINESS_STAGES = ['Existing business', 'Startup', 'Not sure — advise me'] as const;

export type Locale = 'en' | 'ar';

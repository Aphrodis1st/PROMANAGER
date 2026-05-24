import {
  Package,
  Building2,
  Pill,
  Users,
  HeartHandshake,
  Home,
} from 'lucide-react';

export const PAYMENT_CONTACT = {
  phone: import.meta.env.VITE_PAYMENT_PHONE || '+250 788 000 000',
  bankName: import.meta.env.VITE_PAYMENT_BANK_NAME || 'Bank of Kigali',
  bankAccount: import.meta.env.VITE_PAYMENT_BANK_ACCOUNT || '0000000000',
  accountName: import.meta.env.VITE_PAYMENT_ACCOUNT_NAME || 'ProManager Ltd',
};

export const SUBSCRIPTION_PRICING = {
  installation: '500k',
  monthly: '50k',
  yearly: '500k',
};

export const SERVICE_PRICING = {
  stock: {
    id: 'stock',
    title: 'Stock Management',
    tagline: 'Perfect for all business sectors.',
    icon: Package,
    purchasePrice: '8M',
    negotiable: false,
  },
  pharmacy: {
    id: 'pharmacy',
    title: 'Pharmacy Management',
    tagline: 'Perfect for all business sectors.',
    icon: Pill,
    purchasePrice: '11M',
    negotiable: false,
  },
  hospital: {
    id: 'hospital',
    title: 'Hospital Management',
    tagline: 'Perfect for all business sectors.',
    icon: Building2,
    purchasePrice: '13M',
    negotiable: false,
  },
  hr: {
    id: 'hr',
    title: 'HR Management',
    tagline: 'Perfect for all business sectors.',
    icon: Users,
    purchasePrice: '10M',
    negotiable: false,
  },
  property: {
    id: 'property',
    title: 'Property Management',
    tagline: 'Perfect for all business sectors.',
    icon: Home,
    purchasePrice: '10M',
    negotiable: false,
  },
  ngo: {
    id: 'ngo',
    title: 'NGO Management',
    tagline: 'Perfect for all business sectors.',
    icon: HeartHandshake,
    purchasePrice: null,
    negotiable: true,
  },
};

export function getServicePricing(serviceId) {
  return SERVICE_PRICING[serviceId] ?? null;
}

export function formatPriceLabel(amount) {
  if (!amount) return 'Negotiable';
  return `RWF ${amount}`;
}

import { Service } from '../types';

export const regularServices: Service[] = [
  {
    id: 'facial-basic',
    name: 'Basic Facial',
    price: 800,
    duration: 60,
    category: 'regular',
    description: 'Deep cleansing facial with moisturizing'
  },
  {
    id: 'facial-gold',
    name: 'Gold Facial',
    price: 1500,
    duration: 90,
    category: 'regular',
    description: 'Luxurious gold facial for radiant skin'
  },
  {
    id: 'facial-diamond',
    name: 'Diamond Facial',
    price: 2000,
    duration: 120,
    category: 'regular',
    description: 'Premium diamond facial with anti-aging benefits'
  },
  {
    id: 'haircut-styling',
    name: 'Hair Cut & Styling',
    price: 600,
    duration: 45,
    category: 'regular',
    description: 'Professional haircut with styling'
  },
  {
    id: 'hair-wash-blowdry',
    name: 'Hair Wash & Blow Dry',
    price: 400,
    duration: 30,
    category: 'regular',
    description: 'Hair wash with professional blow dry'
  },
  {
    id: 'manicure',
    name: 'Manicure',
    price: 500,
    duration: 45,
    category: 'regular',
    description: 'Complete nail care and polish'
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    price: 600,
    duration: 60,
    category: 'regular',
    description: 'Foot care with nail polish'
  },
  {
    id: 'eyebrow-threading',
    name: 'Eyebrow Threading',
    price: 150,
    duration: 15,
    category: 'regular',
    description: 'Precise eyebrow shaping'
  },
  {
    id: 'upper-lip-threading',
    name: 'Upper Lip Threading',
    price: 100,
    duration: 10,
    category: 'regular',
    description: 'Upper lip hair removal'
  },
  {
    id: 'full-face-threading',
    name: 'Full Face Threading',
    price: 400,
    duration: 30,
    category: 'regular',
    description: 'Complete facial hair removal'
  }
];

export const bridalServices: Service[] = [
  {
    id: 'bridal-makeup-basic',
    name: 'Basic Bridal Makeup',
    price: 8000,
    duration: 180,
    category: 'bridal',
    description: 'Complete bridal makeup with base, eyes, and lips'
  },
  {
    id: 'bridal-makeup-premium',
    name: 'Premium Bridal Makeup',
    price: 15000,
    duration: 240,
    category: 'bridal',
    description: 'High-end bridal makeup with premium products'
  },
  {
    id: 'bridal-makeup-luxury',
    name: 'Luxury Bridal Makeup',
    price: 25000,
    duration: 300,
    category: 'bridal',
    description: 'Luxury bridal makeup with international brands'
  },
  {
    id: 'bridal-hair-styling',
    name: 'Bridal Hair Styling',
    price: 5000,
    duration: 120,
    category: 'bridal',
    description: 'Elegant bridal hairstyling'
  },
  {
    id: 'bridal-saree-draping',
    name: 'Saree Draping',
    price: 2000,
    duration: 30,
    category: 'bridal',
    description: 'Professional saree draping'
  },
  {
    id: 'mehendi-basic',
    name: 'Basic Mehendi',
    price: 1500,
    duration: 120,
    category: 'bridal',
    description: 'Traditional henna designs'
  },
  {
    id: 'mehendi-bridal',
    name: 'Bridal Mehendi',
    price: 5000,
    duration: 300,
    category: 'bridal',
    description: 'Intricate bridal henna designs'
  },
  {
    id: 'pre-bridal-package',
    name: 'Pre-Bridal Package',
    price: 12000,
    duration: 480,
    category: 'bridal',
    description: 'Complete pre-bridal treatment package'
  }
];

export const allServices = [...regularServices, ...bridalServices];
import type { Product } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    barcode: '8901234567890',
    name: 'Organic Milk 1L',
    price: 4.99,
    category: 'Dairy',
    description: 'Fresh organic whole milk',
    stock: 50
  },
  {
    id: '2',
    barcode: '8901234567891',
    name: 'Whole Wheat Bread',
    price: 3.49,
    category: 'Bakery',
    description: 'Freshly baked whole wheat bread',
    stock: 30
  },
  {
    id: '3',
    barcode: '8901234567892',
    name: 'Free Range Eggs (12)',
    price: 5.99,
    category: 'Dairy',
    description: 'Large free-range eggs',
    stock: 40
  },
  {
    id: '4',
    barcode: '8901234567893',
    name: 'Bananas (1kg)',
    price: 2.99,
    category: 'Produce',
    description: 'Fresh ripe bananas',
    stock: 100
  },
  {
    id: '5',
    barcode: '8901234567894',
    name: 'Apples (1kg)',
    price: 3.99,
    category: 'Produce',
    description: 'Fresh red apples',
    stock: 80
  },
  {
    id: '6',
    barcode: '8901234567895',
    name: 'Chicken Breast (500g)',
    price: 8.99,
    category: 'Meat',
    description: 'Boneless chicken breast',
    stock: 25
  },
  {
    id: '7',
    barcode: '8901234567896',
    name: 'Pasta (500g)',
    price: 2.49,
    category: 'Pantry',
    description: 'Italian durum wheat pasta',
    stock: 60
  },
  {
    id: '8',
    barcode: '8901234567897',
    name: 'Olive Oil (500ml)',
    price: 6.99,
    category: 'Pantry',
    description: 'Extra virgin olive oil',
    stock: 35
  },
  {
    id: '9',
    barcode: '8901234567898',
    name: 'Orange Juice 1L',
    price: 4.49,
    category: 'Beverages',
    description: '100% pure orange juice',
    stock: 45
  },
  {
    id: '10',
    barcode: '8901234567899',
    name: 'Yogurt (500g)',
    price: 3.99,
    category: 'Dairy',
    description: 'Greek style yogurt',
    stock: 40
  },
  {
    id: '11',
    barcode: '8901234567900',
    name: 'Rice (1kg)',
    price: 4.99,
    category: 'Pantry',
    description: 'Long grain white rice',
    stock: 55
  },
  {
    id: '12',
    barcode: '8901234567901',
    name: 'Coffee (250g)',
    price: 7.99,
    category: 'Beverages',
    description: 'Ground arabica coffee',
    stock: 30
  },
  {
    id: '13',
    barcode: '8901234567902',
    name: 'Chocolate Bar',
    price: 2.99,
    category: 'Snacks',
    description: 'Dark chocolate 70% cocoa',
    stock: 70
  },
  {
    id: '14',
    barcode: '8901234567903',
    name: 'Potato Chips',
    price: 3.49,
    category: 'Snacks',
    description: 'Classic salted chips',
    stock: 50
  },
  {
    id: '15',
    barcode: '8901234567904',
    name: 'Toilet Paper (6 rolls)',
    price: 5.99,
    category: 'Household',
    description: 'Soft 2-ply toilet paper',
    stock: 40
  }
];

export const findProductByBarcode = (barcode: string): Product | undefined => {
  return sampleProducts.find(p => p.barcode === barcode);
};

export const findProductById = (id: string): Product | undefined => {
  return sampleProducts.find(p => p.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return sampleProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.barcode.includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
};

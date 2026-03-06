export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'digital';
}

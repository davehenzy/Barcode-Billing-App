import { useState, useCallback } from 'react';
import { Scan, Package, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ProductCatalog } from '@/components/ProductCatalog';
import { Cart } from '@/components/Cart';
import { Receipt } from '@/components/Receipt';
import { useCart } from '@/hooks/useCart';
import { findProductByBarcode } from '@/data/products';
import type { Product } from '@/types';

function App() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [receiptDate, setReceiptDate] = useState<Date>(new Date());

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount
  } = useCart();

  const handleScan = useCallback((barcode: string) => {
    const product = findProductByBarcode(barcode);
    if (product) {
      addToCart(product);
      toast.success(`Added ${product.name} to cart`, {
        description: `$${product.price.toFixed(2)} - ${product.category}`
      });
    } else {
      toast.error('Product not found', {
        description: `Barcode: ${barcode}`
      });
    }
  }, [addToCart]);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`, {
      description: `$${product.price.toFixed(2)}`
    });
  }, [addToCart]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setReceiptId(Math.random().toString(36).substr(2, 9).toUpperCase());
    setReceiptDate(new Date());
    setIsReceiptOpen(true);
  }, [cartItems]);

  const handleReceiptClose = useCallback(() => {
    setIsReceiptOpen(false);
  }, []);

  const handleReceiptPrint = useCallback(() => {
    toast.success('Receipt printed successfully');
    clearCart();
    setIsReceiptOpen(false);
  }, [clearCart]);

  const handleReset = useCallback(() => {
    if (cartItems.length > 0) {
      if (confirm('Are you sure you want to clear the cart?')) {
        clearCart();
        toast.info('Cart cleared');
      }
    }
  }, [cartItems, clearCart]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Billing App</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="hidden sm:flex"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={() => setIsScannerOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Product Catalog */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border h-full overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Products</h2>
                </div>
              </div>
              <ProductCatalog onAddToCart={handleAddToCart} />
            </div>
          </div>

          {/* Cart */}
          <div className="h-full">
            <div className="h-full">
              <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onCheckout={handleCheckout}
                subtotal={subtotal}
                tax={tax}
                total={total}
                itemCount={itemCount}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Scan Button */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <Button
          onClick={() => setIsScannerOpen(true)}
          size="lg"
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Scan className="w-6 h-6" />
        </Button>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onScan={handleScan}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* Receipt Modal */}
      {isReceiptOpen && (
        <Receipt
          items={cartItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          receiptId={receiptId}
          date={receiptDate}
          onClose={handleReceiptClose}
          onPrint={handleReceiptPrint}
        />
      )}
    </div>
  );
}

export default App;

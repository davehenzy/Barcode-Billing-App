import { useRef } from 'react';
import { Printer, X, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/types';

interface ReceiptProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onClose: () => void;
  onPrint: () => void;
  receiptId: string;
  date: Date;
}

export const Receipt = ({ 
  items, 
  subtotal, 
  tax, 
  total, 
  onClose, 
  onPrint,
  receiptId,
  date
}: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !receiptRef.current) return;

    const receiptContent = receiptRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt ${receiptId}</title>
          <style>
            @media print {
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px;
                margin: 0;
                padding: 20px;
              }
              .receipt { 
                max-width: 300px; 
                margin: 0 auto; 
              }
              .no-print { 
                display: none !important; 
              }
            }
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px;
              margin: 0;
              padding: 20px;
            }
            .receipt { 
              max-width: 300px; 
              margin: 0 auto; 
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .border-t { border-top: 1px dashed #000; }
            .pt-2 { padding-top: 8px; }
            .pb-2 { padding-bottom: 8px; }
            .mt-2 { margin-top: 8px; }
            .mb-2 { margin-bottom: 8px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .text-lg { font-size: 16px; }
            .text-xl { font-size: 20px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${receiptContent}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    onPrint();
  };

  const handleDownload = () => {
    const receiptText = `
SUPER STORE
123 Main Street
Phone: (555) 123-4567

RECEIPT #${receiptId}
Date: ${date.toLocaleString()}
--------------------------------
${items.map(item => `
${item.name}
${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).join('\n')}
--------------------------------
Subtotal: $${subtotal.toFixed(2)}
Tax (8%): $${tax.toFixed(2)}
--------------------------------
TOTAL: $${total.toFixed(2)}
--------------------------------

Thank you for shopping!
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Receipt Generated</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          {/* Receipt Preview */}
          <div 
            ref={receiptRef}
            className="bg-white p-6 font-mono text-sm border rounded-lg mb-4"
            style={{ fontFamily: '"Courier New", monospace' }}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">SUPER STORE</h3>
              <p className="text-xs">123 Main Street</p>
              <p className="text-xs">Phone: (555) 123-4567</p>
            </div>

            <div className="text-center mb-4">
              <p className="font-bold">RECEIPT #{receiptId}</p>
              <p className="text-xs">{date.toLocaleString()}</p>
            </div>

            <Separator className="my-2 border-dashed" />

            <div className="space-y-1 mb-4">
              {items.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between">
                    <span className="truncate flex-1">{item.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-2 border-dashed" />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2 border-dashed" />
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-2 border-dashed" />

            <div className="text-center mt-4">
              <p className="text-xs">Thank you for shopping!</p>
              <p className="text-xs text-gray-500">Please come again</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

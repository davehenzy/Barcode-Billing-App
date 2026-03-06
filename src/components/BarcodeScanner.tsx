import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Scan, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const BarcodeScanner = ({ onScan, onClose, isOpen }: BarcodeScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  const getCameras = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
      } else {
        setError('No cameras found');
      }
    } catch (err) {
      setError('Error accessing cameras: ' + (err as Error).message);
    }
  }, []);

  const startScanning = useCallback(async () => {
    if (!selectedCamera || !containerRef.current) return;

    try {
      scannerRef.current = new Html5Qrcode('scanner-container');
      
      await scannerRef.current.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.5
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // QR code scan error - ignore continuous errors
        }
      );
      
      setIsScanning(true);
      setError('');
    } catch (err) {
      setError('Error starting scanner: ' + (err as Error).message);
    }
  }, [selectedCamera, onScan]);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      getCameras();
    }
    return () => {
      stopScanning();
    };
  }, [isOpen, getCameras, stopScanning]);

  useEffect(() => {
    if (isOpen && selectedCamera && !isScanning) {
      startScanning();
    }
  }, [isOpen, selectedCamera, isScanning, startScanning]);

  const handleClose = async () => {
    await stopScanning();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-900 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Scan Barcode</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {cameras.length > 1 && (
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCamera}
                onChange={(e) => {
                  stopScanning();
                  setSelectedCamera(e.target.value);
                }}
                className="flex-1 p-2 border rounded-md text-sm"
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <div 
              id="scanner-container" 
              ref={containerRef}
              className="w-full h-64 bg-black rounded-lg overflow-hidden"
            />
            
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm">Starting camera...</p>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-blue-500/50 rounded-lg">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1" />
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm bg-black/50 inline-block px-3 py-1 rounded-full">
                    Position barcode within the frame
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>Scan a product barcode to add it to your cart</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

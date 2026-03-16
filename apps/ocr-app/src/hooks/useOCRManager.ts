import { useState, useCallback, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { OCRResult, OCRProgress } from '../types';

// 配置 pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/ocr-app/pdfjs/pdf.worker.min.js';

export const useOCRManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress>({ status: 'idle', progress: 0 });
  const [results, setResults] = useState<OCRResult[]>([]);
  const workerRef = useRef<Worker | null>(null);

  const initWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../services/OCRService.worker.ts', import.meta.url), {
        type: 'module'
      });
    }
    return workerRef.current;
  }, []);

  const processImage = useCallback((image: string | ArrayBuffer, lang?: string): Promise<OCRResult> => {
    return new Promise((resolve, reject) => {
      const worker = initWorker();
      const taskId = Math.random().toString(36).substring(7);

      const handleMessage = (e: MessageEvent) => {
        const { type, id, data, error } = e.data;
        if (id !== taskId) return;

        if (type === 'progress') {
          setProgress(data);
        } else if (type === 'success') {
          worker.removeEventListener('message', handleMessage);
          resolve(data);
        } else if (type === 'error') {
          worker.removeEventListener('message', handleMessage);
          reject(new Error(error));
        }
      };

      worker.addEventListener('message', handleMessage);
      worker.postMessage({ id: taskId, image, lang });
    });
  }, [initWorker]);

  const processPDF = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress({ status: 'loading pdf', progress: 0 });
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const newResults: OCRResult[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress({ status: `rendering page ${i}/${numPages}`, progress: i / numPages });
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 高清渲染
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) throw new Error('Canvas context not available');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        // 将 canvas 转换为 data URL
        const imageData = canvas.toDataURL('image/png');

        setProgress({ status: `recognizing page ${i}/${numPages}`, progress: 0 });
        const result = await processImage(imageData);
        newResults.push(result);
      }

      setResults(newResults);
      return newResults;
    } catch (error) {
      console.error('PDF processing failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress({ status: 'idle', progress: 1 });
    }
  }, [processImage]);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    isProcessing,
    progress,
    results,
    processImage,
    processPDF,
    terminateWorker
  };
};

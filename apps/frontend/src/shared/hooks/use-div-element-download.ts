import FileSaver from 'file-saver';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';

export const useDivElementDownload = ({ fileName }: { fileName?: string }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (_fileName = `${fileName ?? 'element'}.png`) => {
    if (!elementRef.current) return;
    setIsLoading(true);

    try {
      const canvas = await html2canvas(elementRef.current, {
        backgroundColor: '#ffffff',
        scale: 10,
      });

      canvas.toBlob(blob => {
        if (blob) {
          FileSaver.saveAs(blob, _fileName);
        }
        setIsLoading(false);
      }, 'image/png');
    } catch (error) {
      console.error('Ошибка при экспорте графика:', error);
      setIsLoading(false);
    }
  };

  return { elementRef: elementRef, handleDownload: handleDownload, isLoading };
};

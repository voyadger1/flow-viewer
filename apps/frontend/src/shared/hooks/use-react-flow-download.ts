import { toPng } from 'html-to-image';

export const useReactFlowDownload = () => {
  const handleDownload = async (fileName = 'flow.png') => {
    const container = document.querySelector('.react-flow__viewport');

    if (!(container instanceof HTMLElement)) {
      console.error('Viewport React Flow не найден');
      return;
    }

    try {
      const dataUrl = await toPng(container, {
        style: {
          transform: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
    }
  };

  return { handleDownload };
};

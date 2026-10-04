import { useEffect } from 'react';

export function useObserveHashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.substring(1);
    if (!id) return;

    const findElement = () => {
      let el = document.getElementById(id);

      if (!el) {
        const encodedId = encodeURIComponent(id);
        el = document.getElementById(encodedId);
      }

      return el;
    };

    const existingElement = findElement();
    if (existingElement) {
      existingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const observer = new MutationObserver(() => {
      const targetElement = findElement();
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);
}

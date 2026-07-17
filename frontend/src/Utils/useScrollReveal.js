import { useEffect, useRef, useCallback } from 'react';

export function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const observerRef = useRef(null);

  const setRef = useCallback((node) => {
    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('revealed');
          if (once) observer.unobserve(node);
        } else if (!once) {
          node.classList.remove('revealed');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    observerRef.current = observer;
  }, [threshold, rootMargin, once]);

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return setRef;
}

export function useStaggerReveal(options = {}) {
  return useScrollReveal(options);
}

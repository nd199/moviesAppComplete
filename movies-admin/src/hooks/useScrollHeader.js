import { useEffect, useState } from 'react';

const useScrollHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const target = e.target;
      if (target.scrollTop > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const scrollableElements = document.querySelectorAll('.table-scroll-container');
    scrollableElements.forEach(element => {
      element.addEventListener('scroll', handleScroll);
    });

    return () => {
      scrollableElements.forEach(element => {
        element.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  return scrolled;
};

export default useScrollHeader;

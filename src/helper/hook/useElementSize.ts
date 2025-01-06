import { useState, RefObject, useLayoutEffect } from 'react';

function useElementSize<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return size;
}

export default useElementSize;

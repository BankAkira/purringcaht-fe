import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../helper/scroll-to';

export default function ScrollTopPortal({ children }: PropsWithChildren) {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return children;
}

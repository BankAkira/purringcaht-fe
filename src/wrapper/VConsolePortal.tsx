import { PropsWithChildren } from 'react';
// import VConsole from 'vconsole';
import { useDeepEffect } from '../helper/hook/useDeepEffect';

export default function VConsolePortal({ children }: PropsWithChildren) {
  useDeepEffect(() => {
    if (import.meta.env.MODE !== 'production') {
      // new VConsole();
    }
  }, []);

  return children;
}

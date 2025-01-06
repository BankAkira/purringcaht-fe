import classNames from 'classnames';
import { PropsWithChildren } from 'react';

type Props = {
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
};

export default function TabWrapper({
  active,
  children,
  onClick,
  size = 'md',
}: PropsWithChildren<Props>) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'w-full flex cursor-pointer hover:bg-red-50 px-3 overflow-hidden items-center justify-between',
        {
          'bg-red-100': active,
          'py-2': size === 'sm',
          'py-2.5': size === 'md',
        }
      )}>
      {children}
    </div>
  );
}

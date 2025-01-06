import { IconType } from 'react-icons';
import './chat-tab-header.css';
import { FaPlus } from 'react-icons/fa6';

type ChatTabHeaderProps = {
  headerName: string;
  icon?: IconType;
  isBetween?: boolean;
  btnClass?: string;
  onClick?: () => void;
};

export default function ChatTabHeader({
  headerName = 'Group',
  icon = FaPlus,
  isBetween = false,
  btnClass,
  onClick,
}: ChatTabHeaderProps) {
  const IconComponent = icon; // Dynamically get the IconComponent

  if (!IconComponent) {
    throw new Error(`Unsupported icon: ${icon}`);
  }

  return (
    <div
      className={
        (isBetween ? 'justify-between' : '') +
        ' flex items-center  gap-3 w-full'
      }>
      <p className="text-gray-500 text-base">{headerName}</p>
      {/* gradiemt plus icon */}
      <svg width="0" height="0">
        <linearGradient id="red-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#FE7601" offset="0%" />
          <stop stopColor="#FD4077" offset="100%" />
        </linearGradient>
      </svg>
      <IconComponent
        style={{ fill: 'url(#red-gradient)' }}
        className={btnClass}
        size={'18'}
        onClick={onClick}
      />
    </div>
  );
}

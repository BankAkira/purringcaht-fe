// Icon.tsx
import React from 'react';
import './icon-button.css';
import { IconType } from 'react-icons';
import classNames from 'classnames';

interface IconProps {
  /**
   * รูปแบบ Icon
   */
  icon: IconType;
  /**
   * สีของ Icon
   */
  color?: string;
  /**
   * ขนาดของ Icon
   */
  width?: number;
  height?: number;
  /**
   * กด Icon แล้วจะทำอะไร
   */
  onClick?: () => void;
  /**
   * กด Icon อยู่หรือไม่
   */
  isActive?: boolean;
  className?: string;
}

const IconButton: React.FC<IconProps> = ({
  icon,
  color = '#6B7280',
  width = 24,
  height = 24,
  onClick,
  isActive = false,
  className,
}) => {
  const activeColor = '#ff4500'; // The color when the icon is active
  const inactiveColor = color; // Default color when the icon is not active
  const iconColor = isActive ? activeColor : inactiveColor;
  const iconClassName = `icon-button ${isActive ? 'active' : ''}`;

  const iconStyles = {
    fill: iconColor,
    width: width,
    height: height,
    padding: isActive ? '10px' : '0', // Add padding if the icon is active
    // Include the border and shadow only if the icon is active
    boxShadow: isActive ? '0 0 0 4px #ff4500' : 'none',
    borderRadius: isActive ? '50%' : '0',
    background: isActive ? '#ffe5d4' : 'transparent',
    // Add any additional style changes for the active state here
  };

  const IconComponent = icon; // Dynamically get the IconComponent

  if (!IconComponent) {
    throw new Error(`Unsupported icon: ${icon}`);
  }

  return (
    <IconComponent
      style={iconStyles}
      className={classNames(iconClassName, className)}
      onClick={onClick}
    />
  );
};

export default IconButton;

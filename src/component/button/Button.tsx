import './button.css';
import { ReactNode } from 'react';

interface ButtonProps {
  /**
   * The label text to be displayed on the button.
   */
  label: string | JSX.Element;
  /**
   * Optional click handler function for the button.
   */
  onClick?: () => void;
  /**
   * Optional additional CSS class name(s) for custom styling.
   */
  className?: string;
  /**
   * Specifies whether the button should be disabled or not.
   */
  disabled?: boolean;

  /**
   * Specifies the color theme of the button.
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'default';
  /**
   * Specifies the size of the button.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Specifies using a gradient of the color theme
   */
  enabledGradient?: boolean;
  borderGradient?: {
    fromColor: string;
    toColor: string;
    rounded?: string;
    height?: string;
    width?: string;
  };
  isOutline?: boolean;
  iconLeftSide?: ReactNode | string;
  iconRightSide?: ReactNode | string;
  type?: 'submit' | 'reset' | 'button';
}

/**
 * Primary UI component for user interaction
 */

export default function Button({
  label,
  onClick,
  className,
  disabled,
  borderGradient,
  variant = 'default',
  size = 'md',
  enabledGradient = false,
  isOutline = false,
  iconLeftSide = undefined,
  iconRightSide = undefined,
  type = 'button',
  ...props
}: ButtonProps) {
  const gradientElementStyle = {
    backgroundImage: `linear-gradient(135deg, ${borderGradient?.fromColor}, ${borderGradient?.toColor}`,
    borderRadius: `${borderGradient?.rounded}` || '',
    display: 'inline-block',
  };

  const gradientTextStyle = {
    background: `linear-gradient(135deg, ${borderGradient?.fromColor}, ${borderGradient?.toColor}`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const getGradientBackground = (
    variant: string,
    enabledGradient: boolean
  ): {
    bgGradientClass: string;
    themecolor: string;
  } => {
    let themecolor = '';
    let bgGradientClass = '';
    switch (variant) {
      case 'primary':
        themecolor = 'blue';
        break;
      case 'secondary':
        themecolor = 'gray';
        break;
      case 'success':
        themecolor = 'green';
        break;
      case 'danger':
        themecolor = 'red';
        break;
      case 'warning':
        themecolor = 'yellow';
        break;
      default:
        themecolor = 'transparent';
    }

    if (!enabledGradient && !isOutline)
      bgGradientClass = `bg-${themecolor}-500`;
    else
      bgGradientClass = `bg-gradient-to-t from-${themecolor}-400 to-${themecolor}-600`;

    return { bgGradientClass, themecolor };
  };

  return (
    // <Button
    //   color={`${getGradientBackground(variant, enabledGradient).themecolor}`}
    //   className={`btn btn-${variant} btn-${size} ${getGradientBackground(variant, enabledGradient).bgGradientClass} ${className ? className : ''}`}>
    //   {iconLeftSide}
    //   {label}
    //   {iconRightSide}
    // </Button>

    <>
      {borderGradient ? (
        <button
          className={`${disabled ? 'grayscale !cursor-not-allowed' : ''} transition-all`}
          onClick={() => onClick && onClick()}
          disabled={disabled}
          type={type}
          {...props}>
          <div style={gradientElementStyle} className="w-full h-full p-[1px]">
            <div
              className={`${className ? className : ''} w-full bg-white rounded-full flex items-center justify-center hover:opacity-90 transition`}
              style={{
                height: borderGradient.height || '40px',
                width: borderGradient.width || '',
              }}>
              <span style={{ color: borderGradient.fromColor }}>
                {iconLeftSide}
              </span>
              <span className={`'font-medium`} style={gradientTextStyle}>
                {label}
              </span>
              <span style={{ color: borderGradient.toColor }}>
                {iconRightSide}
              </span>
            </div>
          </div>
        </button>
      ) : (
        <button
          className={`btn btn-${variant} ${!isOutline ? getGradientBackground(variant, enabledGradient).bgGradientClass : 'btn-outline bg-transparent'} btn-${size} ${className ? className : ''} ${disabled ? 'grayscale !cursor-not-allowed' : ''}  hover:opacity-70 transition-all`}
          onClick={() => onClick && onClick()}
          disabled={disabled}
          type={type}
          {...props}>
          {iconLeftSide}
          <span
            className={`${isOutline ? 'text-transparent bg-clip-text ' + getGradientBackground(variant, enabledGradient).bgGradientClass : 'font-medium'}`}>
            {label}
          </span>
          {iconRightSide}
        </button>
      )}
    </>
  );
}

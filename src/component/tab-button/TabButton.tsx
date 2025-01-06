import './tabButton.css';
import { ReactNode } from 'react';

interface TabButtonProps {
  /**
   * เทสๆ
   */
  children?: ReactNode | string;
  /**
   * ระบุว่าแสดงแนวตั้งหรือแนวนอน
   */
  displayType?: 'horizontal' | 'vertical';
  /**
   * ระบุว่าแสดงแนวตั้งหรือแนวนอน
   */
  selected?: number;
}

function renderDynamicButtonGroup({
  children,
  displayType = 'vertical',
}: TabButtonProps) {
  if (displayType === 'vertical')
    return (
      <>
        {/* vertical */}
        <div>{children}</div>
      </>
    );
  else
    return (
      <>
        {/* horizontal */}
        <div className="flex flex-wrap gap-2">{children}</div>
      </>
    );
}

/**
 * Primary UI component for user interaction
 */

const ButtonGroup: React.FC<TabButtonProps> = ({
  children,
  displayType = 'vertical',
  // selected = 0,
}) => {
  return <>{renderDynamicButtonGroup({ children, displayType })}</>;
};

export default ButtonGroup;

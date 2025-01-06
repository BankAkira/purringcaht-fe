// Switch.tsx
import React, { useEffect, useState } from 'react';
import './switch.css';

interface SwitchProps {
  /**
   * Text label for the switch
   * | คำที่ต้องการใส่หลัง Switch
   */
  label?: string;
  description?: string;
  /**
   * Determines if the switch is disabled
   * | Switch นี้ Disable หรือไม่ (กดได้หรือไม่ได้)
   */
  isDisabled?: boolean;
  /**
   * Callback function that is called when the value changes
   * | Callback function ที่ส่งมา
   */
  onToggle?: (value: boolean) => void;
  /**
   * Initial state of the switch
   * | กำหนดค่า switch เริ่มต้นว่า True หรือ false
   */
  isActive?: boolean;
}

const SwitchButton: React.FC<SwitchProps> = ({
  label,
  description,
  isDisabled = false,
  onToggle,
  isActive = false,
}) => {
  const [active, setActive] = useState(isActive);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const handleToggle = () => {
    if (isDisabled) {
      return;
    }
    const newState = !active;
    setActive(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const switchClassName = `switch ${active ? 'active' : ''} ${isDisabled ? 'disabled' : ''} !items-start justify-start`;

  return (
    <label
      className={switchClassName}
      style={{ opacity: isDisabled ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={active}
        onChange={handleToggle}
        disabled={isDisabled}
        aria-label={label}
      />
      <span className="slider round"></span>
      <div className="flex flex-col">
        {label && <span className="label">{label}</span>}
        {description && (
          <span className="text-sm text-gray-500">{description}</span>
        )}
      </div>
    </label>
  );
};

export default SwitchButton;

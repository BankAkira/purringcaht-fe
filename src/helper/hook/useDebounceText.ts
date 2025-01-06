import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useDebounceText = (
  value: string,
  onDone?: Dispatch<SetStateAction<boolean>>
) => {
  const [debouncedValue, setDeValue] = useState(value);
  useEffect(() => {
    if (onDone) {
      onDone(false);
    }
    const timeout = setTimeout(() => {
      setDeValue(value);
    }, 600);
    return () => clearTimeout(timeout);
  }, [value]);
  return debouncedValue;
};

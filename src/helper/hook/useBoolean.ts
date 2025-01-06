import { useCallback, useState } from 'react';

type TrueFunction = () => void;
type FalseFunction = () => void;
type ToggleFunction = () => void;

export type UseBooleanReturnType = [
  boolean,
  TrueFunction,
  FalseFunction,
  ToggleFunction,
];

export default function useBoolean(
  defaultValue?: boolean
): [boolean, TrueFunction, FalseFunction, ToggleFunction] {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(x => !x), []);

  return [value, setTrue, setFalse, toggle];
}

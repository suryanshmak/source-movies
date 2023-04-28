import { useEffect, useState } from "react";

export function useDebounce<T>(initialValue: T, delay: number) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  let res: [T, T, React.Dispatch<React.SetStateAction<T>>] = [
    value,
    debouncedValue,
    setValue,
  ];
  return res;
}

import { useEffect, useState } from "react";

/**
 * Debounces a rapidly-changing value.
 * @param {*} value The value to debounce
 * @param {number} delay Delay in ms
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


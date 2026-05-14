import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value.
 *
 * @param {any} value - The value to be debounced.
 * @param {number} delay - The delay in milliseconds.
 * @returns {any} - The debounced value.
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

import { SetStateAction, useState } from "react";

const isNotFunction = <T>(arg: SetStateAction<T>): arg is T =>
  typeof arg !== "function";

export default <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log("error reading localstorage: ", error);
      return initialValue;
    }
  });

  const setValue = (value: SetStateAction<T>) => {
    if (isNotFunction(value)) {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      setStoredValue((prev) => {
        const nextValue = value(prev);
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        return nextValue;
      });
    }
  };

  return [storedValue, setValue] as const;
};

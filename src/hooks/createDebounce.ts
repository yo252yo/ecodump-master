const createDebounce = <T extends (...args: any[]) => void>(
  func: T,
  wait?: number
): [trigger: (...args: Parameters<T>) => void, clear: () => void] => {
  let timeoutId: number | undefined;
  const clear = () => clearTimeout(timeoutId);
  const trigger = (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clear();
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
  return [trigger, clear];
};

export default createDebounce;

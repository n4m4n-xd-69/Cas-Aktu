import { useSearchParams } from 'react-router';

export function useURLState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (searchParams.get(key) as T) || defaultValue;

  const setValue = (newValue: T) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, newValue);
    }
    setSearchParams(params, { replace: true });
  };

  return [value, setValue];
}

export function useURLArrayState(
  key: string,
  defaultValue: string[] = [],
): [string[], (value: string[]) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.getAll(key);
  const currentValue = value.length > 0 ? value : defaultValue;

  const setValue = (newValue: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    if (newValue.length > 0 && newValue !== defaultValue) {
      newValue.forEach((v) => params.append(key, v));
    }
    setSearchParams(params, { replace: true });
  };

  return [currentValue, setValue];
}

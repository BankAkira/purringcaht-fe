import { QueryParams } from '../type';

export const queryParamsToString = (params: QueryParams) => {
  if (!params) return '';

  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value], i) => {
      const symbol = i === 0 ? '?' : '&';
      return `${symbol}${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('');
};

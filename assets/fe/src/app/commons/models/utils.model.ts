export interface Pagination<T> {
  next: null | number;
  previous: null | number;
  count: number;
  results: T[];
  allCount: number;
}

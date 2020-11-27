export interface AsyncPage<T> {
  content: T[];
  totalElements: number;
  last: boolean;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: false;
  pageable: Pageable;
}

export interface Pageable {
  pageSize: number;
  pageNumber: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

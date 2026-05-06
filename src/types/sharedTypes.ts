/* eslint-disable @typescript-eslint/no-explicit-any */
export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export type PaginatedResponse<T> =
  | { data: T; meta: any; error: null }
  | { data: null; meta: null; error: string };

  export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage:number;
}
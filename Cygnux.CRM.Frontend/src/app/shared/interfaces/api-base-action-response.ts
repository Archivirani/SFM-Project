import { Observable } from 'rxjs';

export type ParamsType = {};

export interface IApiBaseActions {
  Get(url: string, params?: ParamsType): Observable<any>;

  GetAll(url: string, params?: ParamsType): Observable<any>;

  Post(url: string, data: any, params?: ParamsType): Observable<any>;

  Delete(url: string, data?: any, params?: ParamsType): Observable<any>;

  Put(url: string, data: any, params?: ParamsType): Observable<any>;
}

export interface IApiBaseResponse<T> {
  success: boolean;
  data: T;
  totalCount: number;
  error: ErrorResponse;
  errorMessage: string;
}

export interface ErrorResponse {
  errorCode: number;
  message: string;
  details: any;
}

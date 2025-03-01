import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../../environments/environment';
import { ResponseMessages } from '../constants/response-message';
import {
  IApiBaseActions,
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService implements IApiBaseActions {
  constructor(public httpClient: HttpClient) {}

  Get(url: string, params?: ParamsType, headers?: HttpHeaders) {
    return this.httpClient
      .get<IApiBaseResponse<any>>(environment.apiUrl + url, {
        headers: headers,
        params: this.createParams(params),
      })
      .pipe(tap((x) => this.HandleResponse(x)));
  }

  GetAll(url: string, params?: ParamsType, headers?: HttpHeaders) {
    return this.httpClient
      .get<IApiBaseResponse<any>>(environment.apiUrl + url, {
        headers: headers,
        params: this.createParams(params),
      })
      .pipe(tap((x) => this.HandleResponse(x)));
  }

  Post(url: string, data: any, params?: ParamsType, headers?: HttpHeaders) {
    return this.httpClient
      .post<IApiBaseResponse<any>>(environment.apiUrl + url, data, {
        headers: headers,
        params: this.createParams(params),
      })
      .pipe(tap((x) => this.HandleResponse(x)));
  }

  Delete(url: string, params?: ParamsType, headers?: HttpHeaders) {
    return this.httpClient
      .delete<IApiBaseResponse<any>>(environment.apiUrl + url, {
        headers: headers,
        params: this.createParams(params),
      })
      .pipe(tap((x) => this.HandleResponse(x)));
  }

  Put(url: string, data?: any, params?: ParamsType, headers?: HttpHeaders) {
    return this.httpClient
      .put<IApiBaseResponse<any>>(environment.apiUrl + url, data, {
        headers: headers,
        params: this.createParams(params),
      })
      .pipe(tap((x) => this.HandleResponse(x)));
  }

  Patch(url: string, data?: any, params?: ParamsType, headers?: HttpHeaders) {
    return this.httpClient
      .patch<IApiBaseResponse<any>>(environment.apiUrl + url, data, {
        headers: headers,
        params: this.createParams(params),
      })
      .pipe(tap((x) => this.HandleResponse(x)));
  }

  HandleResponse(response: any) {
    if (response.Status === 500) {
      alert(ResponseMessages.serverError);
    }
  }

  createParams(params?: any) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.append(key, value as string | number | boolean);
      });
    }
    return httpParams;
  }
}

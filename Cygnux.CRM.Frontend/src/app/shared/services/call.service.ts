import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import {
  AddCallRequest,
  CallDetailResponse,
  CallFilter,
  CallResponse,
} from '../models/call.model';
import { CommonResponse } from '../models/common.model';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getCallList(filters: any): Observable<IApiBaseResponse<CallResponse[]>> {
    return this.apiHandlerService.Get('call', filters);
  }

  exportCall(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get('call/export', filters);
  }
  getCallDetails(id: string,UserId:any): Observable<IApiBaseResponse<CallDetailResponse>> {
    return this.apiHandlerService.Get(`call/${id}?UserId=${UserId}`);
  }

  addCall(
    addCallRequest: AddCallRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('call', addCallRequest);
  }

  updateCall(
    id: string,
    addCallRequest: AddCallRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('call/' + id, addCallRequest);
  }
  importCall(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('call/import', formData);
  }

  deleteCall(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('call/' + id, null);
  }

  getCallfilters(): Observable<IApiBaseResponse<CallFilter[]>> {
    return this.apiHandlerService.Get('Call/GetTotalCall');
  }
}

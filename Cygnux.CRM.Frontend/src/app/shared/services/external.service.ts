import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { CustResponse } from '../models/customer.model';
import {
  DocketResponse,
  GeneralMasterResponse,
} from '../models/external.model';
import { CityResponse } from '../models/lead.model';
import { LocationResponse, UserResponse } from '../models/meeting.model';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getGeneralMaster( searchText: string | null, codeType: string): Observable<IApiBaseResponse<GeneralMasterResponse[]>> {
    return this.apiHandlerService.Get(`external/${codeType}?searchText=${searchText}`);
  }
  getUserMaster(): Observable<IApiBaseResponse<UserResponse[]>> {
    return this.apiHandlerService.Get(`external/user`);
  }

  getLocationMaster(): Observable<IApiBaseResponse<LocationResponse[]>> {
    return this.apiHandlerService.Get(`external/location`);
  }

  getCities(): Observable<IApiBaseResponse<CityResponse[]>> {
    return this.apiHandlerService.Get(`external/city`);
  }
  getCustomers(): Observable<IApiBaseResponse<CustResponse[]>> {
    return this.apiHandlerService.Get(`external/customer`);
  }

  getDocketDetail(
    docketNo: string
  ): Observable<IApiBaseResponse<DocketResponse>> {
    return this.apiHandlerService.Get(`external/docket/${docketNo}`);
  }
}

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/common.model';
import {
  AddLeadRequest,
  LeadBySourceResponse,
  LeadByStatusResponse,
  LeadCategoryResponse,
  LeadDetailResponse,
  LeadResponse,
} from '../models/lead.model';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getLeadStatusData(filters:any):Observable<IApiBaseResponse<LeadByStatusResponse>>{
    return this.apiHandlerService.Get('Dashboard/LeadByStatus', filters);
  }

  getLeadSourceData(filters:any):Observable<IApiBaseResponse<LeadBySourceResponse>>{
    return this.apiHandlerService.Get('Dashboard/LeadBySource', filters);
  }

  getLeadCatagoryData(filters:any):Observable<IApiBaseResponse<LeadCategoryResponse[]>>{
    return this.apiHandlerService.Get('Dashboard/LeadByCategory', filters);
  }

  getLeadList(filters: any): Observable<IApiBaseResponse<LeadResponse[]>> {
    return this.apiHandlerService.Get('lead/leadlist', filters);
  }
  exportLead(startDate: any,endDate:any,userId:any,filters:any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get(`lead/export?startdate=${startDate}&enddate=${endDate}&UserId=${userId}`,filters);
  }

  exportLeadCategory(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get('lead/leadCategory', filters);
  }

  getLeadDetails(id: string,UserId:string): Observable<IApiBaseResponse<LeadDetailResponse>> {
    return this.apiHandlerService.Get(`lead/${id}?UserId=${UserId}`);
  }

  addLead(
    addLeadRequest: AddLeadRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lead', addLeadRequest);
  }

  // importLead(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
  //   return this.apiHandlerService.Post('lead/import', formData);
  // }

  updateLead(
    id: string,
    addLeadRequest: AddLeadRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lead/' + id, addLeadRequest);
  }

  deleteLead(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('lead/' + id, null);
  }

   downloadSampleLeadUpload(userId: string): Observable<Blob> {
    return this.apiHandlerService.DownloadFile(`Lead/DownloadSampleFileLead?userid=${userId}`);
  }

  importLead(userId:string,formData: any): Observable<IApiBaseResponse<any>> {
    return this.apiHandlerService.Post(`Lead/ImportExcelUploadLeads?userID=${userId}`, formData);
  }

}

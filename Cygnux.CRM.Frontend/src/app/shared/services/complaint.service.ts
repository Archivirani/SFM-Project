import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/common.model';
import {
  AddComplaintRequest,
  ComplaintDetailResponse,
  ComplaintGetUser,
  ComplaintResponse,
  DocDataDetail,
  EscalatedHistory,
  UpdateHistory,
} from '../models/complaint.model';
import { ApiHandlerService } from './api-handler.service';
import { GeneralMasterResponse } from '../models/external.model';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getComplaintList(
    filters: any
  ): Observable<IApiBaseResponse<ComplaintResponse[]>> {
    return this.apiHandlerService.Get('Complaint/GetList', filters);
  }

  getComplaintListexport(
    filters: any
  ): Observable<IApiBaseResponse<ComplaintResponse[]>> {
    return this.apiHandlerService.Get('Complaint/export', filters);
  }

  importComplaint(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('Complaint/ImportComplaints', formData);
  }

  getComplaintDetails( id: string,UserId:string): Observable<IApiBaseResponse<ComplaintDetailResponse>> {
    return this.apiHandlerService.Get(`complaint/GetDetail/${id}?UserId=${UserId}`);
  }

  addComplaint(
    addComplaintRequest: AddComplaintRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('Complaint/Add', addComplaintRequest);
  }

  
  AddEscTktComplaint(
    addComplaintRequest: AddComplaintRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('Complaint/AddEscTkt', addComplaintRequest);
  }

  closeTicket(
    addComplaintRequest: AddComplaintRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('Complaint/close', addComplaintRequest);
  }

  updateComplaint(
    id: string,
    addComplaintRequest: AddComplaintRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('complaint/Update/' + id, addComplaintRequest);
  }

  deleteComplaint(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('complaint/' + id, null);
  }

  getComplaintGetUser(userid: string): Observable<IApiBaseResponse<ComplaintGetUser>> {
    return this.apiHandlerService.Get(`Complaint/GetUser?userid=${userid}`);
  }

    getDocDataDetail(
      docketNo: string
    ): Observable<IApiBaseResponse<DocDataDetail>> {
      return this.apiHandlerService.Get(`Complaint/GetDocData?docNo=${docketNo}`);
    }

     getCompalintCounteData(filters:any):Observable<IApiBaseResponse<any>>{
        return this.apiHandlerService.Get('Complaint/GetCount', filters);
      }

      getTicketSourceData(filters:any):Observable<IApiBaseResponse<any>>{
        return this.apiHandlerService.Get('Dashboard/ComplaintBySource', filters);
      }

      getTicketDaywiseData(filters:any):Observable<IApiBaseResponse<any>>{
        return this.apiHandlerService.Get('Dashboard/ComplaintCountDayWise', filters);
      }

      getTicketStatusData(filters:any):Observable<IApiBaseResponse<any>>{
        return this.apiHandlerService.Get('Dashboard/ComplaintByStatus', filters);
      }

      getAssignTo():Observable<IApiBaseResponse<any>>{
        return this.apiHandlerService.Get('Complaint/AssignTo');
      }

      getupdateHistory(Id:string):Observable<IApiBaseResponse<UpdateHistory>>{
        return this.apiHandlerService.Get(`Complaint/UpdateHistory?Id=${Id}`);
      }

      getEscalatedHistory(Id:string):Observable<IApiBaseResponse<EscalatedHistory>>{
        return this.apiHandlerService.Get(`Complaint/EscalatedHistory?Id=${Id}`);
      }

      getTicketSubType( codeId: string ): Observable<IApiBaseResponse<GeneralMasterResponse[]>> {
          return this.apiHandlerService.Get(`external/CodeSubType?codeId=${codeId}`);
      }
}

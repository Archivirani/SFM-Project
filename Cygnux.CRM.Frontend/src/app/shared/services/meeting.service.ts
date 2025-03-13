import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/common.model';
import {
  AddMeetingCheckInRequest,
  AddMeetingRequest,
  MeetingCheckInRequest,
  MeetingCountDayWise,
  MeetingDetailResponse,
  MeetingMoMResponse,
  MeetingResponse,
} from '../models/meeting.model';
import { ApiHandlerService } from './api-handler.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  public meetingResponseSubject=new Subject<any>();
  public resetLocationSearch=new Subject<boolean>();

  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}
  
  getMeetingList(
    filters: any
  ): Observable<IApiBaseResponse<MeetingResponse[]>> {
    return this.apiHandlerService.Get('meeting', filters);
  }
  exportMeeting(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get('meeting/export', filters);
  }

  getMeetingDetails(id: string,UserId:string): Observable<IApiBaseResponse<MeetingDetailResponse>> {
    return this.apiHandlerService.Get(`meeting/${id}?UserId=${UserId}`);
  }

  addMeeting(
    addMeetingRequest: AddMeetingRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('meeting', addMeetingRequest);
  }

  addMeetingCheckInOut(
    addMeetingRequest: any
  ): Observable<IApiBaseResponse<any>> {
    return this.apiHandlerService.Post('Meeting/checkinout', addMeetingRequest);
  }

  updateMeeting(
    id: string,
    addMeetingRequest: AddMeetingRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('meeting/' + id, addMeetingRequest);
  }

  deleteMeeting(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('meeting/' + id, null);
  }

  getMeetingMomDetails(): Observable<IApiBaseResponse<MeetingMoMResponse[]>>{
    return this.apiHandlerService.Get('Meeting/momlist');
  }
  
  getMeetingStatusData(filters:any):Observable<IApiBaseResponse<any>>{
      return this.apiHandlerService.Get('Dashboard/MeetingByStatus', filters);
    }

  getMeetingCountDayWise(filters:any):Observable<IApiBaseResponse<MeetingCountDayWise[]>>{
    return this.apiHandlerService.Get('Dashboard/MeetingCountDayWise', filters);
  }
}

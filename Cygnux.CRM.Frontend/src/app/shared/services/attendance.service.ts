import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { AttendanceRequest, AttendanceResponse } from '../models/attendance.model';
import { Observable } from 'rxjs/internal/Observable';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) { }

  getAttendanceDetail(punchInDetail:any): Observable<IApiBaseResponse<AttendanceResponse>>{

    return this.apiHandlerService.Post('Attendance', punchInDetail);
  }

  getAttendanceCardDetail(filter:any): Observable<IApiBaseResponse<any>>{

    return this.apiHandlerService.Post('Attendance/GetAttendance', filter);
  }

  getAttendenceByUser(userId:string): Observable<IApiBaseResponse<any>>{

    return this.apiHandlerService.Get('Attendance/punchinout/'+userId);
  }
  
}

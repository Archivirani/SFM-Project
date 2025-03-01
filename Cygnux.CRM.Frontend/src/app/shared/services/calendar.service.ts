import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { ApiHandlerService } from './api-handler.service';
import { CalendarResponse } from '../models/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getCalendar(filters: any): Observable<IApiBaseResponse<CalendarResponse[]>> {
    return this.apiHandlerService.Get('calendar', filters);
  }
}

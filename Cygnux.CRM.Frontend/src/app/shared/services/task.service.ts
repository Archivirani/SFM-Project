import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/common.model';
import { AddTaskRequest, TaskResponse } from '../models/task.model';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}
  exportTask(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get('task/export', filters);
  }
  getTaskList(filters: any): Observable<IApiBaseResponse<TaskResponse[]>> {
    return this.apiHandlerService.Get('task', filters);
  }

  getTaskDetails(id: string,UserId:string): Observable<IApiBaseResponse<TaskResponse>> {
    return this.apiHandlerService.Get(`task/${id}?UserId=${UserId}`);
  }

  addTask(
    addTaskRequest: AddTaskRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('task', addTaskRequest);
  }

  updateTask(
    id: string,
    addTaskRequest: AddTaskRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('task/' + id, addTaskRequest);
  }

  deleteTask(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('task/' + id, null);
  }
}

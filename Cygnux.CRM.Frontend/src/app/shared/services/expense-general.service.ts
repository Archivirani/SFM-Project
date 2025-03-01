import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { filter, Observable } from 'rxjs';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { GeneralMaster, GeneralMasterResponse } from '../models/expenseGeneral.model';
import { CommonResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseGeneralService {

constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getGeneralMaster(searchText: string | null, codeType: string): Observable<IApiBaseResponse<GeneralMaster[]>> {
      return this.apiHandlerService.Get(`GeneralMaster?codeType=${codeType}&searchText=${searchText}`);
    }

getGeneralmasterList(filters:any): Observable<IApiBaseResponse<GeneralMasterResponse[]>> {
  return this.apiHandlerService.Get(`Expense/generalmaster/list`,filters);   
 }

 addGeneralMaster( generalmaster: GeneralMasterResponse): Observable<IApiBaseResponse<CommonResponse>> {
     return this.apiHandlerService.Post('Expense/generalmaster/add', generalmaster);
   }

   updateGeneralMaster( generalmaster: GeneralMasterResponse): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(`Expense/generalmaster/edit?id=${generalmaster.id}`, generalmaster);
  }
}
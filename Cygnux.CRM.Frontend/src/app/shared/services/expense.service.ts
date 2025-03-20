import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/common.model';
import {
  AddExpenseApprovalRequest,
  AddExpenseRequest,
  ApprovalRequest,
  ExpenseDetailResponse,
  ExpenseResponse,
} from '../models/expense.model';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getExpenseList(
    filters: any
  ): Observable<IApiBaseResponse<ExpenseResponse[]>> {
    return this.apiHandlerService.Get('expense', filters);
  }

  getExpenseApprovalList(
    filters: any
  ): Observable<IApiBaseResponse<ExpenseResponse[]>> {
    return this.apiHandlerService.Get('Expense/ApprovalList', filters);
  }
  
  exportExpense(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get(`expense/ExportExcel`,filters);
  }

  getExpenseDetails(id: any,userId:any): Observable<IApiBaseResponse<ExpenseDetailResponse>> {
    return this.apiHandlerService.Get(`expense/${id}?userId=${userId}`);
  }

  addExpense(
    addExpenseRequest: AddExpenseRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('expense', addExpenseRequest);
  }

  addExpenseApproval(
    addExpenseApprovalRequest: AddExpenseApprovalRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(
      'expense/approval',
      addExpenseApprovalRequest
    );
  }

  updateExpense(
    id: string,
    addExpenseRequest: AddExpenseRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('expense/' + id, addExpenseRequest);
  }

  exportexport(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get(`Expense/export`,filters);
  }

  deleteExpense(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('expense/' + id, null);
  }

  expenseApproval(approvalRequest: ApprovalRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('Expense/approval', approvalRequest);
  }
}

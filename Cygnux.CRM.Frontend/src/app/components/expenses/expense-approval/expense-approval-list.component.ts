import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import {
  ExpenseDetailResponse,
  ExpenseResponse,
} from '../../../shared/models/expense.model';
import { CommonService } from '../../../shared/services/common.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { ExportService } from '../../../shared/services/export.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@Component({
  selector: 'app-expense-approval',
  standalone: false,
  templateUrl: './expense-approval-list.component.html',
  styleUrls: ['./expense-approval-list.component.scss'],
})
export class ExpenseApprovalListComponent implements OnInit {
  public expenseId: string | null = null;
  public expenses: ExpenseResponse[] = [];
  public selectedExpense: ExpenseDetailResponse | null = null;
  public selectedCall: string | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object
   cardList:string = 'Expenses'
   
  @Output() edit = new EventEmitter<ExpenseResponse>();

  constructor(
    private expenseService: ExpenseService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    private confirmationService: ConfirmationService,
    public identifyService :IdentityService,
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.getExpenses();
  }

  async onStatusChange(expenseID: string, status: number) {
    let approvedstatus = status === 1 ? 'Approved' : 'Rejected';
    const confirmed = await this.confirmationService.confirm(
      'Are you sure you want to ' + approvedstatus + ' this expense?'
    );
    if (confirmed) {
      const data = {
        expenseId: expenseID,
        approvalStatus: status,
        status: approvedstatus,
      };
      this.addExpenseApproval(data);
    }
  }

  addExpenseApproval(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.expenseService.addExpenseApproval(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.getExpenses();
        } else {
          this.toasterService.error(response.error.message);
        }

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  getExpenses(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      userId:this.identifyService.getLoggedUserId()
    };
    this.expenseService.getExpenseApprovalList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.expenses = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  clearDate() {
    this.filters['ExpenseDate'] = '';
    this.getExpenses();
  } 
  clearmeetingDate(){
    this.filters['MeetingDate'] = '';
    this.getExpenses();
  }

  exportExpenses(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    const filters: any = {
      UserId:this.identifyService.getLoggedUserId(),
      export:false
    }
    this.expenseService.exportExpense(filters).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToExcel(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  exportCSVExpenses(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    const filters: any = {
      UserId:this.identifyService.getLoggedUserId(),
      export:false
    }
    this.expenseService.exportExpense(filters).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToCSV(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  onPageChange(page: number) {
    this.page = page;
    this.getExpenses(this.page);
  }
  getExpense(data: any) {
    this.commonService.updateLoader(true);
    const filter={
      id:data.expenseCode,
      userId:this.identifyService.getLoggedUserId(),
    }
    this.expenseService.getExpenseDetails(filter.id,filter.userId).subscribe({
      next: (response) => {
        if (response) {
          this.selectedExpense = response.data;
          this.selectedExpense.supportingDocument =
            environment.apiUrl.replace('/api/v1', '') +
            this.selectedExpense.supportingDocument.replace(/\\/g, '/');
          this.edit.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  viewModal(event: Event, expense: any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getExpense(expense)
    }
  }

  approveModal(event: Event, expense: any){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showApproveExpense');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getExpense(expense);
    }
  }

  closeEditModal() {
    const modalElement: any = document.getElementById('showApproveExpense');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getExpenses();
    }
  }
}

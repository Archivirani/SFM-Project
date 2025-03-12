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
import { IdentityService } from '../../../shared/services/identity.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@Component({
  selector: 'app-expense',
  standalone: false,
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
  public expense: string = '';
  public expenses: ExpenseResponse[] = [];
  public userType: string | null = null;
  public selectedExpense: ExpenseDetailResponse | null = null;
  public selectedCall: string | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object
  public cardList:string = 'Expenses'
  @Output() edit = new EventEmitter<ExpenseResponse>();

  constructor(
    private expenseService: ExpenseService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    public identifyService :IdentityService,
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.getExpenses();
    this.userType=localStorage.getItem('UserType')
  }

  getExpenses(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      UserID:this.identifyService.getLoggedUserId(),
      Page: page,
      PageSize: this.pageSize,
    };
    this.expenseService.getExpenseList(filters).subscribe({
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
    this.expenseService.exportExpense(this.filters).subscribe({
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
  deleteExpense(customerCode: string) {
    this.commonService.updateLoader(true);
    this.expenseService.deleteExpense(customerCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  openModal() {
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedExpense = null;
      this.expense = '';
      this.edit.emit();
      modal.show();
    }
  }
  getExpense(data: any) {
    this.commonService.updateLoader(true);
    const filter={
      id:data.meetingId,
      userId:this.identifyService.getLoggedUserId()
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

  clearDate() {
    this.filters['ExpenseDate'] = '';
    this.getExpenses();
  } 
  clearmeetingDate(){
    this.filters['ExpenseDate'] = '';
    this.getExpenses();
  }
  closeEditModal() {
    const modalElement: any = document.getElementById('showModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getExpenses();
    }
  }
  closeCallModal() {
    const modalElement: any = document.getElementById('exampleCallModalLong');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getExpenses();
    }
  }
  editModal(event: Event, expense: any,type:string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.expense = type;
      this.getExpense(expense);
    }
  }
  viewModal(event: Event, expenseId: any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getExpense(expenseId);
    }
  }
  callModal(event: Event, leadId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleCallModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedCall = leadId;
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getExpenses(this.page);
  }

  approveModal(event: Event, expense: any){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showApproveExpense');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedExpense=expense;
    }
  }
}

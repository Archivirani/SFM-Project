import { Component, EventEmitter, Output } from '@angular/core';
import { Modal } from 'bootstrap';
import { ExpenseGeneralService } from '../../../shared/services/expense-general.service';
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralMasterResponseList } from '../../../shared/models/expenseGeneral.model';
import { ExportService } from '../../../shared/services/export.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
@Component({
  selector: 'app-expense-general-master-list',
  standalone: false,
  templateUrl: './expense-general-master-list.component.html',
  styleUrl: './expense-general-master-list.component.scss'
})
export class ExpenseGeneralMasterListComponent {
  public expenseId: string = '';
  public expenses: GeneralMasterResponseList[] = [];
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object
  selectedExpense: GeneralMasterResponseList | null = null;
  cardList:string = 'Expenses General master'
  @Output() edit = new EventEmitter<any>();
  
  constructor(
    private expenseGeneralService:ExpenseGeneralService,
    public commonService:CommonService,
    public toasterService:ToastrService,
    private exportService: ExportService,
  ){defineElement(lottie.loadAnimation);}


  ngOnInit() {
    this.getExpensesGeneralMaster();
    this.getGeneralmasterList();
  }


  getGeneralmasterList(page: number = 1) {
    this.expenses = this.expenses.filter((item:any) => {
      return Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key]?.toLowerCase();
        const itemValue = item[key]?.toLowerCase();
        return !filterValue || itemValue?.includes(filterValue);
      });
    });
  }

  exportExpense(event: any) {
    event.preventDefault();
    const filters: any = {
      ...this.filters,
      export:true
    }
    this.commonService.updateLoader(true);
    this.expenseGeneralService.getGeneralmasterList(filters).subscribe({
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
  
  getExpensesGeneralMaster(page: number = 1){
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      export:false
    };
   this.expenseGeneralService.getGeneralmasterList(filters).subscribe({
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
   })
  }

  openModal(type:string) {
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedExpense = null;
      this.expenseId = type;
      modal.show();
    }
  }

  editModal(event: Event, generalList: any,type:string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedExpense = generalList;
      this.expenseId = type;
      modal.show();
    }
  }

  viewModal(event: Event, generalList: any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedExpense = generalList;
      modal.show();
      
    }
  }

  closeEditModal() {
    const modalElement: any = document.getElementById('showModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getExpensesGeneralMaster();
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.getExpensesGeneralMaster(this.page);
  }
}


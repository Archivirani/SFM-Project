import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  ComplaintDetailResponse,
  ComplaintResponse,
} from '../../../shared/models/complaint.model';
import { CommonService } from '../../../shared/services/common.service';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { ExportService } from '../../../shared/services/export.service';
import { ImportService } from '../../../shared/services/import.service';
import { finalize, take } from 'rxjs';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { IdentityService } from '../../../shared/services/identity.service';
@Component({
  selector: 'app-complaint',
  standalone: false,
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss'],
})
export class ComplaintListComponent implements OnInit {
[x: string]: any;
  public complaintId: string = '';
  public complaints: ComplaintResponse[] = [];
  public selectedComplaint: ComplaintDetailResponse | null = null;
  public complaintsBackup:ComplaintResponse[]=[];
  public selectedCall: string | null = null;
  public selectedComplaintId: string | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  selectedFilter:string=''
  private debounceTimer: any;
  filters: { [key: string]: string } = {
    compaintStatus: "" 
  };
  userType = localStorage.getItem('UserType')
  cardList:string = 'Complaints';
  @Output() edit = new EventEmitter<ComplaintResponse>();
  constructor(
    private complaintService: ComplaintService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    public importService:ImportService,
    public identifyService :IdentityService
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.getComplaints();
  }

  fetchComplaints(page: number = 1) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.getComplaints(page);
    }, 500);
}

private getComplaints(page: number = 1) {
  this.commonService.updateLoader(true);
  this.filters = Object.fromEntries(
    Object.entries(this.filters).filter(([key, value]) => value !== null)
  );
  const filters: any = {
    ...this.filters,
    Page: page,
    PageSize: this.pageSize,
    export: false,
    UserID:this.identifyService.getLoggedUserId()
  };
  this.complaintService.getComplaintList(filters).pipe(take(1), finalize(() => this.commonService.updateLoader(false))).subscribe({
    next: (response: any) => {
      if (response) {
        this.complaints = response.data;
        this.complaintsBackup = response.data;
        this.totalItems = response.totalCount;
      }
    },
    error: (error: any) => {
      this.toasterService.error(error?.message || 'Something went wrong.');
    },
  });
}

  exportComplaints(event: any) {
    event.preventDefault();
    const filters: any = {
      ...this.filters,
      export:true,
      UserID:this.identifyService.getLoggedUserId()
    }
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintListexport(filters).subscribe({
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

  exportCSVComplaints(event: any) {
    event.preventDefault();
    const filters: any = {
      ...this.filters,
      export:true,
      UserID:this.identifyService.getLoggedUserId()
    }
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintListexport(filters).subscribe({
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
  deleteComplaint(customerCode: string) {
    this.commonService.updateLoader(true);
    this.complaintService.deleteComplaint(customerCode).subscribe({
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

  openAddTicketModal(type:string,complaintID?:any){
    const modalElement = document.getElementById('showTicketModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.complaintId = type;
      this.selectedComplaint = null;
      this.edit.emit();
      modal.show();
      // this.selectedComplaint = complaintID
      if(type !== 'Add'){
        this.getComplaint(complaintID);
      }
    }
  }

  openModal() {
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.complaintId = '';
      this.selectedComplaint = null;
      this.edit.emit();
      modal.show();
    }
  }

  openChartModal() {
    this.commonService.userChart.next(true);
    const modalElement = document.getElementById('showChartModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  clearDate() {
    if(this.filters['compalaintDate']){
      this.filters['compalaintDate'] = '';
    }else{
      this.filters['resolutionDate'] = '';
    } 
    this.getComplaints();
  }

  getComplaint(id: string) {
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintDetails(id,this.identifyService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedComplaint = response.data;
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
  closeTicketModal() {
    const modalElement: any = document.getElementById('showTicketModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getComplaints();
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
      this.getComplaints();
    }
  }
  closeCallModal() {
    const modalElement: any = document.getElementById('exampleCallModalLong');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getComplaints();
    }
  }
  closeExpenseModal() {
    const modalElement: any = document.getElementById(
      'exampleExpenseModalLong'
    );
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getComplaints();
    }
  }
  editModal(event: Event, complaintId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.complaintId = 'update';
      this.getComplaint(complaintId);
    }
  }
  viewModal(event: Event, complaintId: string,items:any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getComplaint(complaintId);
      this.commonService.complaintViewModal.next(items)
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
  expenseModal(event: Event, complaintId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleExpenseModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedComplaintId = complaintId;
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getComplaints(this.page);
  }
}

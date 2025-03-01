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
  selectedFilter:string='All'
  filters: { [key: string]: string } = {}; // Dynamic filter object
  userType = localStorage.getItem('UserType')
  cardList:string = 'Complaints';
  @Output() edit = new EventEmitter<ComplaintResponse>();
  constructor(
    private complaintService: ComplaintService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
     public importService:ImportService
  ) {}

  ngOnInit(): void {
    this.getComplaints();
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedFilter === 'All') {
      this.complaints = this.complaintsBackup; // Assign all data to complaints
    } else {
      this.complaints = this.complaintsBackup.filter(
        complaint => complaint.compaintStatus === this.selectedFilter
      );
    }
  }

  getComplaints(page: number = 1) {
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
    this.complaintService.getComplaintList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.complaints = response.data;
          this.complaintsBackup = response.data;
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

  // getComplaints(page: number = 1) {
  //   this.commonService.updateLoader(true);

  //   this.filters = Object.fromEntries(
  //     Object.entries(this.filters).filter(([key, value]) => value !== null)
  //   );
  //   const filters: any = {
  //     ...this.filters,
  //     Page: page,
  //     PageSize: this.pageSize,
  //   };
  //   this.complaintService.getComplaintList(filters).subscribe({
  //     next: (response) => {
  //       if (response) {
  //         if(this.userRole=='Admin'){
  //          this.complaints=response.data.filter((complaint:any)=>complaint.country==='india' &&
  //                        (this.filters['AssignedTo']
  //                          ? complaint.assignedTo?.toLowerCase().includes(this.filters['AssignedTo'].toLowerCase())
  //                          : true) &&
  //                        (this.filters['RaisedBy']
  //                          ? complaint.raisedBy?.toLowerCase().includes(this.filters['RaisedBy'].toLowerCase())
  //                          : true)
  //                    );
  //         }else if(this.userRole==='manager'){
  //           this.complaints=response.data.filter((complaint:any)=>complaint.isLoggin===true &&
  //                        (this.filters['AssignedTo']
  //                          ? complaint.assignedTo?.toLowerCase().includes(this.filters['AssignedTo'].toLowerCase())
  //                          : true) &&
  //                        (this.filters['RaisedBy']
  //                          ? complaint.raisedBy?.toLowerCase().includes(this.filters['RaisedBy'].toLowerCase())
  //                          : true)
  //                    );
  //         }
  //         this.complaints = response.data;
  //         this.totalItems = response.totalCount;
  //       }
  //       this.commonService.updateLoader(false);
  //     },
  //     error: (response: any) => {
  //       this.toasterService.error(response);
  //       this.commonService.updateLoader(false);
  //     },
  //   });
  // }


  exportComplaints(event: any) {
    event.preventDefault();
    const filters: any = {
      ...this.filters,
      export:true
    }
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintList(filters).subscribe({
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
      export:true
    }
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintList(filters).subscribe({
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
    this.complaintService.getComplaintDetails(id).subscribe({
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
  viewModal(event: Event, complaintId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getComplaint(complaintId);
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

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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
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
  public complaintsBackup: ComplaintResponse[] = [];
  public selectedCall: string | null = null;
  public selectedComplaintId: string | null = null;
  public startDate:any;
  public endDate:any;
  selectedFile: File | null = null;
  dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  public isAddComplaint:boolean=false;
  public isComplaintdashboard:boolean=false;
  public loading:boolean=false;


  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  selectedFilter: string = ''
  private debounceTimer: any;
  filters: { [key: string]: string } = {
    compaintStatus: ""
  };
  userType = localStorage.getItem('UserType')
  cardList: string = 'Complaints';
  @Output() edit = new EventEmitter<ComplaintResponse>();
  constructor(
    private complaintService: ComplaintService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    public importService: ImportService,
    public identifyService: IdentityService
  ) { defineElement(lottie.loadAnimation); }

  ngOnInit(): void {
      this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    // this.getComplaints();
  }

  fetchComplaints(page: number = 1) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.getComplaints(page);
    }, 500);
  }

   getComplaints(event?: any,page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      export: false,
      UserID: this.identifyService.getLoggedUserId(),
      startDate: event?.[0] ? event[0].toLocaleDateString("en-GB") : this.dateRange?.[0]?.toLocaleDateString("en-GB") || null,
      endDate: event?.[1] ? event[1].toLocaleDateString("en-GB") : this.dateRange?.[1]?.toLocaleDateString("en-GB") || null
    };
    this.complaintService.getComplaintList(filters).pipe(take(1), finalize(() => this.commonService.updateLoader(false))).subscribe({
      next: (response: any) => {
        if (response) {
          this.complaints = response.data;
          this.complaintsBackup = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (error: any) => {
        this.toasterService.error(error?.message || 'Something went wrong.');
        this.commonService.updateLoader(false);
      },
    });
  }

  exportComplaints(event: any) {
    event.preventDefault();
      this.startDate=this.dateRange?.[0] ? this.dateRange[0].toLocaleDateString("en-GB") : '';
    this.endDate=this.dateRange?.[1]  ? this.dateRange[1].toLocaleDateString("en-GB") : ''

    this.commonService.updateLoader(true);
     const filters: any = {
      ...this.filters,
    };
    this.complaintService.getComplaintListexport(this.identifyService.getLoggedUserId(),this.startDate,this.endDate,filters).subscribe({
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
    this.startDate=this.dateRange?.[0] ? this.dateRange[0].toLocaleDateString("en-GB") : '';
    this.endDate=this.dateRange?.[1]  ? this.dateRange[1].toLocaleDateString("en-GB") : ''
    this.commonService.updateLoader(true);
      const filters: any = {
      ...this.filters,
    };
    this.complaintService.getComplaintListexport(this.identifyService.getLoggedUserId(),this.startDate,this.endDate,filters).subscribe({
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

  openAddTicketModal(type: string, complaintID?: any) {
    const modalElement = document.getElementById('showTicketModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.complaintId = type;
      this.selectedComplaint = null;
      this.edit.emit();
      modal.show();
      this.isAddComplaint=true
      // this.selectedComplaint = complaintID
      if (type !== 'Add') {
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
      this.isComplaintdashboard=true;
    }
  }

  clearDate() {
    if (this.filters['compalaintDate']) {
      this.filters['compalaintDate'] = '';
    } else if(this.filters['resolutionDate']) {
      this.filters['resolutionDate'] = '';
    }else if(this.filters['edd']){
      this.filters['edd'] = '';
    }else{
      this.filters['addDate'] = '';
    }
    this.getComplaints();
  }

  getComplaint(id: string) {
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintDetails(id, this.identifyService.getLoggedUserId()).subscribe({
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
  viewModal(event: Event, complaintId: string, items: any) {
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
    this.getComplaints(this.dateRange,this.page);
  }

  downloadSampleImport(event: any) {
    event.preventDefault();
    this.complaintService.downloadSampleComplaint(this.identifyService.getLoggedUserId()).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'ComplaintImport.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  triggerFileInput(event: Event, disappointed: void) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];


    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.ms-excel', // XLS
        'text/csv', // CSV
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12', // XLSB
        'application/vnd.ms-excel.sheet.macroEnabled.12', // XLSM
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template', // XLTX
        'application/vnd.ms-excel.template.macroEnabled.12', // XLTM
      ];
      if (validExcelTypes.includes(file.type)) {
        this.selectedFile = file;
        const formData = new FormData();
        formData.append('file', file);
        this.importComplaints(formData);
      } else {
        this.toasterService.error(
          'Please upload a valid excel file (XLSX, XLS, or CSV).'
        );
        this.selectedFile = null;
      }
      fileInput.value = '';
    }
  }
  importComplaints(dataToSubmit: any): void {
  this.commonService.updateLoader(true);

  this.complaintService.importComplaint(this.identifyService.getLoggedUserId(), dataToSubmit)
    .subscribe({
      next: (response) => {
        this.commonService.updateLoader(false);

        if (response.success) {
          const statusObj = response.data.find((item: any) => item.type === 'Status');
          const errorRecordObj = response.data.find((item: any) => item.type === 'ErrorRecords');

          // Show success message from statusObj
          if (statusObj?.data?.Message) {
            this.toasterService.success(statusObj.data.Message);
          }

          // If there are invalid records, download them
          if (errorRecordObj?.errorRecords?.length) {
            // this.toasterService.error(
            //   `Import completed with ${errorRecordObj.totalErrorCount} invalid record(s). Downloading error file...`
            // );

            this.downloadInvalidComplaintExcel(errorRecordObj.errorRecords);
          }

          this.getComplaints();
        } else {
          this.toasterService.error(response.error?.message || 'Import failed.');
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.message || 'An error occurred during import.');
        this.commonService.updateLoader(false);
      },
    });
}


 downloadInvalidComplaintExcel(invalidLeads: any[]): void {
  const cleanedData = invalidLeads.map(({ IsValid, ComStatus, ...rest }) => rest);
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedData);
  worksheet['!cols'] = Object.keys(cleanedData[0]).map(() => ({ wch: 20 }));
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Invalid Complaints': worksheet },
    SheetNames: ['Invalid Complaints'],
  };

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: false,
  });

  const blob: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  FileSaver.saveAs(blob, `Invalid_Complaints_${new Date().toISOString().slice(0, 10)}.xlsx`);
} 
}

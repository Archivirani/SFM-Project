import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import {
  LeadDetailResponse,
  LeadResponse,
} from '../../../shared/models/lead.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { LeadService } from '../../../shared/services/lead.service';
import { AddMeetingResponse } from '../../../shared/models/meeting.model';
import { ExportService } from '../../../shared/services/export.service';
import { environment } from '../../../../environments/environment';
import { ImportService } from '../../../shared/services/import.service';
import { Subscription } from 'rxjs';
import { IdentityService } from '../../../shared/services/identity.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { CustomerService } from '../../../shared/services/customer.service';

@Component({
  selector: 'app-lead',
  standalone: false,
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss'],
})
export class LeadListComponent implements OnDestroy {
  public leads: LeadResponse[] = [];
  selectedLead: LeadDetailResponse | null = null;
  leadId: string = '';
  selectedMeeting: AddMeetingResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  fileError: string | null = null; // For error handling
  filters: { [key: string]: string } = {}; // Dynamic filter object
  cardList: string = 'Leads';
  isReadonly = false;
  typeSubjectSubscription!: Subscription;
  selectedCustomerName: LeadDetailResponse | null = null;
  public endDate: any;
  public startDate: any;
  public selectedUser: any;
  dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  checkOutValue: string = '';
  selectedFile: File | null = null;
  public isaddLeadOpen:boolean=false;
  public isaddMeetingOpen:boolean=false;
  public isaddcallOpen:boolean=false;
  public isLeadDashboard:boolean=false;
  public loading: boolean = false;


  constructor(
    private leadService: LeadService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    public importService: ImportService,
    private identityService: IdentityService,
    public customerService: CustomerService
  ) {
    defineElement(lottie.loadAnimation);
       this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    if (this.typeSubjectSubscription) { this.typeSubjectSubscription.unsubscribe(); }
    this.typeSubjectSubscription = this.importService.typeSubject.subscribe((res) => {
      if (res) {
        this.getLeads(this.dateRange);
      }
    });
    this.customerService.getUsers();
  }

  timeoutRef: any;
  onStartTimeChange() {
    clearTimeout(this.timeoutRef); // 🔑 cancel previous timeout
    this.timeoutRef = setTimeout(() => {
      this.getLeads();
    }, 500);
  }

  getLeads(event?: any, page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      UserID: this.selectedUser?this.selectedUser:this.identityService.getLoggedUserId(),
      startDate: event?.[0] ? event[0].toLocaleDateString("en-GB") : this.dateRange?.[0]?.toLocaleDateString("en-GB") || null,
      endDate: event?.[1] ? event[1].toLocaleDateString("en-GB") : this.dateRange?.[1]?.toLocaleDateString("en-GB") || null
    };
    this.leadService.getLeadList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.leads = response.data;
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

  callModal(event: Event, leadData: any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalCall');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedCustomerName = leadData;
      modal.show();
      this.isaddcallOpen=true;
    }
  }

  closeCallModal() {
    const modalElement: any = document.getElementById('showModalCall');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    }
  }

  openChartModal() {
    const modalElement = document.getElementById('showChartModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.commonService.userChart.next(true)
      this.isLeadDashboard=true
    }
  }

  downloadSampleImport(event: any) {
    event.preventDefault();
    this.leadService.downloadSampleLeadUpload(this.identityService.getLoggedUserId()).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'LeadImport.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  exportLeads(event: any) {
    this.startDate = this.dateRange?.[0]?.toLocaleDateString("en-GB") || '';
     this.endDate = this.dateRange?.[1]?.toLocaleDateString("en-GB") || '';
    event.preventDefault();
    this.commonService.updateLoader(true);
     const filters: any = {
      ...this.filters,
    };
    this.leadService.exportLead(this.startDate, this.endDate,this.selectedUser?this.selectedUser:this.identityService.getLoggedUserId(),filters).subscribe({
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

  exportCSVLeads(event: any) {
    this.startDate = this.dateRange?.[0]?.toLocaleDateString("en-GB") || '';
     this.endDate = this.dateRange?.[1]?.toLocaleDateString("en-GB") || '';
    event.preventDefault();
    this.commonService.updateLoader(true);
     const filters: any = {
      ...this.filters,
    };
    this.leadService.exportLead(this.startDate, this.endDate, this.selectedUser?this.selectedUser:this.identityService.getLoggedUserId(),filters).subscribe({
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

  deleteLead(leadCode: string) {
    this.commonService.updateLoader(true);
    this.leadService.deleteLead(leadCode).subscribe({
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

  clearDate() {
    this.filters['LeadDate'] = '';
    this.getLeads();
  }

  openModal() {
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.leadId = '';
      this.selectedLead = null;
      modal.show();
      this.isaddLeadOpen=true
    }
  }
  getLead(leadCode: string) {
    this.commonService.updateLoader(true);
    this.leadService.getLeadDetails(leadCode, this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLead = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  editModal(event: Event, leadId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.leadId = leadId;
      this.isaddLeadOpen=true
      this.getLead(leadId);
    }
  }

  viewModal(event: Event, leadId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getLead(leadId);
    }
  }
  meetingModal(event: Event, lead: LeadResponse) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalMeeting');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedMeeting = {
        leadId: lead.leadId,
        customerName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email,
        address: lead.address,
        contactNo: lead.contactNo,
        leadDate: lead.leadDate
      };
      this.checkOutValue = '-';
      modal.show();
      this.isaddMeetingOpen=true
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
      this.getLeads(this.dateRange);
    }
  }
  closeMeetingModal() {
    const modalElement: any = document.getElementById('showModalMeeting');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getLeads();
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getLeads(this.dateRange, this.page);
  }

  // saveImportData(){
  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);
  //   this.leadService.importLead(this.identityService.getLoggedUserId(), formData).subscribe({
  //     next: (response) => {
  //       if (response && response.data) {
  //         this.validateData = response.data;
  //         const invalidData = this.validateData
  //           .filter(item => item.errorCode)
  //           .map(({ customer, ...rest }) => rest);

  //         // if (invalidData.length > 0) {
  //         //   this.docketService.importInvalidFile(invalidData, 'DocketUpload');
  //         // }
  //       }
  //     },
  //     error: (response: any) => {
  //       this.toasterService.error(response.error.Message);
  //     },
  //   });
  // }

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
        this.importLead(formData);
      } else {
        this.toasterService.error(
          'Please upload a valid excel file (XLSX, XLS, or CSV).'
        );
        this.selectedFile = null;
      }
      fileInput.value = '';
    }
  }
  importLead(dataToSubmit: any): void {
    this.commonService.updateLoader(true);

    this.leadService.importLead(this.identityService.getLoggedUserId(), dataToSubmit).subscribe({
      next: (response) => {
        this.commonService.updateLoader(false);

        if (response.success) {
          const invalidLeads = response.data.filter((lead: any) => lead.IsValid === false);

          if (invalidLeads.length > 0) {
            this.toasterService.error(`Import completed with ${invalidLeads.length} invalid record(s). Downloading error file...`);
            this.getLeads();
            this.downloadInvalidLeadsExcel(invalidLeads);
          } else {
            this.toasterService.success(response.data[0]?.Message || 'Lead(s) Created Successfully');
            this.getLeads();
          }
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
  downloadInvalidLeadsExcel(invalidLeads: any[]): void {
    const cleanedLeads = invalidLeads.map(({ IsValid, ...rest }) => rest);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedLeads, {
      skipHeader: false,
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Invalid Leads': worksheet },
      SheetNames: ['Invalid Leads'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(blob, `Invalid_Leads_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  triggerFileInput(event: Event, disappointed: void) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  ngOnDestroy(): void {
    if (this.typeSubjectSubscription) { this.typeSubjectSubscription.unsubscribe() }
  }
}

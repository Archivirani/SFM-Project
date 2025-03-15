import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import {
  LeadDetailResponse,
  LeadResponse,
} from '../../../shared/models/lead.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { LeadService } from '../../../shared/services/lead.service';
import { AddMeetingResponse} from '../../../shared/models/meeting.model';
import { ExportService } from '../../../shared/services/export.service';
import { environment } from '../../../../environments/environment';
import { ImportService } from '../../../shared/services/import.service';
import { Subscription } from 'rxjs';
import { IdentityService } from '../../../shared/services/identity.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
@Component({
  selector: 'app-lead',
  standalone: false,
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss'],
})
export class LeadListComponent implements OnDestroy{
  public leads: LeadResponse[] = [];
  selectedLead: LeadDetailResponse | null = null;
  leadId: string = '';
  selectedMeeting: AddMeetingResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  fileError: string | null = null; // For error handling
  filters: { [key: string]: string } = {}; // Dynamic filter object
  cardList:string = 'Leads';
  isReadonly = false;
  typeSubjectSubscription!: Subscription;
  selectedCustomerName: LeadDetailResponse | null = null;
  dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  checkOutValue:string='';

  constructor(
    private leadService: LeadService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    public importService:ImportService,
    private identityService:IdentityService
  ) {
    defineElement(lottie.loadAnimation);
    if(this.typeSubjectSubscription){this.typeSubjectSubscription.unsubscribe();}
    this.typeSubjectSubscription = this.importService.typeSubject.subscribe((res)=>{
      if(res){
        this.getLeads();
      }
    });
  }
  

  getLeads(event?:any,page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      UserID:this.identityService.getLoggedUserId(),
      startDate: event?.[0] ? event[0].toLocaleDateString("en-GB") : this.dateRange?.[0]?.toLocaleDateString("en-GB") || null,
      endDate: event?.[1]  ? event[1].toLocaleDateString("en-GB") : this.dateRange?.[1]?.toLocaleDateString("en-GB") || null
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

  callModal(event: Event, leadData:any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalCall');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedCustomerName = leadData;
      modal.show();
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
    }
  }

  downloadSampleImport(event: any) {
    event.preventDefault();
    let path =
      environment.apiUrl.replace('/api/v1', '') + 'Uploads/Lead_Import.xlsx';
    window.open(path, '_blank');
  }
  
  exportLeads(event: any) {
    const filters: any = {
      ...this.filters,
      UserID:this.identityService.getLoggedUserId(),
    };
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.leadService.exportLead(filters).subscribe({
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
    const filters: any = {
      ...this.filters,
      UserID:this.identityService.getLoggedUserId(),
    };
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.leadService.exportLead(this.filters).subscribe({
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
    }
  }
  getLead(leadCode: string) {
    this.commonService.updateLoader(true);
    this.leadService.getLeadDetails(leadCode,this.identityService.getLoggedUserId()).subscribe({
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
        leadDate:lead.leadDate
      };
      this.checkOutValue='-';
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
      this.getLeads();
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
    this.getLeads(this.dateRange,this.page);
  }
  ngOnDestroy(): void {
    if(this.typeSubjectSubscription){this.typeSubjectSubscription.unsubscribe()}
  }
}

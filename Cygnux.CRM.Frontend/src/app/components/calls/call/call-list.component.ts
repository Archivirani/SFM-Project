import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Modal } from 'bootstrap';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import {CallDetailResponse,CallResponse} from '../../../shared/models/call.model';
import { CallService } from '../../../shared/services/call.service';
import { CommonService } from '../../../shared/services/common.service';
import { ExportService } from '../../../shared/services/export.service';
import { ImportService } from '../../../shared/services/import.service';
import { GetFilter } from '../../../shared/models/customer.model';
import { Subscription } from 'rxjs';
import { IdentityService } from '../../../shared/services/identity.service';

@Component({
  selector: 'app-call',
  standalone: false,
  templateUrl: './call-list.component.html',
  styleUrls: ['./call-list.component.scss'],
})
export class CallListComponent implements OnInit {
  public calls: CallResponse[] = [];
  selectedCall: CallDetailResponse | null = null;
  callId: string | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object
  @Output() edit = new EventEmitter<CallResponse>();
  getfilter:GetFilter[]=[];
  typeSubjectSubscription:Subscription | null = null;;
  cardList: string = 'Call'
  constructor(
    private callService: CallService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    public exportService: ExportService,
    public importService: ImportService,
    private identityService:IdentityService
  ) {
    defineElement(lottie.loadAnimation);
    if(this.typeSubjectSubscription){this.typeSubjectSubscription.unsubscribe(); this.typeSubjectSubscription = null;}
    this.typeSubjectSubscription = this.importService.typeSubject.subscribe((res)=>{
      if(res){
        this.getCalls()
      }
    });
  }

  ngOnInit(): void {
    this.getCalls();
    this.getcallfilters();
  }
  getCalls(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const params: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      UserID:this.identityService.getLoggedUserId(),
    };
    this.callService.getCallList(params).subscribe({
      next: (response) => {
        if (response) {
          this.calls = response.data;
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
  exportCalls(event: any) {
    const filters: any = {
      ...this.filters,
      UserID:this.identityService.getLoggedUserId(),
    };
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.callService.exportCall(filters).subscribe({
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

  getcallfilters(){
     this.callService.getCallfilters().subscribe({
      next:(response) =>{
        this.getfilter = [
          { name: "Total Calls", count: response?.totalCount  ,color:'green' },
          { name: "Opportunity", count: response.data[2]?.totalCount || 0 ,color:'wheat' },
          { name: "Complaints", count: response.data[0]?.totalCount || 0 ,color:'pink' },
          { name: "Lead Creation", count: response.data[1]?.totalCount || 0 ,color:'lightgreen' },
        ];
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
     });
  }

  exportCSVCalls(event: any) {
    const filters: any = {
      ...this.filters,
      UserID:this.identityService.getLoggedUserId(),
    };
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.callService.exportCall(filters).subscribe({
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

  deleteCall(callCode: string) {
    this.commonService.updateLoader(true);
    this.callService.deleteCall(callCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        //this.closeDeleteModal();
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  getCall(callCode: string) {
    this.commonService.updateLoader(true);
    this.callService.getCallDetails(callCode,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedCall = response.data;
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

  closeEditModal() {
    const modalElement: any = document.getElementById('showModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getCalls();
    }
  }

  closeFilterModal(event: any) {
    event.preventDefault();
    const modalElement: any = document.getElementById('offcanvasExample');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.offcanvas-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getCalls();
    }
  }
  editModal(event: Event, callId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.callId = callId;
      this.getCall(callId);
    }
  }

  viewModal(event: Event, callId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCall(callId);
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getCalls(this.page);
  }
  openModal() {
    const modalElement: any = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement); // Using Bootstrap's JS modal method
      this.callId = '';
      this.selectedCall = null;
      this.edit.emit();
      modal.show();
    }
  }
  downloadSampleImport(event: any) {
    event.preventDefault();
    let path =
      environment.apiUrl.replace('/api/v1', '') + 'Uploads/Call_Import.xlsx';
    window.open(path, '_blank');
  }

  clearDate() {
    this.filters['CallDate'] = '';
    this.getCalls();
  }
  ngOnDestroy(): void {
    if(this.typeSubjectSubscription){this.typeSubjectSubscription.unsubscribe()}
  }
}

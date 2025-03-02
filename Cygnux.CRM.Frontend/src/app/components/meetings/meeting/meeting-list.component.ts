import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  MeetingDetailResponse,
  MeetingResponse,
} from '../../../shared/models/meeting.model';
import { CommonService } from '../../../shared/services/common.service';
import { ExportService } from '../../../shared/services/export.service';
import { MeetingService } from '../../../shared/services/meeting.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { IdentityService } from '../../../shared/services/identity.service';

@Component({
  selector: 'app-meeting',
  standalone: false,
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss'],
})
export class MeetingListComponent implements OnInit {
  public meetingId: string = '';
  public meetings: MeetingResponse[] = [];
  public exports: any;
  selectedMeeting: MeetingDetailResponse | null = null;
  checkOutValue:any;
  selectedCall: string | null = null;
  selectedMeetingId: string | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object

  @Output() edit = new EventEmitter<MeetingResponse>();

  constructor(
    private meetingService: MeetingService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    public exportService: ExportService,
    public confirmationService: ConfirmationService,
    public identityService:IdentityService
  ) {}

  ngOnInit(): void {
    this.getMeetings();
  }

  exportMeetings(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.meetingService.exportMeeting(this.filters).subscribe({
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

  onCheckIn(meeting: any, i: number): void {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "/"); // dd/mm/yyyy
    const formattedTime = today.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // HH:mm
    const formattedDateTime = `${formattedDate} ${formattedTime}`; // dd/mm/yyyy HH:mm
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          const data = {
            meetingId: meeting.meetingId,
            userID: this.identityService.getLoggedUserId(),
            isAttendee: true,
            date: formattedDate,
            checkIn: formattedDateTime,
            lat: userLat,  // User's current latitude
            lng: userLng,  // User's current longitude
          };
          
          this.meetingService.addMeetingCheckInOut(data).subscribe(
            (response) => {
              if(response.success === true){
                  meeting.isCheckIn = false;
                  this.toasterService.success(response.data.message);
                  this.getMeetings();
              }else{
                this.toasterService.error(response.error.message);
              }
            }
          );
        }
      );
    } else {
      this.toasterService.error("Geolocation is not supported by this browser.");
    }
  }
  
onCheckOut(meeting: any, i: number): void {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "/"); // dd/mm/yyyy
  const formattedTime = today.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // HH:mm
  const formattedDateTime = `${formattedDate} ${formattedTime}`; // dd/mm/yyyy HH:mm

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const data = {
          meetingId: meeting.meetingId,
          userID: this.identityService.getLoggedUserId(),
          isAttendee: false,
          date: formattedDate,
          checkOut: formattedDateTime,
          lat: userLat, // User's current latitude
          lng: userLng, // User's current longitude
        };
        this.meetingService.addMeetingCheckInOut(data).subscribe(
          (response) => {
            if(response.success === true){
              meeting.checkInDisabled = true;
              meeting.checkOutDisabled = true;
              this.toasterService.success("Meeting checkout successful");
              this.getMeetings();
          }else{
            this.toasterService.error(response.error.message);
          }
          });
      }
    );
  } else {
    this.toasterService.error("Geolocation is not supported by this browser.");
  }
}
  
  clearDate() {
    this.filters['MeetingDate'] = '';
    this.getMeetings();
  }
  

  exportCSVMeetings(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.meetingService.exportMeeting(this.filters).subscribe({
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
  preventClick(event: Event): void {
    event.preventDefault();
  }
  getMeetings(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      userid:this.identityService.getLoggedUserId(),
      Page: page,
      PageSize: this.pageSize,
    };
    this.meetingService.getMeetingList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.meetings = response.data;
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
  addMeetingCheckIn(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.meetingService.addMeetingCheckInOut(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
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
  deleteMeeting(customerCode: string) {
    this.commonService.updateLoader(true);
    this.meetingService.deleteMeeting(customerCode).subscribe({
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
      this.selectedMeeting = null;
      this.meetingId = '';
      this.checkOutValue='-';
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

  getMeeting(id: string,checkOut?:string) {
    this.commonService.updateLoader(true);
    this.meetingService.getMeetingDetails(id).subscribe({
      next: (response) => {
        if (response) {
          this.selectedMeeting = response.data;
          this.checkOutValue=checkOut;
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
      this.getMeetings();
    }
  }
  closeCallModal() {
    const modalElement: any = document.getElementById('showModalCall');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getMeetings();
    }
  }
  closeExpenseModal() {
    const modalElement: any = document.getElementById('showModalExpense');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getMeetings();
    }
  }
  editModal(event: Event, meetingId: string,checkOut:string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.meetingId = meetingId;
      this.getMeeting(meetingId,checkOut);
    }
  }
  viewModal(event: Event, meetingId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getMeeting(meetingId);
    }
  }
  async onCheckInChange(event: Event, meetingId: string, isCheckIn: boolean) {
    event.preventDefault(); // Prevent default anchor behavior
    const confirmed = await this.confirmationService.confirm(
      'Are you sure you want checkIn?'
    );
    if (confirmed) {
      this.addMeetingCheckIn({ meetingId: meetingId, isCheckedIn: !isCheckIn });
    }
  }
  callModal(event: Event, leadId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalCall');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedCall = leadId;
    }
  }
  expenseModal(event: Event, meetingId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalExpense');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedMeetingId = meetingId;
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getMeetings(this.page);
  }
}

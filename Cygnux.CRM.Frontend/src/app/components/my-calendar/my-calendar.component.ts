import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonService } from '../../shared/services/common.service';
import { CalendarService } from '../../shared/services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { MeetingService } from '../../shared/services/meeting.service';
import { CallService } from '../../shared/services/call.service';
import { MeetingResponse } from '../../shared/models/meeting.model';
import { CallResponse } from '../../shared/models/call.model';
import { IdentityService } from '../../shared/services/identity.service';

@Component({
  selector: 'app-my-calendar',
  styleUrls: ['./my-calendar.component.scss'],
  templateUrl: './my-calendar.component.html',
})
export class MyCalendarComponent implements OnInit {
  @Output() editMeeting = new EventEmitter<MeetingResponse>();
  @Output() editCall = new EventEmitter<CallResponse>();
  selectedMeeting: MeetingResponse | null = null;
  selectedCall: CallResponse | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth', // Month view
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay', // Views: Month, Week, Day
    },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    events: [
      { title: 'Event 1', date: '2024-11-20' },
      { title: 'Event 2', date: '2024-11-21' },
    ],
    selectable: true,
    editable: true,
    eventClick: this.handleEventClick.bind(this), // Event click handler
  };

  handleEventClick(info: any) {
    if(info.event.extendedProps.isAllDayEvent===true){
      this.toasterService.info('Meeting is booked for all day', '', {
        positionClass: 'toast-top-center'
      });
    }
    if (info.event.extendedProps.attendeeCode && info.event.extendedProps.isAllDayEvent===false) {
      this.editMeetingModal(info.event.extendedProps.attendeeCode);
    }
    if (info.event.extendedProps.callId) {
      this.editCallModal(info.event.extendedProps.callId);
    }
    //alert('Event: ' + info.event.extendedProps.meetingId);
  }
  constructor(
    private commonService: CommonService,
    private toasterService: ToastrService,
    private meetingService: MeetingService,
    private callService: CallService,
    private calendarService: CalendarService,
    private identityService:IdentityService
  ) {}

  ngOnInit() {
    this.getCalendar();
  }

  getCalendar() {
    this.commonService.updateLoader(true);
    const filter={
      userId:this.identityService.getLoggedUserId()
    }
    this.calendarService.getCalendar(filter).subscribe({
      next: (response) => {
        if (response) {
          this.calendarOptions.events = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  closeEditMeetingModal() {
    const modalElement: any = document.getElementById('showModalMeeting');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    }
  }
  editMeetingModal(meetingId: string) {
    const modalElement = document.getElementById('showModalMeeting');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getMeeting(meetingId);
    }
  }
  editCallModal(callId: string) {
    const modalElement = document.getElementById('showModalCall');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCall(callId);
    }
  }
  getCall(callCode: string) {
    this.commonService.updateLoader(true);
    this.callService.getCallDetails(callCode,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedCall = response.data;
          this.editCall.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getMeeting(id: string) {
    this.commonService.updateLoader(true);
    this.meetingService.getMeetingDetails(id,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedMeeting = response.data;
          this.editMeeting.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  closeEditCallModal() {
    const modalElement: any = document.getElementById('showModalCall');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    }
  }
  getEventColor(type: string): string {
    switch (type) {
      case 'work':
        return '#3498db'; // Blue
      case 'personal':
        return '#2ecc71'; // Green
      case 'urgent':
        return '#e74c3c'; // Red
      default:
        return '#95a5a6'; // Grey
    }
  }
}

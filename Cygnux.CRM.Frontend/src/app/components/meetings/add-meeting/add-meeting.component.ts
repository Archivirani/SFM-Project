import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import {
  EmailRegex,
  MobileRegex,
  todayDate,
} from '../../../shared/constants/common';
import { ToastrService } from 'ngx-toastr';
import {
  AddMeetingResponse,
  LocationResponse,
  MeetingMoMResponse,
  MeetingResponse,
  UserResponse,
} from '../../../shared/models/meeting.model';
import { MeetingService } from '../../../shared/services/meeting.service';
import { LeadCustomerResponse } from '../../../shared/models/customer.model';
import { LeadContactResponse } from '../../../shared/models/lead.model';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { ExternalService } from '../../../shared/services/external.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { CalendarService } from '../../../shared/services/calendar.service';
import { CalendarResponse } from '../../../shared/models/calendar.model';
import {Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-meeting',
  standalone: false,
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.scss'],
})
export class AddMeetingComponent implements OnInit, OnChanges,OnDestroy {
  public meetingForm!: FormGroup;
  public meetingId: string = '';
  public meetingTypes: GeneralMasterResponse[] = [];
  public users: UserResponse[] = [];
  public customers: LeadCustomerResponse[] = [];
  public leadContacts: LeadContactResponse[] = [];
  public locations: LocationResponse[] = [];
  public meetingMom:MeetingMoMResponse[]=[];
  public isChecked:boolean=false;
  meetingSubscription:Subscription
  calendarOptions:CalendarResponse[]=[];
  @Input() checkOutValue:any;
  @Input() meetingResponse: MeetingResponse | null = null;
  @Input() addmeetingResponse: AddMeetingResponse | null = null;
  @Input() addMeetingResponse: string | null = null;
  @Input() isMeetingList: string ='';
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  center: google.maps.LatLngLiteral = {
    lat: 28.5578178, // Replace with your latitude
    lng: 77.0627425, // Replace with your longitude
  };
  zoom = 12;


  constructor(
    private meetingService: MeetingService,
    private externalService: ExternalService,
    public customerService: CustomerService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private calendarService:CalendarService,
    public router: Router
  ) {
    this.meetingForm = new FormGroup({});
    this.meetingSubscription = this.meetingService.meetingResponseSubject.subscribe((res)=>{
      this.meetingForm.patchValue({customerName:res.customerName || res.companyName,customerCode:res.customerCode});
    })
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meetingResponse'] && this.meetingResponse) {
      if(this.meetingResponse.attendees){this.meetingResponse.attendeeIDs = this.meetingResponse?.attendees.split(',')}
      this.meetingResponse.meetingMOM=this.meetingResponse.meetingMOM ? this.meetingResponse.meetingMOM.toString().split(','):[];
      this.center.lat = this.meetingResponse.latitude;
      this.center.lng = this.meetingResponse.longitude;
      this.meetingId = this.meetingResponse.meetingId;
      this.meetingForm.patchValue(this.meetingResponse);
      // this.meetingForm.setValue({customerName:this.meetingResponse.customerName || this.meetingResponse.companyName,customerCode:this.meetingResponse.customerCode});
      // this.meetingForm.patchValue({
      //   leadId:this.meetingResponse.leadId
      // })
      
    } else {
      this.meetingForm.reset();
      this.meetingId = '';
    }

    if (changes['addmeetingResponse'] && this.addmeetingResponse) {
      this.meetingForm.patchValue(this.addmeetingResponse);
    }
    // if (changes['addMeetingResponse'] && this.addMeetingResponse) {
    //   this.customerService.customerDropdown(this.addMeetingResponse);
    //   this.meetingForm.patchValue({ leadId: this.addMeetingResponse });
    // }
  }

  ngOnInit(): void {
    this.buildForm();
    this.getCustomers();
    this.getLocations();
    this.getMeetingTypes();
    this.getUsers();
    this.getCalendar();
    this.getMeetingMom()
  }

  buildForm(): void {
    this.meetingForm = new FormGroup({
      leadId: new FormControl(''),
      customerCode:new FormControl(''),
      customerName:new FormControl(''),
      contactName: new FormControl(null),
      contactNo: new FormControl(null, [
        Validators.required,
        Validators.pattern(MobileRegex),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(EmailRegex),
      ]),
      meetingPurpose: new FormControl(null, [Validators.required]),
      meetingDate: new FormControl(todayDate, [Validators.required,this.futureDateValidator.bind(this)]),
      address: new FormControl(null),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      meetingTypeId: new FormControl(null, [Validators.required]),
      meetingLocation: new FormControl(null, [Validators.required]),
      isAllDayEvent: new FormControl(false),
      attendeeIDs: new FormControl([], [Validators.required]),
      meetingMOM: new FormControl([]),
      geoLocation: new FormControl(null),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      checkInDateTime:new FormControl(null),
      checkOutDateTime:new FormControl(null)
    },
  );
  this.meetingForm.setValidators(this.checkDuplicateMeetingTimes.bind(this));
  }

  getMeetingMom(){
    this.commonService.updateLoader(true);
    this.meetingService.getMeetingMomDetails().subscribe({
      next: (response) => {
        if (response) {
          this.meetingMom = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  onClose(){
    this.meetingForm.reset();
    this.buildForm();
  }
  checkDuplicateMeetingTimes(control?: AbstractControl): ValidationErrors | null {
    if((this.checkOutValue =='-' && !this.meetingId)|| (this.checkOutValue =='-' && this.meetingId) ){
    const meetingDate = this.meetingForm.get('meetingDate')?.value;
    const startTime = this.meetingForm.get('startTime')?.value;
    const endTime = this.meetingForm.get('endTime')?.value;
    const today = new Date();
    const dateParts = meetingDate?.split('/');
    const formattedDate = `${dateParts?.[2]}-${dateParts?.[1]}-${dateParts?.[0]}`;
    const startDateTime = new Date(`${formattedDate}T${startTime}`);
    const endDateTime = new Date(`${formattedDate}T${endTime}`);
    if(startDateTime <= today){
      return { startTimeAfterCurrentTime: true }; // Custom error key
    }else if(endDateTime <= startDateTime){
      return { timeRangeValidator: true }; // Custom error key
    }
    let conflictingMeetings: any[] = [];
    let time: any[] = [];
  
    const hasConflict = this.calendarOptions.filter((meeting: any) => {
      const meetingStart = new Date(meeting.start);
      const meetingEnd = new Date(meeting.end);
  
      const meetingStartDateOnly = new Date(Date.UTC(meetingStart.getUTCFullYear(), meetingStart.getUTCMonth(), meetingStart.getUTCDate())).toISOString().split('T')[0];  // 'YYYY-MM-DD'
      if (formattedDate === meetingStartDateOnly) {
        conflictingMeetings.push(meeting);
        const meetingStartTime = meetingStart.toTimeString().split(' ')[0].substring(0, 5);
        const meetingEndTime = meetingEnd.toTimeString().split(' ')[0].substring(0, 5);
        if (
          (startTime >= meetingStartTime && startTime < meetingEndTime) ||
          (endTime > meetingStartTime && endTime <= meetingEndTime) || 
          (startTime <= meetingStartTime && endTime >= meetingEndTime) 
        ) {
          time.push(meeting);
        }
      }
    });
  
    if (time.length > 0) {
      this.meetingForm.setErrors({ duplicateMeeting: true });
    } else {
      this.meetingForm.setErrors(null);
    }
  }
    return null;
  }
  
  onAllDayEventChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.isChecked=true;
      this.meetingForm.patchValue({
        startTime: '10:00',
        endTime: '18:00'
      });
    } else {
      this.isChecked=false;
      this.meetingForm.patchValue({
        startTime: '',
        endTime: ''
      });
    }
    this.checkDuplicateMeetingTimes();
  }

  getCalendar() {
    this.commonService.updateLoader(true);
    this.calendarService.getCalendar({}).subscribe({
      next: (response) => {
        if (response) {
          this.calendarOptions = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  futureDateValidator(control: AbstractControl) {
    if((this.checkOutValue =='-' && !this.meetingId)|| (this.checkOutValue =='-' && this.meetingId) ){
    const value: string | null = control.value;
    if (value) {
      const parts = value.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript (0 for January)
      const year = parseInt(parts[2], 10);

      const selectedDate = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return { notFutureDate: true };
      }
    }
  }
    return null;
  }

  formatDate(dateString: any): string {
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
      console.error('Invalid date string:', dateString);
      return ''; // Handle invalid date string
    }
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    if (!day || !month || !year) {
      console.error('Date format is incorrect:', dateString);
      return ''; // Handle incorrect date format
    }
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }


  onSubmitMeeting(form: FormGroup): void {
    // const leadId = this.customers.find((d)=>d.customerName === this.meetingForm.value.leadId)?.leadId
    if (form.valid) {
      const dataToSubmit = {
        ...form.value,
        attendeeIDs: form.value.attendeeIDs?.join(','),
        meetingMOM:form.value.meetingMOM?.join(','),
        meetingDate:this.formatDate(form.value.meetingDate),
        // leadId:leadId ?leadId :'',
        // isAllDayEvent:false
      };
      !this.meetingId
        ? this.addMeeting(dataToSubmit)
        : this.updateMeeting(dataToSubmit);
    }else{
      this.meetingForm.markAllAsTouched()
    }
  }

  addMeeting(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.meetingService.addMeeting(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.meetingForm.reset();
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

  updateMeeting(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.meetingService.updateMeeting(this.meetingId, dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit();
          this.toasterService.success(response.data.message);
          this.meetingForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.dataEmitter.emit();
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  onLocationSearch(mapResponse: any): void {
    this.meetingForm.patchValue({ latitude: mapResponse.lat });
    this.meetingForm.patchValue({ longitude: mapResponse.lng });
    this.meetingForm.patchValue({ geoLocation: mapResponse.address });
  }
  getMeetingTypes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'METNGTYPE').subscribe({
      next: (response) => {
        if (response) {
          this.meetingTypes = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getUsers() {
    this.commonService.updateLoader(true);
    this.externalService.getUserMaster().subscribe({
      next: (response) => {
        if (response) {
          this.users = response.data.map((user: any) => ({
            userId: user.userId,
            name: `${user.userId}: ${user.name}`,
          }));
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getCustomers() {
    this.commonService.updateLoader(true);
    this.customerService.getLeadCustomerList().subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  getLocations() {
    this.commonService.updateLoader(true);
    this.externalService.getLocationMaster().subscribe({
      next: (response) => {
        if (response) {
          this.locations = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  ngOnDestroy(): void {
    if(this.meetingSubscription){
      this.meetingSubscription.unsubscribe()
    }
  }
}

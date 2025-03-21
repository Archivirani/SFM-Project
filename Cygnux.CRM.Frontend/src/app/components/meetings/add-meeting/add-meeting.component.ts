import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
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
import { IdentityService } from '../../../shared/services/identity.service';
import { timeRangeValidator } from '../../../shared/validators/time-range.validatior';

@Component({
  selector: 'app-add-meeting',
  standalone: false,
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.scss'],
})
export class AddMeetingComponent implements OnInit, OnChanges,OnDestroy {
  public meetingForm!: FormGroup;
  public meetingId: string = '';
  public attendeeId :string ='';
  public meetingTypes: GeneralMasterResponse[] = [];
  public users: UserResponse[] = [];
  public customers: LeadCustomerResponse[] = [];
  public leadContacts: LeadContactResponse[] = [];
  public locations: LocationResponse[] = [];
  meetingRole:boolean = false;
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
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChild('suggestionsList', { static: false }) suggestionsList!: ElementRef;
  constructor(
    private meetingService: MeetingService,
    private externalService: ExternalService,
    public customerService: CustomerService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private calendarService:CalendarService,
    private identityService:IdentityService,
    public router: Router
  ) {
    this.meetingForm = new FormGroup({});
    this.meetingSubscription = this.meetingService.meetingResponseSubject.subscribe((res)=>{
      this.meetingForm.patchValue({customerName:res.customerName || res.companyName,customerCode:res.customerCode});
    })
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meetingResponse'] && this.meetingResponse) {
      if(this.meetingResponse.attendees){
        this.meetingResponse.attendeeIDs = this.meetingResponse?.attendees.split(',');
      }
      this.meetingResponse.meetingMOM=this.meetingResponse.meetingMOM ? this.meetingResponse.meetingMOM.toString().split(','):[];
      this.center.lat = this.meetingResponse.latitude;
      this.center.lng = this.meetingResponse.longitude;
      this.meetingId = this.meetingResponse.meetingId;
      this.attendeeId = this.meetingResponse.attendeeCode;
      this.meetingForm.patchValue(this.meetingResponse);
      this.meetingForm.patchValue({
        meetingTypeId:this.meetingResponse.meetingTypeId.toString()
      })
      this.meetingRole = this.meetingResponse.meetingRole === 'A' ? true:false;
      // this.checkOutValue = this.meetingResponse.checkOut;
    } else {
      this.meetingForm.reset();
      this.meetingId = '';
    }
    if (changes['addmeetingResponse'] && this.addmeetingResponse) {
      this.meetingForm.patchValue(this.addmeetingResponse);
    }
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
      meetingDate: new FormControl(null, [Validators.required]),
      address: new FormControl(null),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      meetingTypeId: new FormControl(null, [Validators.required]),
      meetingLocation: new FormControl(null, [Validators.required]),
      isAllDayEvent: new FormControl(false),
      attendeeIDs: new FormControl([]),
      meetingMOM: new FormControl([]),
      geoLocation: new FormControl(null),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      checkInDateTime:new FormControl(null),
      checkOutDateTime:new FormControl(null),
      remarks:new FormControl(null),
      CreateBy:new FormControl(this.identityService.getLoggedUserId()),
      ModifiedBy:new FormControl(null)
    },
    // { validators: timeRangeValidator  }
  );
  this.meetingForm.setValidators(this.checkDuplicateMeetingTimes.bind(this));
  }

  checkDuplicateMeetingTimes(_control?: AbstractControl): ValidationErrors | null {
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
    }
    return null;
  }

  isDateDisabled = (date: { year: number; month: number; day: number }): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    selectedDate.setHours(0, 0, 0, 0); 
    if (selectedDate < today) {
        return true; 
    }
    if (!this.addmeetingResponse?.leadDate) return false;
    const dateParts = this.addmeetingResponse.leadDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!dateParts) {
        return false; 
    }
    const [, day, month, year] = dateParts.map(Number);
    const leadDate = new Date(year, month - 1, day);
    leadDate.setHours(0, 0, 0, 0); 
    return selectedDate < leadDate;
};

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
  onClose() {
    this.meetingForm.reset();
    this.buildForm();
    this.meetingResponse = {
      geoLocation: '',
      latitude: null,
      longitude: null,
      customerCode: '', 
    };
    this.meetingService.resetLocationSearch.next(true);
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
  }

  getCalendar() {
    this.commonService.updateLoader(true);
    const filter={
      userId:this.identityService.getLoggedUserId()
    }
    this.calendarService.getCalendar(filter).subscribe({
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
    if(this.customerService.customersList){
      var customerCode = this.customerService.customersList.find((d)=>d.customerName === form.value.customerName)?.customerCode
    }
    if (form.valid) {
      const dataToSubmit = {
        ...form.value,
        attendeeIDs: form.value.attendeeIDs?.join(','),
        meetingMOM:form.value.meetingMOM?.join(','),
        meetingDate:this.formatDate(form.value.meetingDate),
        customerCode:form.value.customerCode ? form.value.customerCode : customerCode,
        // leadId:leadId ?leadId :'',
        // isAllDayEvent:false
        CreateBy:this.identityService.getLoggedUserId(),
        ModifiedBy:this.isMeetingList === 'Update' ? this.identityService.getLoggedUserId():''
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
    this.meetingService.updateMeeting(this.attendeeId, dataToSubmit).subscribe({
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
          // const data = response.data.filter((d)=>d.userId.toString() !== this.identityService.getLoggedUserId());
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

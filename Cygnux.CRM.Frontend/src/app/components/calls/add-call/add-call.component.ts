import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { todayDate } from '../../../shared/constants/common';
import { CallResponse } from '../../../shared/models/call.model';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { UserResponse } from '../../../shared/models/meeting.model';
import { CallService } from '../../../shared/services/call.service';
import { CommonService } from '../../../shared/services/common.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { ExternalService } from '../../../shared/services/external.service';
import { timeRangeValidator } from '../../../shared/validators/time-range.validatior';
import { IdentityService } from '../../../shared/services/identity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-call',
  standalone: false,
  templateUrl: './add-call.component.html',
  styleUrls: ['./add-call.component.scss'],
})
export class AddCallComponent implements OnInit, OnChanges {
  public callForm!: FormGroup;
  public callCategories: GeneralMasterResponse[] = [];
  public callStatuses: GeneralMasterResponse[] = [];
  public users: UserResponse[] = [];
  public callPurposes: GeneralMasterResponse[] = [];
  @Input() callResponse: CallResponse | null = null;
  @Input() isCallList: string | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor( private callService: CallService,private externalService: ExternalService, public customerService: CustomerService, public commonService: CommonService,public router: Router, private toasterService: ToastrService,
    public identifyService :IdentityService ) { this.callForm = new FormGroup({});}

  ngOnChanges(changes: SimpleChanges) {
    const callStatusId = this.callStatuses.find((d)=>d.codeId.toString() === '2')?.codeId
    if(callStatusId){
      this.callForm.patchValue({
        callStatusId:callStatusId
      });
    } 
    if (changes['callResponse'] && this.callResponse) {
      this.callForm.patchValue(this.callResponse);
      this.callForm.patchValue({companyName:this.callResponse.customerName || this.callResponse.companyName});
    } else {
      this.callForm.reset();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.getCallCategories();
    this.getCallPurposes();
    this.getCallStatuses();
    this.getUsers();
  }

  buildForm(): void {
    const callStatusId = this.callStatuses.find((d)=>d.codeId.toString() === '2')?.codeId
    this.callForm = new FormGroup({
      callPurpose: new FormControl(null, [Validators.required]),
      callDate: new FormControl(todayDate, [Validators.required,this.futureDateValidator.bind(this)]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      callCategoryId: new FormControl(null, [Validators.required]),
      callStatusId: new FormControl(callStatusId),
      customerCode: new FormControl(''),
      remarks: new FormControl(null, [Validators.required]),
      userid:new FormControl(''),
      leadId:new FormControl(''),
      companyName:new FormControl(''),
      callId:new FormControl('')
    },
  { validators: timeRangeValidator  });
  }

  onClose(){
    this.callForm.reset();
    this.buildForm();
    this.callForm.patchValue({companyName:this.callResponse?.customerName || this.callResponse?.companyName});
  }
  
  futureDateValidator(control: AbstractControl) {
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
      return null;
  }

  onSubmitCall(form: FormGroup): void {
    if(this.customerService.customersList){
      var customerCode = this.customerService.customersList.find((d)=>d.customerName === form.value.companyName)?.customerCode
    }
    if (form.valid) {
      let { companyName,callId, ...dataToSubmit } = form.value;
      dataToSubmit.userid = this.identifyService.getLoggedUserId();
      dataToSubmit.customerCode = dataToSubmit.customerCode ? dataToSubmit.customerCode : '';
      dataToSubmit.customerCode = dataToSubmit.customerCode ? dataToSubmit.customerCode : customerCode;
      this.isCallList === 'Add' ? this.addCall(dataToSubmit) : this.updateCall(dataToSubmit);
    }else{
      this.callForm.markAllAsTouched()
    }
  }
 
  addCall(form: any): void {
    this.commonService.updateLoader(true);
    this.callService.addCall(form).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.callForm.reset();
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

  updateCall(form: any): void {
    this.commonService.updateLoader(true);
    this.callService.updateCall(this.callForm.value.callId, form).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.callForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      }
    });
  }
  getCallCategories(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'CALLCAT')
      .subscribe({
        next: (response) => {
          if (response) {
            this.callCategories = response.data;
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }

  getCallStatuses(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'CALLSTATUS')
      .subscribe({
        next: (response) => {
          if (response) {
            this.callStatuses = response.data;
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }

  getCallPurposes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'CALLPUR')
      .subscribe({
        next: (response) => {
          if (response) {
            this.callPurposes = response.data;
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
          this.users = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
}

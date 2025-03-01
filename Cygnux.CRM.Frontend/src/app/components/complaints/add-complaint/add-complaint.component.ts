import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { todayDate } from '../../../shared/constants/common';
import { LeadCustomerResponse } from '../../../shared/models/customer.model';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { LeadContactResponse } from '../../../shared/models/lead.model';
import { ComplaintResponse } from '../../../shared/models/complaint.model';
import { LocationResponse, UserResponse} from '../../../shared/models/meeting.model';
import { CommonService } from '../../../shared/services/common.service';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { ExternalService } from '../../../shared/services/external.service';

@Component({
  selector: 'app-add-complaint',
  standalone: false,
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.scss'],
})
export class AddComplaintComponent implements OnInit, OnChanges {
  public complaintForm!: FormGroup;
  public complaintId: string = '';
  public complaintTypes: GeneralMasterResponse[] = [];
  public complaintSubTypes: GeneralMasterResponse[] = [];
  public priorities: GeneralMasterResponse[] = [];
  public customers: LeadCustomerResponse[] = [];
  public users: UserResponse[] = [];
  public leadContacts: LeadContactResponse[] = [];
  public locations: LocationResponse[] = [];
  docketNotFound = false; // Flag for user not found error
  @Input() complaintResponse: ComplaintResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private complaintService: ComplaintService,
    private externalService: ExternalService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private datePipe: DatePipe
  ) {this.complaintForm = new FormGroup({});}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['complaintResponse'] && this.complaintResponse) {
      if (!this.complaintResponse.resolutionDate) {
        this.complaintResponse.resolutionDate =
          this.datePipe.transform(todayDate, 'dd/MM/yyyy') || '';
      }
      this.complaintForm.patchValue(this.complaintResponse);
      this.complaintId = this.complaintResponse.complaintId;
    } else {
      this.complaintForm.reset();
      this.complaintId = '';
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.getLocations();
    this.getComplaintTypes();
    this.getComplaintSubTypes();
    this.getPriorities();
    this.getUsers();
    this.complaintForm.controls['docketNo'].valueChanges.subscribe((value) => {
      if(value){
        this.onDocketNoChange(value);
      }
    });
  }

  onDocketNoChange(docketNo:any) {
    this.commonService.updateLoader(true);
    this.externalService.getDocketDetail(docketNo).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.complaintForm.patchValue({
            origin: response.data.bookingBranch,
            destination: response.data.reassigN_DESTCD,
            billingPartyName: response.data.partyName,
            docketStatus: response.data.dktStatus,
          });
        } else {
          this.docketNotFound = true;
          this.complaintForm.patchValue({
            origin: '',
            destination: '',
            billingPartyName: '',
            docketStatus: '',
          });
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  buildForm(): void {
    this.complaintForm = new FormGroup({
      docketNo: new FormControl(null, [Validators.required]),
      billingPartyName: new FormControl(null, [Validators.required]),
      origin: new FormControl(null, [Validators.required]),
      destination: new FormControl(null, [Validators.required]),
      docketStatus: new FormControl(null, [Validators.required]),
      defaulterBranch: new FormControl(null, [Validators.required]),
      complaintDate: new FormControl(todayDate, [Validators.required]),
      resolutionDate: new FormControl(null),
      complaintType: new FormControl(null, [Validators.required]),
      complaintSubType: new FormControl(null, [Validators.required]),
      complaintPriorityId: new FormControl(null, [Validators.required]),
      complaintDescription: new FormControl(null, [Validators.required]),
      assignTo: new FormControl(null, [Validators.required]),
    });
  }

  onSubmitComplaint(form: FormGroup): void {
    if (form.valid) {
      !this.complaintId
        ? this.addComplaint(form.getRawValue())
        : this.updateComplaint(form.getRawValue());
    }
  }

  addComplaint(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.complaintService.addComplaint(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.complaintForm.reset();
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

  updateComplaint(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.complaintService
      .updateComplaint(this.complaintId, dataToSubmit)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.success(response.data.message);
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
  getComplaintTypes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'CMPLNTYPE').subscribe({
      next: (response) => {
        if (response) {
          this.complaintTypes = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getComplaintSubTypes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'CMPLNSBTYP').subscribe({
      next: (response) => {
        if (response) {
          this.complaintSubTypes = response.data;
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
  getPriorities(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'PRIORITY')
      .subscribe({
        next: (response) => {
          if (response) {
            this.priorities = response.data;
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
}

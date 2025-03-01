import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { todayDate } from '../../../shared/constants/common';
import { LeadCustomerResponse } from '../../../shared/models/customer.model';
import { ExpenseDetailResponse } from '../../../shared/models/expense.model';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { LeadContactResponse } from '../../../shared/models/lead.model';
import {
  LocationResponse,
  UserResponse,
} from '../../../shared/models/meeting.model';
import { CommonService } from '../../../shared/services/common.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { ExternalService } from '../../../shared/services/external.service';
import { IdentityService } from '../../../shared/services/identity.service';

@Component({
  selector: 'app-add-expense',
  standalone: false,
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit, OnChanges {
  public expenseForm!: FormGroup;
  public expenseId: string = '';
  public transportModes: GeneralMasterResponse[] = [];
  public users: UserResponse[] = [];
  public customers: LeadCustomerResponse[] = [];
  public leadContacts: LeadContactResponse[] = [];
  public locations: LocationResponse[] = [];
  selectedFile: File | null = null;
  fileError: string | null = null; // For error handling
  imagePreview: string | null = null; // For image preview
  @Input() expenseResponse: ExpenseDetailResponse | null = null;
  @Input() typeData: string = '';
  @Input() addMeetingResponse: string | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private expenseService: ExpenseService,
    private externalService: ExternalService,
    private customerService: CustomerService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private identityService: IdentityService
  ) {
    this.expenseForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenseResponse'] && this.expenseResponse) {
      this.expenseId = this.expenseResponse.expenseId
      this.expenseForm.patchValue({
        checkedOutLocation:this.expenseResponse.checkedInLocation,
        expenseCode:this.expenseResponse.expenseId,
        customerName:this.expenseResponse.companyName,
        MeetingDate:this.expenseResponse.expenseDate,
        TransportModeId:this.expenseResponse.transportModeId ? this.expenseResponse.transportModeId:null,
        ExpenseDate:this.expenseResponse.expenseDate,
        checkedInLocation:this.expenseResponse.checkedInLocation,
        DistanceInKm:this.expenseResponse.distanceInKm,
        expRate:this.expenseResponse.expenseRate,
        Amount:this.expenseResponse.amount,
        remarks:this.expenseResponse.remarks,
        // SupportingDocument:this.expenseResponse.supportingDocument,
        // expenseCreated:this.expenseResponse.remarks
      })
    } else {
      this.expenseForm.reset();
      this.expenseId = '';
    }

    if (changes['addMeetingResponse'] && this.addMeetingResponse) {
      this.expenseForm.patchValue({ meetingId: this.addMeetingResponse });
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.getTransportModes();
  }

  onClose(){
    this.expenseForm.reset();
    this.buildForm();
  }

  buildForm(): void {
    let assignedTo = this.identityService.getLoggedUserId();
    this.expenseForm = new FormGroup({
      TransportModeId: new FormControl('', Validators.required),
      ExpenseDate: new FormControl(todayDate, [Validators.required]),
      punchedInLocation: new FormControl(null),
      checkedInLocation: new FormControl(null),
      DistanceInKm: new FormControl(null),
      Amount: new FormControl(null),
      remarks: new FormControl(null,[Validators.required]),
      meetingId: new FormControl(null),
      customerName:new FormControl(),
      MeetingDate: new FormControl(todayDate),
      checkedOutLocation:new FormControl(null),
      expRate:new FormControl(),
      expenseCode:new FormControl(),
      SupportingDocument:new FormControl(''),
      CreatedBy:new FormControl(assignedTo)
    });
  }
    onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/jpg',
      ];
      if (validImageTypes.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string; // Set the base64 string for preview
        };
        reader.readAsDataURL(file);
      } else {
        this.fileError =
          'Please upload a valid image file (JPEG, PNG, or GIF).';
        this.selectedFile = null;
        this.imagePreview = null; // Clear preview if invalid file
      }
    }
  }
  onSubmitExpense(form: FormGroup): void {
    if (form.valid) {
      var formData = new FormData();
      formData.append("ModifiedBy", "");
      formData.append("CheckedInLocation", form.value.checkedInLocation);
      formData.append("ExpenseDate", form.value.ExpenseDate);
      formData.append("UserId", this.identityService.getLoggedUserId());
      formData.append("PunchedInLocation", form.value.punchedInLocation);
      formData.append("TransportModeId",form.value.TransportModeId);
      formData.append("SupportingDocument",form.value.SupportingDocument);
      formData.append("Remarks", form.value.remarks);
      formData.append("MeetingId", this.expenseResponse?.meetingId ?? '');
      formData.append("Amount", form.value.Amount);
      formData.append("file", "");
      formData.append("DistanceInKm",form.value.DistanceInKm);
      formData.append("CreatedBy", this.identityService.getLoggedUserId());
      this.typeData === 'AddExpense' ? this.addExpense(formData) : this.updateExpense(formData);
    }else{
      this.expenseForm.markAllAsTouched()
    }
  }

  addExpense(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.expenseService.addExpense(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.expenseForm.reset();
          this.buildForm();
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
  
  updateExpense(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.expenseService.updateExpense(this.expenseId, dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.expenseForm.reset();
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
  getTransportModes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'SERCAT').subscribe({
      next: (response) => {
        if (response) {
          this.transportModes = response.data;
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
}

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
import { ExpenseGeneralService } from '../../../shared/services/expense-general.service';
import { GeneralMasterResponseList } from '../../../shared/models/expenseGeneral.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  public getGeneralmaster:GeneralMasterResponseList[] = [];
  public users: UserResponse[] = [];
  public customers: LeadCustomerResponse[] = [];
  public leadContacts: LeadContactResponse[] = [];
  public locations: LocationResponse[] = [];
  selectedFile: File | null = null;
  fileError: string | null = null; // For error handling
  imagePreview: string | null = null; // For image preview
  fileUrl: SafeResourceUrl | null = null;
  @Input() expenseResponse: ExpenseDetailResponse | null = null;
  @Input() typeData: string = '';
  @Input() addMeetingResponse: string | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  isImage: boolean = false;
  isPdf: boolean = false;
  constructor(
    private expenseService: ExpenseService,
    private externalService: ExternalService,
    private customerService: CustomerService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private identityService: IdentityService,
    private expenseGeneralService:ExpenseGeneralService,
    private sanitizer: DomSanitizer
  ) {
    this.expenseForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenseResponse'] && this.expenseResponse) {
      this.expenseId = this.expenseResponse.expenseId;
      this.expenseForm.patchValue({
        checkedOutLocation: this.expenseResponse.checkedInLocation,
        expenseCode: this.expenseResponse.expenseId,
        customerName: this.expenseResponse.companyName,
        MeetingDate: this.expenseResponse.expenseDate,
        TransportModeId: this.expenseResponse.transportModeId === "0" ? '' : this.expenseResponse.transportModeId|| null,
        ExpenseDate: this.expenseResponse.expenseDate,
        checkedInLocation: this.expenseResponse.checkedInLocation,
        DistanceInKm: this.expenseResponse.distanceTravelled,
        expRate: this.expenseResponse.expenseRate,
        Amount: this.expenseResponse.amount,
        remarks: this.expenseResponse.remarks,
        // supportingDocument: this.expenseResponse.supportingDocument.replace("https://localhost:44320/", "") 
      });
     this.setFileUrl(this.expenseResponse.supportingDocument);
      this.OntransportModeChange(this.expenseResponse.transportModeId);
    } else {
      this.expenseForm.reset();
      this.expenseId = '';
      this.fileUrl = '';
    }
  
    if (changes['addMeetingResponse'] && this.addMeetingResponse) {
      this.expenseForm.patchValue({ meetingId: this.addMeetingResponse });
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.getTransportModes();
    this.getGeneralmasterList();
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

  setFileUrl(filePath: string) {
    if (filePath.startsWith('http') || filePath.startsWith('https')) {
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
    } else {
      this.fileUrl = null;
    }
    this.isImage = /\.(jpg|jpeg|png|gif)$/i.test(filePath);
    this.isPdf = /\.pdf$/i.test(filePath);
  }

  handleInputChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const fileUrl = URL.createObjectURL(file);
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.isImage = file.type.startsWith('image');
    this.isPdf = file.type === 'application/pdf';
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
      formData.append("Remarks", form.value.remarks);
      formData.append("MeetingId", this.expenseResponse?.meetingId ?? '');
      formData.append("Amount", form.value.Amount);
      formData.append("DistanceInKm",form.value.DistanceInKm);
      formData.append("CreatedBy", this.identityService.getLoggedUserId());
      if (this.selectedFile) {
        formData.append("SupportingDocument",this.selectedFile?.name);
        formData.append("file", this.selectedFile);
      }
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

  getGeneralmasterList(){
    const filters: any = {
      Page: 1,
      PageSize: 5000,
      export:false
    };
   this.expenseGeneralService.getGeneralmasterList(filters).subscribe({
    next: (response) => {
      if (response) {
              this.getGeneralmaster = response.data;
            }
            this.commonService.updateLoader(false);
          },
          error: (response: any) => {
            this.toasterService.error(response);
            this.commonService.updateLoader(false);
          },
   })
  }

  OntransportModeChange(data:any){
    let storedUser = localStorage.getItem('loginUser');
    let parsedUser = JSON.parse(storedUser || '');
    const ratePerKM = this.getGeneralmaster.find((d)=>d.designationId.toString() === parsedUser.designationId && d.transportModeId.toString() === data);
    const expRate = ratePerKM?.ratePerKM ?? 0;
    const amount = expRate * (this.expenseForm.value.DistanceInKm || 0);
    this.expenseForm.patchValue({
      expRate:ratePerKM?.ratePerKM || 0,
      Amount:amount
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

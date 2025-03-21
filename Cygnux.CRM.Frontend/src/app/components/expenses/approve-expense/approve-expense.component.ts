import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { ExpenseDetailResponse, ExpenseResponse } from '../../../shared/models/expense.model';
import { CommonService } from '../../../shared/services/common.service';
import { ExternalService } from '../../../shared/services/external.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { ExpenseService } from '../../../shared/services/expense.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { Modal } from 'bootstrap';
import { ExpenseGeneralService } from '../../../shared/services/expense-general.service';
import { GeneralMasterResponseList } from '../../../shared/models/expenseGeneral.model';


@Component({
  selector: 'app-approve-expense',
  standalone: false,
  templateUrl: './approve-expense.component.html',
  styleUrl: './approve-expense.component.scss'
})
export class ApproveExpenseComponent {
  approveForm!:FormGroup;
  @Input() expenseResponse:ExpenseDetailResponse | null = null;
  public transportModes: GeneralMasterResponse[] = []
  constructor(private commonService: CommonService,private externalService: ExternalService,private expenseGeneralService:ExpenseGeneralService,private toasterService: ToastrService,private expenseService:ExpenseService,public identifyService :IdentityService){}
  @Output() onClose = new EventEmitter<ExpenseResponse>();
  typeEvent:string='';
  public isDefaultComment!: string;
  @ViewChild('remarksInput') remarksInput!: NgModel; // Access the ngModel directive
  public getGeneralmaster:GeneralMasterResponseList[] = [];
  ngOnInit(){
    this.buildForm();
    this.getTransportModes(); 
    this.getGeneralmasterList();
  }

  ngOnChanges(changes: any): void {
    if (changes['expenseResponse'] && this.expenseResponse) {
      this.approveForm.patchValue(this.expenseResponse);
      this.approveForm.patchValue({
        checkOutLocation:this.expenseResponse.checkedInLocation,
        expenseCode:this.expenseResponse.expenseId,
        requestId:this.expenseResponse.requestID ==='Not Generated'?'0':this.expenseResponse.requestID,
        distanceInKm:this.expenseResponse.distanceTravelled,
        expenseRate:(Number(this.expenseResponse.amount) || 0) / (Number(this.expenseResponse.distanceTravelled) || 1),
        transportModeId:this.expenseResponse.transportModeId === '0' ? null :this.expenseResponse.transportModeId,
        auditorRemark:this.expenseResponse.auditRemark,
        AttendeeCode: this.expenseResponse.attendeeCode
      });
      this.OntransportModeChange(this.expenseResponse.transportModeId);
    }else{
      this.approveForm?.reset();
    }
  }

  OntransportModeChange(data:any){
    let storedUser = localStorage.getItem('loginUser');
    let parsedUser = JSON.parse(storedUser || '');
    const ratePerKM = this.getGeneralmaster.find((d)=>d.designationId.toString() === parsedUser.designationId && d.transportModeId.toString() === data);
    const expRate = ratePerKM?.ratePerKM ?? 0;
    const amount = expRate * (this.approveForm.value.distanceInKm || 0);
    this.approveForm.patchValue({
      expenseRate:ratePerKM?.ratePerKM || 0,
      amount:amount
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

  buildForm(){
    this.approveForm = new FormGroup({
      expenseCode: new FormControl(null),
      distanceInKm: new FormControl(null),
      companyName: new FormControl(null),
      requestId: new FormControl(null),
      expenseRate: new FormControl(null),
      meetingDate: new FormControl(null),
      amount: new FormControl(null),
      transportModeId: new FormControl(null,Validators.required),
      document: new FormControl(null),
      expenseDate: new FormControl(null),
      remarks: new FormControl(null),
      checkedInLocation: new FormControl(null),
      auditorRemark: new FormControl(null,Validators.required),
      checkOutLocation:new FormControl(null),
      expenseId:new FormControl(''),
      meetingId:new FormControl(''),
      AttendeeCode:new FormControl('')
      // managerRemark:new FormControl('')
    });
  }
  onCloseEvent(){
    this.approveForm.reset();
    this.buildForm();
    this.isDefaultComment ='';
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
  handleApproval(isApproved: boolean) {
    this.commonService.updateLoader(true);
    const data = {
        expenseId: this.approveForm.value.expenseId,
        meetingId: this.approveForm.value.meetingId,
        attendeeCode: this.approveForm.value.AttendeeCode,
        isApproved: isApproved,
        approvedBy:  this.identifyService.getLoggedUserId(),
        reasonRemark:this.approveForm.value.auditorRemark,
    };
    if(this.approveForm.valid){ 
      this.expenseService.expenseApproval(data).subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.success(response.data.message);
            this.onClose.emit()
            this.onCancel()
          } else {
            this.toasterService.error(response.error?.message );
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response.error?.message);
          this.commonService.updateLoader(false);
        },
      });
    }else {
      this.onCancel();
      this.approveForm.markAllAsTouched()
    }
  }
  
  // onApprove() {
  //   this.handleApproval(true);
  // }
  
  onReject(type:string) {
    const modalElement = document.getElementById('rejectTemplate');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.typeEvent=type;
    }
  }

  updateAdditionalInfo(event:any){
    this.approveForm.patchValue({
      auditorRemark :event
    });
    if(this.typeEvent === 'Approve'){
      this.handleApproval(true);
    }else if(this.typeEvent === 'Reject'){
      this.handleApproval(false)
    }
  }

  onCancel() {
    const modalElement = document.getElementById('rejectTemplate');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
      this.isDefaultComment ='';
      if (this.remarksInput) {
        this.remarksInput.control.markAsPristine();
        this.remarksInput.control.markAsUntouched();
        this.remarksInput.control.updateValueAndValidity();
      }
    }
  }
}

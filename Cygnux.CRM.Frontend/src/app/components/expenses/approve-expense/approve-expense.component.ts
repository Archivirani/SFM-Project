import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseDetailResponse, ExpenseResponse } from '../../../shared/models/expense.model';
import { CommonService } from '../../../shared/services/common.service';
import { ExternalService } from '../../../shared/services/external.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { ExpenseService } from '../../../shared/services/expense.service';
import { IdentityService } from '../../../shared/services/identity.service';

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
  constructor(private commonService: CommonService,private externalService: ExternalService,private toasterService: ToastrService,private expenseService:ExpenseService,public identifyService :IdentityService){}
  @Output() onClose = new EventEmitter<ExpenseResponse>();

  ngOnInit(){
    this.buildForm();
    this.getTransportModes(); 
  }

  ngOnChanges(changes: any): void {
    if (changes['expenseResponse'] && this.expenseResponse) {
      this.approveForm.patchValue(this.expenseResponse);
      this.approveForm.patchValue({
        checkOutLocation:this.expenseResponse.checkedInLocation,
        expenseCode:this.expenseResponse.expenseId,
        requestDate:this.expenseResponse.requestDate === '01/01/1900 00:00:00' ? '' : '',
        distanceInKm:this.expenseResponse.distanceTravelled,
        expenseRate:(Number(this.expenseResponse.amount) || 0) / (Number(this.expenseResponse.distanceTravelled) || 1),
        transportModeId:this.expenseResponse.transportModeId === '0' ? null :this.expenseResponse.transportModeId,
        auditorRemark:this.expenseResponse.auditRemark
      });
    }else{
      this.approveForm?.reset();
    }
  }

  buildForm(){
    this.approveForm = new FormGroup({
      expenseCode: new FormControl(null),
      distanceInKm: new FormControl(null),
      companyName: new FormControl(null),
      requestDate: new FormControl(null),
      expenseRate: new FormControl(null),
      meetingDate: new FormControl(null),
      amount: new FormControl(null),
      transportModeId: new FormControl(null,Validators.required),
      document: new FormControl(null),
      expenseDate: new FormControl(null),
      remarks: new FormControl(null),
      checkedInLocation: new FormControl(null),
      auditorRemark: new FormControl(null),
      checkOutLocation:new FormControl(null),
      expenseId:new FormControl(''),
      meetingId:new FormControl(''),
      // managerRemark:new FormControl('')
    });
  }
  onCloseEvent(){
    this.approveForm.reset();
    this.buildForm();
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
      this.approveForm.markAllAsTouched()
    }
  }
  
  onApprove() {
    this.handleApproval(true);
  }
  
  onReject() {
    this.handleApproval(false);
  }
  
}

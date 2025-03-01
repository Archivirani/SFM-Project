import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { ToastrService } from 'ngx-toastr';
import { ExternalService } from '../../../shared/services/external.service';
import { ExpenseGeneralService } from '../../../shared/services/expense-general.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { GeneralMaster } from '../../../shared/models/expenseGeneral.model';

@Component({
  selector: 'app-add-expense-general-master',
  standalone: false,
  templateUrl: './add-expense-general-master.component.html',
  styleUrl: './add-expense-general-master.component.scss'
})
export class AddExpenseGeneralMasterComponent {
  expenseMasterForm!: FormGroup;
  public expenseId: string = '';
  selectedFile: File | null = null;
  transportModes: GeneralMaster[] = [];
  designationList: GeneralMaster[] = [];
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input() expenseResponse: any | null = null;
  @Input() type: string = '';
  constructor(
    private commonService: CommonService,
    private expenseService: ExpenseService,
    private toasterService: ToastrService,
    private expenseGeneralService:ExpenseGeneralService,
    private identityService:IdentityService,
  ) { }
  ngOnChanges(changes: any): void {
    if (changes['expenseResponse'] && this.expenseResponse) {
      this.expenseMasterForm.patchValue({
        transportModeId: this.expenseResponse.transportModeId.toString(),
        designationId: this.expenseResponse.designationId.toString(),
        ratePerKM: this.expenseResponse.ratePerKM,
        id:this.expenseResponse.id,
        modifiedBy:this.expenseResponse.modifiedBy,
        active:this.expenseResponse.isActive,
      });
    }else{
      this.expenseMasterForm?.reset();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.getTransportModes();
    this.getDesignationList();
  }

  buildForm(): void {
    this.expenseMasterForm = new FormGroup({
      transportModeId: new FormControl(null, [Validators.required]),
      designationId: new FormControl(null, [Validators.required]),
      ratePerKM: new FormControl('', [Validators.required]),
      id: new FormControl(0),
      createdBy: new FormControl(''),
      modifiedBy: new FormControl(''),
      active: new FormControl(true),
    });
  }

  onClose(){
    this.expenseMasterForm.reset();
    this.buildForm();
  }

  getDesignationList(searchText: string | null = null){
    this.commonService.updateLoader(true);
    this.expenseGeneralService.getGeneralMaster(searchText, 'DESIG').subscribe({
      next: (response) => {
        if (response) {
          this.designationList = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  getTransportModes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.expenseGeneralService.getGeneralMaster(searchText, 'SERCAT').subscribe({
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


  onSubmitExpense(form: FormGroup): void {
    if (form.valid) {
      const data = {
        ...this.expenseMasterForm.value,
        transportModeId:parseInt(this.expenseMasterForm.value.transportModeId),
        designationId:parseInt(this.expenseMasterForm.value.designationId),
        ratePerKM:parseInt(this.expenseMasterForm.value.ratePerKM),
        createdBy:this.identityService.getLoggedUserId(),
      } 
      !this.expenseResponse? this.addGeneral(data): this.updateGeneral(data);
    }else{
      this.expenseMasterForm.markAllAsTouched()
    }
  }

  addGeneral(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.expenseGeneralService.addGeneralMaster(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.expenseMasterForm.reset();
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

  updateGeneral(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.expenseGeneralService.updateGeneralMaster(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.expenseMasterForm.reset();
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
}

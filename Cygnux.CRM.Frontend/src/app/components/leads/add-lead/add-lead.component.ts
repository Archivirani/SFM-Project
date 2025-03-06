import { DatePipe } from '@angular/common';
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
import {
  EmailRegex,
  MobileRegex,
  todayDate,
} from '../../../shared/constants/common';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { CityResponse, LeadResponse } from '../../../shared/models/lead.model';
import {
  LocationResponse,
  UserResponse,
} from '../../../shared/models/meeting.model';
import { CommonService } from '../../../shared/services/common.service';
import { ExternalService } from '../../../shared/services/external.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { LeadService } from '../../../shared/services/lead.service';
import { CustomerService } from '../../../shared/services/customer.service';

@Component({
  selector: 'app-add-lead',
  standalone: false,
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.scss'],
})
export class AddLeadComponent implements OnInit, OnChanges {
  public leadForm!: FormGroup;
  public leadId: string = '';
  public isEdit:boolean=false;
  public users: UserResponse[] = [];
  public leadCategories: GeneralMasterResponse[] = [];
  public leadSources: GeneralMasterResponse[] = [];
  public industryTypes: GeneralMasterResponse[] = [];
  public designations: GeneralMasterResponse[] = [];
  public serviceInterests: GeneralMasterResponse[] = [];
  public branches: LocationResponse[] = [];
  public cities: CityResponse[] = [];
  public regions: LocationResponse[] = [];

  @Input() leadResponse: LeadResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private leadService: LeadService,
    private externalService: ExternalService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private identityService: IdentityService,
    public customerService: CustomerService,
  ) {
    this.leadForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.getIndustryTypes();
    this.getLeadSources();
    this.getLeadCategories();
    this.getServiceInterests();
    this.getDesignations();
    this.getLocations();
    this.getCities();
    this.getUsers();
    this.buildForm();
  }

  buildForm(): void {
    let assignedTo = this.identityService.getLoggedUserId();
    let branchCode = this.identityService.getBranchCode();
    let storedUser = localStorage.getItem('loginUser');
    let parsedUser = JSON.parse(storedUser || '');
    this.leadForm = new FormGroup({
      leadCategoryId: new FormControl(null, [Validators.required]),
      LeadDate: new FormControl(todayDate, [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      contactName: new FormControl(null, [Validators.required]),
      contactNo: new FormControl(null, [
        Validators.required,
        Validators.pattern(MobileRegex),
      ]),
      address: new FormControl(null),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(EmailRegex),
      ]),
      cityId: new FormControl(null),
      BranchId: new FormControl(branchCode),
      RegionId: new FormControl(parsedUser.reportingLoc),
      designationId: new FormControl(parsedUser.designationId),
      LeadSourceId: new FormControl(null),
      assignedToId: new FormControl(assignedTo),
      industryTypeId: new FormControl(null),
      ServiceInterestedIDs: new FormControl([], [Validators.required]),
      isActive: new FormControl(true),
      // customerCode:new FormControl('', [Validators.required])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leadResponse'] && this.leadResponse) {
      this.isEdit=true;
      this.leadForm.patchValue({
        leadCategoryId: this.leadResponse.leadCategoryId,
        LeadDate: this.leadResponse.leadDate,
        companyName: this.leadResponse.companyName,
        contactName: this.leadResponse.contactName,
        contactNo: this.leadResponse.contactNo,
        address: this.leadResponse.address,
        email: this.leadResponse.email,
        cityId: this.leadResponse.cityId,
        BranchId: this.leadResponse.branchId,
        RegionId: this.leadResponse.regionId,
        designationId: this.leadResponse.designationId,
        LeadSourceId: this.leadResponse.leadSourceId,
        assignedToId: this.leadResponse.assignedToId,
        industryTypeId: this.leadResponse.industryTypeId,
        ServiceInterestedIDs: this.leadResponse.serviceInteresteds?this.leadResponse.serviceInteresteds.toString().split(','):[], 
        isActive: this.leadResponse.isActive
      });
      this.leadId = this.leadResponse.leadId;
    } else {
      this.leadId = '';
      this.isEdit=false;
      this.leadForm.reset();
      this.buildForm();
    }
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
  
  onClose(){
    this.leadForm.reset();
      this.buildForm();
  }

  onSubmitLead(form: FormGroup): void {
    if (form.valid) {
      let assignedTo = this.identityService.getLoggedUserId();
      const dataToSubmit = {
        ...form.value,
        LeadDate:this.formatDate(form.value.LeadDate),
        ServiceInterestedIDs: form.value.ServiceInterestedIDs.join(','),
        CreatedBy:assignedTo,
        leadCategoryId:parseInt(form.value.leadCategoryId),
        companyName: form.value.companyName.toUpperCase()
      };
      !this.leadId ? this.addLead(dataToSubmit) : this.updateLead(dataToSubmit);
    }else{
      this.leadForm.markAllAsTouched()
    }
  }

  getCities() {
    this.commonService.updateLoader(true);
    this.externalService.getCities().subscribe({
      next: (response) => {
        if (response) {
          this.cities = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getDesignations(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'DESIG')
      .subscribe({
        next: (response) => {
          if (response) {
            this.designations = response.data;
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }
  getIndustryTypes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService.getGeneralMaster(searchText, 'IND').subscribe({
      next: (response) => {
        if (response) {
          this.industryTypes = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getLeadCategories(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'LEADCAT').subscribe({
      next: (response) => {
        if (response) {
          this.leadCategories = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getLeadSources(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'LEADSRC')
      .subscribe({
        next: (response) => {
          if (response) {
            this.leadSources = response.data;
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }
  getServiceInterests(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'FLTPROD').subscribe({
      next: (response) => {
        if (response) {
          this.serviceInterests = response.data;
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
            name: `${user.userId } : ${ user.name}`,
          }));
          // this.users = response.data;
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
          this.branches = response.data;
          this.regions = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  addLead(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.leadService.addLead(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.leadForm.reset();
          this.buildForm()
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

  updateLead(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.leadService.updateLead(this.leadId, dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.leadForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        // this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
}

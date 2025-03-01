import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';
import { ExternalService } from '../../../shared/services/external.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { AssignToList, ComplaintGetUser, ComplaintResponse } from '../../../shared/models/complaint.model';
import { LocationResponse, UserResponse } from '../../../shared/models/meeting.model';
import { EmailRegex, MultipleEmailRegex } from '../../../shared/constants/common';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-ticket',
  standalone: false,
  templateUrl: './add-ticket.component.html',
  styleUrl: './add-ticket.component.scss',
  providers: [DatePipe] 
})
export class AddTicketComponent {
  public ticketTypes: GeneralMasterResponse[] = [];
  public ticketSubTypes: GeneralMasterResponse[] = [];
  public priorities: GeneralMasterResponse[] = [];
  public ticketSources: GeneralMasterResponse[] = [];
  public users: UserResponse[] = [];
  public ticketForm!: FormGroup;
  public escalationForm!: FormGroup;
  public docketNotFound = false;
  public emails: string[] = [];
  public emailInput: string = '';
  public emailError: boolean = false;
  public locations: LocationResponse[] = [];
  public userList!:ComplaintGetUser;
  public selectedFile: File | null = null;
  public assignToList:AssignToList[]=[]
  private docketNoSubject = new Subject<string>();
  minDate!: Date;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input() complaint:string='';
  datepickerMDY: any;
  @Input() set complaintResponse(ComplaintResponse: ComplaintResponse | null) {
    if (ComplaintResponse) {
     const assignedTo = this.users.find(d=>d.name === ComplaintResponse.assignedTo)?.userId
      this.ticketForm.patchValue({
        userID:ComplaintResponse.userID,
        docketNo:ComplaintResponse.documentNo,
        complaintId:ComplaintResponse.complaintID,
        source:ComplaintResponse.source.toString(),
        priority:ComplaintResponse.priority.toString(),
        ticketDate:ComplaintResponse.compalaintDate,
        description:ComplaintResponse.description,
        type:ComplaintResponse.type.toString(),
        customerEmail:ComplaintResponse.customerEmail,
        subType:ComplaintResponse.subType.toString(),
        updateDate: this.formatDate(ComplaintResponse?.updateDate),
        updateRemarks:ComplaintResponse.updateRemark,
        assignedToId:assignedTo,
        remarks:ComplaintResponse.remarks,
        customerID: ComplaintResponse.customerID
      })
      this.createEscalationForm(ComplaintResponse);
      if(ComplaintResponse.documentNo){
        this.onDocketNo(ComplaintResponse.documentNo);
      }
      this.getComplaintGetUser();
    } else {
      this.buildForm();
    }
  }
  constructor(
    public identityService: IdentityService,
    public commonService: CommonService,
    public externalService: ExternalService,
    private datePipe: DatePipe,
    public toasterService: ToastrService, 
    private complaintService: ComplaintService,) {
    this.docketNoSubject.pipe(debounceTime(500),distinctUntilChanged(),filter(value => value.length >= 2)).subscribe(docketNo => {
      this.onDocketNo(docketNo); 
    });
   }

   formatDate(dateString: string | null | undefined): string | null {
    if (!dateString || dateString === '-' || dateString.trim() === '') {
      return null; // Handle invalid values safely
    }
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return null; // Return null if parsing fails
    }
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
  }

  ngOnInit() {
    this.buildForm();
    this.getTicketSubTypes();
    this.getTicketTypes();
    this.getticketSources()
    this.getPriorities();
    this.getUsers();
    this.createEscalationForm();
    this.getLocations();
    this.getAssignTo();
  }

  onClose(){
    this.ticketForm.reset();
    this.buildForm();
  }
  onEscalationClose(){
    this.escalationForm.reset();
    this.createEscalationForm();
  }
  buildForm(): void {
    this.minDate = new Date();
    let storedUser = localStorage.getItem('loginUser');
    let parsedUser = JSON.parse(storedUser || '');
    let assignedTo = this.identityService.getLoggedUserId();
    this.ticketForm = new FormGroup({
      userID: new FormControl(assignedTo),
      docketNo: new FormControl('', [Validators.required]),
      origin: new FormControl(''),
      userName: new FormControl(assignedTo),
      docDate: new FormControl(''),
      destination: new FormControl(''),
      managerId: new FormControl(''),
      EDD: new FormControl(''),
      ticketAddressTo: new FormControl(parsedUser.reportingLoc),
      managerName: new FormControl(''),
      billingParty: new FormControl(''),
      currentStatus: new FormControl(''),
      source: new FormControl('', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      complaintDate: new FormControl(this.minDate, [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      customerEmail: new FormControl('', []),
      subType: new FormControl('', [Validators.required]),
      browse: new FormControl(''),
      updateDate: new FormControl(''),
      updateRemarks: new FormControl(''),
      assignedToId: new FormControl(''),
      complaintId: new FormControl(''),
      remarks: new FormControl(''),
      closeBy: new FormControl(assignedTo),
      closeRemark: new FormControl('', [Validators.required]),
      customerID: new FormControl(''),
      closureDate:new FormControl(new Date()),
      currentLocation:new FormControl('')
    });
  }

  createEscalationForm(data?: any) {
    let assignedTo = this.identityService.getLoggedUserId();
    this.escalationForm = new FormGroup({
      complaintId: new FormControl(data?.complaintID),
      docketNo: new FormControl(data?.documentNo),
      type: new FormControl(data?.type.toString()),
      description: new FormControl(data?.description),
      assigned: new FormControl(data?.assignedTo),
      status: new FormControl(data?.compaintStatus),
      priority: new FormControl(data?.priority.toString()),
      escalatedTo: new FormControl('', [Validators.required]),
      escalatedEmail: new FormControl(data?.customerEmail),
      escalatedDate: new FormControl('', [Validators.required]),
      escalatedRemark: new FormControl('', [Validators.required]),
      documents: new FormControl(''),
      userID: new FormControl(assignedTo),
    });

  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === ';') {
      this.addEmail();
    }
  }

  addEmail() {
    let emailList = this.ticketForm.value.customerEmail
      .split(';')
      .map((email: any) => email.trim())
      .filter((email: any) => email);
  
    emailList.forEach((email: any) => {
      if (MultipleEmailRegex.test(email) && !this.emails.includes(email)) {
        this.emails.push(email);
        this.emailError = false;
      } else {
        this.emailError = true;
      }
    });
  
    this.ticketForm.get('customerEmail')?.setValue('');
  }
  

  removeEmail(index: number) {
    this.emails.splice(index, 1);
    this.ticketForm.get('customerEmail')?.setValue(this.emails.join(';'));
  }

  onDocketNoChange(event: any) {
    const docketNo = event.target.value;
    this.docketNoSubject.next(docketNo);
  }
  setDefaultDate() {
    const today = new Date();
    const todayDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1, // NgbDateStruct uses 1-based months
      day: today.getDate(),
    };

    this.ticketForm.get('complaintDate')?.setValue(todayDate);
  }

  onDocketNo(docketNo: string) {
    this.commonService.updateLoader(true);
    this.complaintService.getDocDataDetail(docketNo).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.ticketForm.patchValue({
            origin: response.data.origin,
            destination: response.data.destination,
            docDate:response.data.documentDate,
            EDD:response.data.edd,
            billingParty:response.data.customerName,
            currentStatus:response.data.currentStatus,
            currentLocation:response.data.currentLocation
          });
        } 
        this.commonService.updateLoader(false);
      },
      error: (error: any) => {
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

  getAssignTo() {
    this.commonService.updateLoader(true);
    this.complaintService.getAssignTo().subscribe({
      next: (response) => {
        if (response) {
          this.assignToList = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  getComplaintGetUser(){
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintGetUser(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response.success) {
          this.userList = response.data
          this.ticketForm.patchValue({
            managerName:this.userList.managerName,
            managerId:this.userList.managerId,
            userName:this.userList.userName,
            userID:this.userList.userId,
          });
        } 
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
 
  onSubmitTicket() {
    if (this.complaint === 'Update') {
      const {customerID, closeDate, closeRemark,closureDate,docketNo, closeBy, billingParty, browse, currentStatus, destination, docDate, EDD, managerId, managerName, origin, ticketAddressTo, userName, ...update } = this.ticketForm.value;
      update.documentNo=this.ticketForm.value.docketNo,
      update.document = 'docket',
      this.updateTicket(update)
    } else if (this.complaint === 'Add') {
      const {customerID, closeDate, closeRemark,closureDate,userID,subType,type,docketNo,source,priority,description,customerEmail, closeBy,browse,assignedToId, remarks, complaintId, updateRemarks, updateDate, billingParty, destination, docDate, EDD, managerId, managerName, origin, userName, ...data } = this.ticketForm.value;
      data.DocumentNo = this.ticketForm.value.docketNo,
      data.Document = this.ticketForm.value.browse,
      data.AssignedTo = this.ticketForm.value.assignedToId,
      data.CustomerEmail = this.emails.join(';'),
      data.Description = this.ticketForm.value.description,
      data.Priority = this.ticketForm.value.priority,
      data.Source = this.ticketForm.value.source,
      data.SubType = this.ticketForm.value.subType,
      data.Type = this.ticketForm.value.type,
      data.UserID = this.ticketForm.value.userID,
      this.addTicket(data);
    } else if (this.complaint === 'Close') {
      const close = {
        ComplaintID: this.ticketForm.value.complaintId,
        CloseBy: this.ticketForm.value.closeBy,
        CloseRemark: this.ticketForm.value.closeRemark,
        // closureDate:this.ticketForm.value.closureDate
      }
      this.closeTicket(close)
    }
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected file
    }
  }
  addTicket(dataToSubmit: any) {
    this.commonService.updateLoader(true);
    this.complaintService.addComplaint(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.ticketForm.reset();
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
  
  closeTicket(dataToSubmit: any) {
    this.commonService.updateLoader(true);
    this.complaintService.closeTicket(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.ticketForm.reset();
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

  updateTicket(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.complaintService
      .updateComplaint(this.ticketForm.value.complaintId, dataToSubmit)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.success(response.data.message);
            this.dataEmitter.emit();
            this.ticketForm.reset();
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

  escalationTicket() {
    const { priority, status, assigned, description, type, docketNo, ...data } = this.escalationForm.value;
    this.commonService.updateLoader(true);
    this.complaintService.AddEscTktComplaint(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.escalationForm.reset();
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

  getTicketTypes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'CMPLNTYPE').subscribe({
      next: (response) => {
        if (response) {
          this.ticketTypes = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getTicketSubTypes(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    this.externalService.getGeneralMaster(searchText, 'CMPLNSBTYP').subscribe({
      next: (response) => {
        if (response) {
          this.ticketSubTypes = response.data;
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

  getticketSources(searchText: string | null = null) {
    this.commonService.updateLoader(true);
    return this.externalService
      .getGeneralMaster(searchText, 'LEADSRC')
      .subscribe({
        next: (response) => {
          if (response) {
            this.ticketSources = response.data;
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

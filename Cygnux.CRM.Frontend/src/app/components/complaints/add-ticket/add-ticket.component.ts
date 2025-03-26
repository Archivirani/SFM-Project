import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';
import { ExternalService } from '../../../shared/services/external.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { AssignToList, ComplaintGetUser, ComplaintResponse, TicketAddressToResponse } from '../../../shared/models/complaint.model';
import { UserResponse } from '../../../shared/models/meeting.model';
import { MultipleEmailRegex } from '../../../shared/constants/common';
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
  public escEmail:string[]=[];
  public emailInput: string = '';
  public emailError: boolean = false;
  public locations: TicketAddressToResponse[]=[];
  public userList!:ComplaintGetUser;
  public selectedFile: File | null = null;
  public assignToList:AssignToList[]=[]
  private docketNoSubject = new Subject<string>();
  minDate!: Date;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input() complaint:string='';
  datepickerMDY: any;
  @Input() set complaintResponse(ComplaintResponse: ComplaintResponse | null) {
    this.getComplaintGetUser();
    if (ComplaintResponse) {
     const assignedTo = this.users.filter(d=>d.name === ComplaintResponse.assignedTo)
     if(ComplaintResponse.documentNo){
      this.onDocketNo(ComplaintResponse.documentNo);
    }
    let customerEmail = ComplaintResponse.customerEmail ? ComplaintResponse.customerEmail.split(';').map((email: string) => email.trim()) : [];
    if(this.complaint !== 'Escalation'){this.getAssignTo(ComplaintResponse?.ticketAddressToId)}else{this.getAssignTo('')}
    this.getTicketSubTypes(ComplaintResponse.type);
      this.ticketForm.patchValue({
        userID:ComplaintResponse.userID,
        docketNo:ComplaintResponse.documentNo,
        complaintId:ComplaintResponse.complaintID,
        source:ComplaintResponse.source.toString(),
        priority:ComplaintResponse.priority.toString(),
        ticketDate:ComplaintResponse.compalaintDate,
        description:ComplaintResponse.description,
        type:ComplaintResponse.type.toString(),
        // customerEmail:[customerEmail],
        subType:ComplaintResponse.subType.toString(),
        complaintDate:ComplaintResponse.compalaintDate?ComplaintResponse.compalaintDate:this.minDate,
        updateDate: new Date(),
        // updateRemarks:ComplaintResponse.updateRemark === '-' ? '':ComplaintResponse.updateRemark,
        assignedToId:ComplaintResponse?.assignToId ,
        remarks:ComplaintResponse.remarks,
        ticketAddressTo:ComplaintResponse.ticketAddressToId,
        customerID: ComplaintResponse.customerID
      })
      this.emails = [...customerEmail];
      this.createEscalationForm(ComplaintResponse);
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
    this.getTicketTypes();
    this.getticketSources()
    this.getPriorities();
    this.getUsers();
    this.createEscalationForm();
    this.getLocations();
    // this.getAssignTo();
  }

  onClose(){
    this.emails=[];
    this.ticketForm.reset();
    this.buildForm();
    this.ticketForm.patchValue({
      managerName:this.userList.complaintManagerName,
      managerId:this.userList.complaintManagerID,
      userName:this.userList.userName,
      userID:this.userList.userId,
    });
  }
  onEscalationClose(){
    this.escalationForm.reset();
    this.createEscalationForm();
    this.escEmail = [];
    this.emails=[];
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
      ticketAddressTo: new FormControl(null,Validators.required),
      managerName: new FormControl(''),
      billingParty: new FormControl(''),
      currentStatus: new FormControl(''),
      source: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      complaintDate: new FormControl(this.minDate, [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      customerEmail: new FormControl('', []),
      subType: new FormControl(null, [Validators.required]),
      browse: new FormControl(''),
      updateDate: new FormControl(new Date()),
      updateRemarks: new FormControl(''),
      assignedToId: new FormControl([],[Validators.required]),
      complaintId: new FormControl(''),
      remarks: new FormControl(''),
      closeBy: new FormControl(assignedTo),
      closeRemark: new FormControl(''),
      customerID: new FormControl(''),
      closureDate:new FormControl(new Date()),
      currentLocation:new FormControl('')
    });
  }

  createEscalationForm(data?: any) {
    let assignedTo = this.identityService.getLoggedUserId();
    let existingEmails = data?.escEmailId ? data.escEmailId.split(';').map((email: string) => email.trim()) : [];
    this.escalationForm = new FormGroup({
      complaintId: new FormControl(data?.complaintID),
      docketNo: new FormControl(data?.documentNo),
      type: new FormControl(data?.type.toString()),
      description: new FormControl(data?.description),
      assigned: new FormControl(data?.assignToId),
      status: new FormControl(data?.compaintStatus),
      priority: new FormControl(data?.priority.toString()),
      escalatedTo: new FormControl(data?.escalationTo ? data.escalationTo.split(',') : [], [Validators.required]),
      escalatedEmail: new FormControl(),
      escalatedDate: new FormControl(new Date(), [Validators.required]),
      escalatedRemarks: new FormControl('', [Validators.required]),
      documents: new FormControl(''),
      userID: new FormControl(assignedTo),
    });
    this.escEmail = [...existingEmails];
  }

  convertToFormattedDate(dateStr: string): string | null {
    if (!dateStr) return null;
    let dateParts = dateStr.split(" ")[0].split("/");
    if (dateParts.length !== 3) return null;
    let month = Number(dateParts[0]); // MM
    let day = Number(dateParts[1]);   // DD
    let year = Number(dateParts[2]);  // YYYY
    return `${this.padZero(day)}/${this.padZero(month)}/${year}`;
  }
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === ';') {
      this.addEmail();
    }
  }

  onEscKeyUp(event: KeyboardEvent){
    if (event.key === ';') {
      this.addEscEmail();
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

  addEscEmail(){
    let emailList = this.escalationForm.value.escalatedEmail
    .split(';')
    .map((email: any) => email.trim())
    .filter((email: any) => email);

  emailList.forEach((email: any) => {
    if (MultipleEmailRegex.test(email) && !this.escEmail.includes(email)) {
      this.escEmail.push(email);
      this.emailError = false;
    } else {
      this.emailError = true;
    }
  });

  this.escalationForm.get('escalatedEmail')?.setValue('');
  }
  

  removeEmail(index: number) {
    this.emails.splice(index, 1);
    this.ticketForm.get('customerEmail')?.setValue(this.emails.join(';'));
  }

  removeEscEmail(index:number){
    this.escEmail.splice(index, 1);
    this.escalationForm.get('escalatedEmail')?.setValue(this.escEmail.join(';'));
  }

  onAssignToList(event:any){
    if (event && event.length) {
      const emailIds = event.map((user: any) => user.emailId);
      this.escEmail = [];
      // this.escEmail.push(this.complaintResponse?.escEmailId)
      emailIds.forEach((email: any) => {
        if (MultipleEmailRegex.test(email) && !this.escEmail.includes(email)) {
          this.escEmail.push(email);
          this.emailError = false;
        } else {
          this.emailError = true;
        }
      });
    }else{
      this.escEmail = [];
    }
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
    this.complaintService.getTicketAddressTo().subscribe({
      next: (response) => {
        if (response) {
          this.locations = response.data.map((user: any) => ({
            locCode: user.locCode,
            locName: `${user.locCode}: ${user.locName}`,
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

  getAssignTo(locCode:string) {
    this.ticketForm.patchValue({
      assignedToId:null
    })
    this.commonService.updateLoader(true);
    this.complaintService.getAssignTo(locCode).subscribe({
      next: (response) => {
        if (response) {
          // this.assignToList = response.data;
          this.assignToList = response.data.map((user: any) => ({
            userId: user.userId,
            userName: `${user.userId}: ${user.userName}`,
            emailId:user.emailId
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

  getComplaintGetUser(){
    this.commonService.updateLoader(true);
    this.complaintService.getComplaintGetUser(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response.success) {
          this.userList = response.data
          this.ticketForm.patchValue({
            managerName:this.userList.complaintManagerName,
            managerId:this.userList.complaintManagerID,
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
    if(this.ticketForm.valid){
    if (this.complaint === 'Update') {
      const {customerID, closeDate, closeRemark,closureDate,docketNo, complaintDate,currentLocation,customerEmail,document,documentNo,priority,assignedToId,source,subType,type,closeBy, billingParty, browse, currentStatus, destination, docDate, EDD, managerId, managerName, origin, userName, ...update } = this.ticketForm.value;
      update.documentNo=this.ticketForm.value.docketNo,
      update.assignedToId = this.ticketForm.value.assignedToId,
      update.CustomerEmail = this.emails.join(';'),
      update.updateDate =  this.datePipe.transform(this.ticketForm.value.updateDate, 'dd/MM/yyyy') || '';  
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
        // data.complaintDate =  this.datePipe.transform(this.ticketForm.value.complaintDate, 'dd/MM/yyyy') || '';  
        this.addTicket(data);
    } else if (this.complaint === 'Close') {
      const close = {
        ComplaintID: this.ticketForm.value.complaintId,
        CloseBy: this.ticketForm.value.closeBy,
        CloseRemark: this.ticketForm.value.closeRemark,
        CustomerEmail : this.emails.join(';'),
        // closureDate:this.ticketForm.value.closureDate
      }
      this.closeTicket(close)
    }
    }else{
      this.ticketForm.markAllAsTouched()
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
          this.onClose();
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
          this.onClose();
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
            this.onClose();
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
    data.escalatedEmail =  this.escEmail.join(';')
    data.escalatedTo = this.escalationForm.value.escalatedTo.map((user: any) => user).join(',');
    data.escalatedDate = this.datePipe.transform(this.escalationForm.value.escalatedDate, 'dd/MM/yyyy') || '';  
    this.commonService.updateLoader(true);
    this.complaintService.AddEscTktComplaint(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.onEscalationClose()
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

  getTicketSubTypes(event: any ) {
    this.ticketForm.patchValue({
      subType:null
    })
    this.commonService.updateLoader(true);
    this.complaintService.getTicketSubType(event).subscribe({
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

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
import { Subject } from 'rxjs';
import { LeadCustomerResponse } from '../../../shared/models/customer.model';
import { GeneralMasterResponse } from '../../../shared/models/external.model';
import { UserResponse } from '../../../shared/models/meeting.model';
import { TaskResponse } from '../../../shared/models/task.model';
import { CommonService } from '../../../shared/services/common.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { ExternalService } from '../../../shared/services/external.service';
import { TaskService } from '../../../shared/services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: false,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit, OnChanges {
  public taskForm!: FormGroup;
  public taskId: string = '';
  public leadCategories: GeneralMasterResponse[] = [];
  public users: UserResponse[] = [];
  public priorities: GeneralMasterResponse[] = [];
  public customers: LeadCustomerResponse[] = [];
  @Input() taskResponse: TaskResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  leadCategory$ = new Subject<string>();
  prioritySearch$ = new Subject<string>();

  constructor(
    private taskService: TaskService,
    private externalService: ExternalService,
    public customerService: CustomerService,
    public commonService: CommonService,
    private toasterService: ToastrService,
  ) {
    this.taskForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.getLeadCategories();
    this.getPriorities();
    this.getCustomers();
    this.getUsers();
  }

  buildForm(): void {
    this.taskForm = new FormGroup({
      taskName: new FormControl(null, [Validators.required]),
      taskDescription: new FormControl(null),
      taskDate: new FormControl(null, [Validators.required]),
      leadCategoryId: new FormControl(null, [Validators.required]),
      leadId: new FormControl(null, [Validators.required]),
      priorityId: new FormControl(null, [Validators.required]),
      assignedToIDs: new FormControl([], [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskResponse'] && this.taskResponse) {
      this.taskResponse.assignedToIDs =
        this.taskResponse.assignedTos.split(',');
      this.taskForm.patchValue(this.taskResponse);
      this.taskId = this.taskResponse.taskId;
    } else {
      this.taskForm.reset();
      this.taskId = '';
    }
  }
  onSubmitTask(form: FormGroup): void {
    if (form.valid) {
      const dataToSubmit = {
        ...form.value,
        assignedToIDs: form.value.assignedToIDs.join(','),
      };
      !this.taskId ? this.addTask(dataToSubmit) : this.updateTask(dataToSubmit);
    }
  }
  onClose(){
    this.taskForm.reset();
    this.buildForm();
  }
  addTask(form: any): void {
    this.commonService.updateLoader(true);
    this.taskService.addTask(form).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.taskForm.reset();
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

  updateTask(form: any): void {
    this.commonService.updateLoader(true);
    this.taskService.updateTask(this.taskId, form).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.taskForm.reset();
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

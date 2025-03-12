import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { CommonService } from '../../../shared/services/common.service';
import { TaskResponse } from '../../../shared/models/task.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { ExportService } from '../../../shared/services/export.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  public tasks: TaskResponse[] = [];
  selectedTask: TaskResponse | null = null;
  taskId: string | null = '';
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object
  cardList:string = 'Tasks'
  @Output() edit = new EventEmitter<TaskResponse>();
  dateRange = [new Date(), new Date()];
  ranges: IRange[] = [
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
      label: 'Last 7 Days',
    },
    {
      value: [new Date(), new Date()],
      label: 'Today',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      label: 'Yesterday',
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
      label: 'Last 30 Days',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      label: 'This Month',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
      label: 'Last Month',
    },
  ];
  constructor(
    private taskService: TaskService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    private identityService:IdentityService
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      UserID:this.identityService.getLoggedUserId(),
    };
    this.taskService.getTaskList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.tasks = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  clearDate(){
    this.filters['TaskDate']='';
    this.getTasks();
  }

  deleteTask(taskId: string) {
    this.commonService.updateLoader(true);
    this.taskService.deleteTask(taskId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
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

  openModal() {
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedTask = null;
      this.taskId = '';
      this.edit.emit();
      modal.show();
    }
  }
  viewModal(event: Event, taskId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getTask(taskId);
    }
  }
  getTask(taskId: string) {
    this.commonService.updateLoader(true);
    this.taskService.getTaskDetails(taskId,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedTask = response.data;
          this.edit.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  closeEditModal() {
    const modalElement: any = document.getElementById('showModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
      this.getTasks();
    }
  }
  editModal(event: Event, taskId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.taskId = taskId;
      this.getTask(taskId);
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getTasks(this.page);
  }
  exportTasks(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.taskService.exportTask(this.filters).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToExcel(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  exportCSVTasks(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.taskService.exportTask(this.filters).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToCSV(response.data);
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

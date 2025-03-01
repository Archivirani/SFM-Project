import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task/task-list.component';
import { TaskRoutes } from './tasks.routes';
import { LayoutModule } from '../layouts/layout.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [TaskListComponent, AddTaskComponent, TaskDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TaskRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgbPaginationModule,
    LayoutModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaskModule {}

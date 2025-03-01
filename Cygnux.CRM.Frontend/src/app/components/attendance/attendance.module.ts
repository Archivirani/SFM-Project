import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AttendanceRoutes } from './attendance.routes';
import { AttendanceDetailComponent } from './attendance-detail/attendance-detail.component';
import { LayoutModule } from '../layouts/layout.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AttendanceDetailComponent],
  imports: [
    CommonModule,
    LayoutModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    NgSelectModule,
    RouterModule.forChild(AttendanceRoutes),
  ]
})
export class AttendanceModule { }

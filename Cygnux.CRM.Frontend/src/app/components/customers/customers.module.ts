import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbDatepickerModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomerListComponent } from './customer/customer-list.component';
import { CustomerRoutes } from './customers.routes';
import { CallModule } from '../calls/calls.module';
import { MeetingModule } from '../meetings/meetings.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutModule } from '../layouts/layout.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [CustomerListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CustomerRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    CallModule,
    MeetingModule,
    NgSelectModule,
    LayoutModule,
    BsDatepickerModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule {}

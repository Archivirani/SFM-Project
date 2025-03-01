import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CallModule } from '../calls/calls.module';
import { AddComplaintComponent } from './add-complaint/add-complaint.component';
import { ComplaintListComponent } from './complaint/complaint-list.component';
import { ComplaintRoutes } from './complaints.routes';
import { ComplaintDetailComponent } from './complaint-detail/complaint-detail.component';
import { LayoutModule } from '../layouts/layout.module';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    ComplaintListComponent,
    AddComplaintComponent,
    ComplaintDetailComponent,
    AddTicketComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild(ComplaintRoutes),
    NgSelectModule,
    NgbPaginationModule,
    LayoutModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComplaintModule {}

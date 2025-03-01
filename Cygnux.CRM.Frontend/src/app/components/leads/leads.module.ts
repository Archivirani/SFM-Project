import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadListComponent } from './lead/lead-list.component';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { LeadRoutes } from './leads.routes';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MeetingModule } from '../meetings/meetings.module';
import { AddMeetingComponent } from '../meetings/add-meeting/add-meeting.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { LayoutModule } from '../layouts/layout.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddCallComponent } from '../calls/add-call/add-call.component';
import { CallModule } from '../calls/calls.module';

@NgModule({
    declarations: [LeadListComponent, AddLeadComponent, LeadDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild(LeadRoutes),
    MeetingModule,
    CallModule,
    NgSelectModule,
    NgbPaginationModule,
    LayoutModule,
     BsDatepickerModule.forRoot(),
  ],
  exports: [
    AddLeadComponent,
    LeadDetailComponent,
    AddMeetingComponent,
    OnlyNumberDirective,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeadModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeetingListComponent } from './meeting/meeting-list.component';
import { MeetingRoutes } from './meetings.routes';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { CallModule } from '../calls/calls.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExpenseModule } from '../expenses/expenses.module';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';
import { LocationSearchComponent } from '../shared/location-search/location-search.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { LayoutModule } from '../layouts/layout.module';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    MeetingListComponent,
    AddMeetingComponent,
    LocationSearchComponent,
    MeetingDetailComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild(MeetingRoutes),
    CallModule,
    NgSelectModule,
    NgbPaginationModule,
    ExpenseModule,
    GoogleMapsModule,
    LayoutModule,
    PopoverModule
  ],
  exports: [AddMeetingComponent, OnlyNumberDirective],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingModule {}

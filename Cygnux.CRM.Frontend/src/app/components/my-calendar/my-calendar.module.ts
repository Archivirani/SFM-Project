import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { MyCalendarRoutes } from './my-calendar.routes';
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendar
import { MyCalendarComponent } from './my-calendar.component';
import { MeetingModule } from '../meetings/meetings.module';
import { AddMeetingComponent } from '../meetings/add-meeting/add-meeting.component';
import { CallModule } from '../calls/calls.module';
import { AddCallComponent } from '../calls/add-call/add-call.component';

@NgModule({
  declarations: [MyCalendarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    MeetingModule,
    CallModule,
    RouterModule.forChild(MyCalendarRoutes),
  ],
  exports: [AddMeetingComponent, AddCallComponent],
  providers: [DatePipe],
})
export class MyCalendarModule {}

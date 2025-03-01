import { Routes } from '@angular/router';
import { MeetingListComponent } from './meeting/meeting-list.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';

export const MeetingRoutes: Routes = [
  {
    path: 'list',
    component: MeetingListComponent,
  },
  {
    path: 'detail/:id',
    component: MeetingDetailComponent,
  },
];

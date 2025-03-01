import { Routes } from '@angular/router';
import { CallListComponent } from './call/call-list.component';
import { CallDetailComponent } from './call-detail/call-detail.component';

export const CallRoutes: Routes = [
  {
    path: 'lists',
    component: CallListComponent,
  },
  {
    path: 'details/:id',
    component: CallDetailComponent,
  },
];

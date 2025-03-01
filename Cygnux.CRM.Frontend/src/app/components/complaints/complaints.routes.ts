import { Routes } from '@angular/router';
import { ComplaintListComponent } from './complaint/complaint-list.component';
import { ComplaintDetailComponent } from './complaint-detail/complaint-detail.component';

export const ComplaintRoutes: Routes = [
  {
    path: 'list',
    component: ComplaintListComponent,
  },
  {
    path: 'detail/:id',
    component: ComplaintDetailComponent,
  },
];

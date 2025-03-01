import { Routes } from '@angular/router';
import { LeadListComponent } from './lead/lead-list.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';

export const LeadRoutes: Routes = [
  {
    path: '',
    component: LeadListComponent,
  },
  {
    path: 'lead-detail/:id',
    component: LeadDetailComponent,
  },
];

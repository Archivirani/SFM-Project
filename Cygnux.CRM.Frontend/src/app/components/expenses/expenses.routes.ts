import { Routes } from '@angular/router';
import { ExpenseListComponent } from './expense/expense-list.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { ExpenseApprovalListComponent } from './expense-approval/expense-approval-list.component';
import { ExpenseGeneralMasterListComponent } from './expense-general-master-list/expense-general-master-list.component';

export const ExpenseRoutes: Routes = [
  {
    path: 'lists',
    component: ExpenseListComponent,
  },
  {
    path: 'approval',
    component: ExpenseApprovalListComponent,
  },
  {
    path: 'general-master',
    component: ExpenseGeneralMasterListComponent,
  },
];

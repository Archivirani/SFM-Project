import { Routes } from '@angular/router';
import { FullComponent } from './components/layouts/full/full.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/Identity/login.module').then((m) => m.LoginModule),
    canActivate: [LoginGuard],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/customer',
        pathMatch: 'full',
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./components/customers/customers.module').then(
            (m) => m.CustomerModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'call',
        loadChildren: () =>
          import('./components/calls/calls.module').then((m) => m.CallModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'lead',
        loadChildren: () =>
          import('./components/leads/leads.module').then((m) => m.LeadModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'meeting',
        loadChildren: () =>
          import('./components/meetings/meetings.module').then(
            (m) => m.MeetingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'task',
        loadChildren: () =>
          import('./components/tasks/tasks.module').then((m) => m.TaskModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'expense',
        loadChildren: () =>
          import('./components/expenses/expenses.module').then(
            (m) => m.ExpenseModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'complaint',
        loadChildren: () =>
          import('./components/complaints/complaints.module').then(
            (m) => m.ComplaintModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-calendar',
        loadChildren: () =>
          import('./components/my-calendar/my-calendar.module').then(
            (m) => m.MyCalendarModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'attendance',
        loadChildren: () =>
          import('./components/attendance/attendance.module').then(
            (m) => m.AttendanceModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

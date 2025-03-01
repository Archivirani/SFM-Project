import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginGuard } from '../../shared/guards/login.guard';

export const LoginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    //canActivate: [LoginGuard]
  },
];

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseListComponent } from './expense/expense-list.component';
import { ExpenseRoutes } from './expenses.routes';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';
import { AmountDirective } from '../../shared/directives/amount.directive';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { ExpenseApprovalListComponent } from './expense-approval/expense-approval-list.component';
import { LayoutModule } from '../layouts/layout.module';
import { ExpenseGeneralMasterListComponent } from './expense-general-master-list/expense-general-master-list.component';
import { ExpenseGeneralDetailComponent } from './expense-general-detail/expense-general-detail.component';
import { AddExpenseGeneralMasterComponent } from './add-expense-general-master/add-expense-general-master.component';
import { ApproveExpenseComponent } from './approve-expense/approve-expense.component';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    ExpenseListComponent,
    ExpenseApprovalListComponent,
    AddExpenseComponent,
    OnlyNumberDirective,
    AmountDirective,
    ExpenseDetailComponent,
    ExpenseGeneralMasterListComponent,
    ExpenseGeneralDetailComponent,
    AddExpenseGeneralMasterComponent,
    ApproveExpenseComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild(ExpenseRoutes),
    NgSelectModule,
    NgbPaginationModule,
    LayoutModule,
    PopoverModule
  ],
  exports: [AddExpenseComponent, OnlyNumberDirective],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExpenseModule {}

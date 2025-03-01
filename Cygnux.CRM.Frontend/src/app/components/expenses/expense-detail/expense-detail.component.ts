import { Component, Input } from '@angular/core';
import { ExpenseDetailResponse } from '../../../shared/models/expense.model';

@Component({
  selector: 'app-expense-detail',
  standalone: false,
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss'],
})
export class ExpenseDetailComponent {
  @Input() expenseResponse: ExpenseDetailResponse | null = null;
}

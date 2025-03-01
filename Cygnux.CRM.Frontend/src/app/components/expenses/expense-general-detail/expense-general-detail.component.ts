import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expense-general-detail',
  standalone: false,
  templateUrl: './expense-general-detail.component.html',
  styleUrl: './expense-general-detail.component.scss'
})
export class ExpenseGeneralDetailComponent {
  @Input() expenseResponse: any | null = null;
}

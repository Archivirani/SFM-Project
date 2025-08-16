import { Component, Input, TemplateRef } from '@angular/core';
import { ExpenseDetailResponse } from '../../../shared/models/expense.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-expense-detail',
  standalone: false,
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss'],
  providers: [BsModalService]
})
export class ExpenseDetailComponent {
  public modalRef!: BsModalRef;
  @Input() expenseResponse: ExpenseDetailResponse | null = null;
  constructor(
    private modalService: BsModalService,
  ) {}
  openPOD(templatePod: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templatePod, {
      class: 'modal-lg modal-dialog-centered',
      backdrop: true
    });
  }
}

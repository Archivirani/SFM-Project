import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="close(false)"
      ></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="close(false)">
        No
      </button>
      <button type="button" class="btn btn-success" (click)="close(true)">
        Yes
      </button>
    </div>
  `,
})
export class ConfirmationModalComponent {
  @Input() message!: string;

  constructor(public activeModal: NgbActiveModal) {}

  close(result: boolean) {
    if (result) {
      this.activeModal.close(result); // Resolves with true
    } else {
      this.activeModal.dismiss(result); // Rejects with false
    }
  }
}

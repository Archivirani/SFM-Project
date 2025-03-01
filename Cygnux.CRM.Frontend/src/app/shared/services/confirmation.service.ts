import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/shared/confirm-modal/confirmation-modal.component';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  constructor(private modalService: NgbModal) {}

  confirm(message: string): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = message;

    return modalRef.result.catch(() => false); // Handle dismiss case
  }
}

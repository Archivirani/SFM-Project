import { Component, Input } from '@angular/core';
import { ComplaintDetailResponse } from '../../../shared/models/complaint.model';

@Component({
  selector: 'app-complaint-detail',
  standalone: false,
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss'],
})
export class ComplaintDetailComponent {
  @Input() complaintResponse: ComplaintDetailResponse | null = null;
}

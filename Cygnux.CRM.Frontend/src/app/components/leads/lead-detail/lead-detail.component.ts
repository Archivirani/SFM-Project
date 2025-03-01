import { Component, Input } from '@angular/core';
import {
  LeadDetailResponse,
} from '../../../shared/models/lead.model';

@Component({
  selector: 'app-lead-detail',
  standalone: false,
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss'],
})
export class LeadDetailComponent {
  public Id: string = '';
  @Input() leadResponse: LeadDetailResponse | null = null;
  constructor() {}
}

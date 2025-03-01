import { Component, Input, OnInit } from '@angular/core';
import {
  CallDetailResponse,
} from '../../../shared/models/call.model';

@Component({
  selector: 'app-call-detail',
  standalone: false,
  templateUrl: './call-detail.component.html',
  styleUrls: ['./call-detail.component.scss'],
})
export class CallDetailComponent {
  @Input() callResponse: CallDetailResponse | null = null;
}

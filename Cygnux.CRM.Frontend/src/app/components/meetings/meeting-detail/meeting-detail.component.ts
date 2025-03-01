import { Component, Input } from '@angular/core';

import { MeetingDetailResponse } from '../../../shared/models/meeting.model';

@Component({
  selector: 'app-meeting-detail',
  standalone: false,
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.scss'],
})
export class MeetingDetailComponent {
  @Input() meetingResponse: MeetingDetailResponse | null = null;
}

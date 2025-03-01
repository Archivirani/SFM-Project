import { Component, Input } from '@angular/core';

import { TaskResponse } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent {
  @Input() taskResponse: TaskResponse | null = null;
}

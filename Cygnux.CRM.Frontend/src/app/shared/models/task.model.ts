export interface TaskResponse {
  taskId: string;
  taskName: string;
  leadCategoryName: string;
  taskDate: string;
  assignedToIDs: string[];
  assignedTos: string;
  customerName: string;
  startTime: string;
  endTime: string;
  taskStatus: string;
}

export interface PriorityResponse {
  priorityId: number;
  priorityName: string;
}
export interface AddTaskRequest {
  taskName: string;
  taskDate: Date;
  leadCategoryId: number;
  customerId: number;
  priorityId: number;
  assignedToIDs: number;
  taskDescription: string;
}

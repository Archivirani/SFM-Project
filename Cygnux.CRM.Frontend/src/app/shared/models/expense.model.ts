export interface ExpenseResponse {
  expenseId: string;
  expenseCode: string;
  expenseDate: string;
  amount: number;
  status: string;
  createdBy: string;
  checkIn:string;
  checkOut:string;
  distanceTravelled:string;
  requestDate:string;
  companyName:string;
  expenseRate:number;
  expenseCreated:boolean;
}

export interface ExpenseDetailResponse extends ExpenseResponse {
  punchedInLocation: string;
  checkedInLocation: string;
  distanceInKm: number;
  meetingLat:string;
  meetingId:string;
  supportingDocument: string;
  remarks: string;
  customerName: string;
  transportMode: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  expenseCreated:boolean;
  transportModeId:string;
  requestID:number;
  auditRemarks:string;
  expenseRate:number;
  auditedBy:string;
  auditDate:string;
  approvedDate:string;
  approvedBy:string;
  expenseAddedDate:string;
  expenseModifiedDate:string;
  expenseModifiedBy:string;
}

export interface AddExpenseRequest {
  meetingId: string;
  transportModeId: number;
  expenseDate: Date;
  punchInLocation: string;
  checkedInLocation: string;
  distanceInKm: number;
  supportingDocument:string;
  createdBy:string;
  UserId:string;
  modifiedBy:string;
  amount: number;
  file:string;
  remarks: string;
}

export interface AddExpenseApprovalRequest {
  expenseId: string;
  approvalStatus: number;
}

export interface ApprovalRequest {
    expenseId: string;
    approved: boolean;
    approvedBy: string;
    auditApproved: boolean;
    auditBy: string;
}
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
  contactName:string;
  adminApproved:boolean;
  managerApproved:boolean;
  isEdit:string;
  isManagerApproved:boolean;
  isAuditApproved:boolean;
  isManager_AuditApproved:boolean;
  reqId:string;
  meetingDate:string;
  meetingId:string;
  attendeeName:string;
  attendeeIDs:string;
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
  requestID:string;
  auditRemarks:string;
  expenseRate:number;
  auditedBy:string;
  auditDate:string;
  approvedDate:string;
  approvedBy:string;
  expenseAddedDate:string;
  expenseAddedTime:string;
  expenseModifiedDate:string;
  expenseModifiedBy:string;
  auditRemark:string;
  expenseAddedBy:string;
  managerRemark:string;
  approveByManagerName:string;
  approvedManagerDate:string;
  approvedByAuditorName:string;
  approvedByAuditDate:string;
  expensEditDate:string;
  expenseEditedBy:string;
  attendeeCode:any;
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
    meetingId: string;
    isApproved: boolean;
    approvedBy: string;
    reasonRemark: string;
}
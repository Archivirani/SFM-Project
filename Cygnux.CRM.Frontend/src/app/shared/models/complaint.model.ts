export interface ComplaintResponse {
closeDate: any;
  complaintId: string;
  docketNo: string;
  customerName: string;
  complaintCode: string;
  compalaintDate: string;
  defaulterBranch:string;
  compaintStatus:string;
  complaintStatus: string;
  resolutionDate?: string;
  slaInHr?: string;
  raisedBy: string;
  assignedTo: string;
  escStatus:string;
  slAinHrs:string;
  complaintID:string;
  userID:string;
  documentNo:string;
  source:string;
  ticketSource:string;
  ticketType:string;
  ticketSubType:string;
  ticketPriority:string;
  priority:string;
  description:string;
  type:string;
  customerEmail:string;
  subType:string;
  updateDate:string;
  updateRemark:string;
  assignedToId:string;
  remarks:string;
  customerID:string;
  UserID:string;
  IsActive:string;
  ticketAddressTo:string;
  isUpdated:boolean;
  assignToId:string;
}

export interface ComplaintDetailResponse extends ComplaintResponse {
  origin: string;
  destination: string;
  docketStatus: string;
  billingPartyName:string;
  defaulterBranch: string;
  ticketAddressTo:string;
  complaintTypeName: string;
  complaintType:string;
  complaintSubType:string;
  complaintSubTypeName: string;
  complaintPriorityId:string;
  complaintPriority: string;
  ticketSource:string;
  ticketType:string;
  ticketSubType:string;
  ticketPriority:string;
  escalationId:string;
  escalationTo:string;
  complaintDescription: string;
  escalationHistory:string;
  updateRemark:string;
  updateHistory:string;
  closeBy:string;
  createdBy: string;
  createdDate: Date;
  modifiedBy: string;
  modifiedDate: Date;
  remarks: string;
  supportingDocument: string;
  complaintID:string;
  edd:string;
  documentDate:string;
}

export interface AddComplaintRequest {
  docketNo: string;
  billingPartyName: string;
  origin: string;
  destination: string;
  docketStatus: string;
  defaulterBranch: string;
  complaintDate: Date;
  complaintType: string;
  complaintSubType: string;
  complaintPriorityId: number;
  complaintDescription: string;
  supportingDocument: string;
  complaintRaisedBy: string;
  complaintRaisedDateTime: Date;
  assignTo: string;
}

export interface ComplaintGetUser {
  userId: string;
  userName: string;
  managerId: string;
  managerName: string;
  complaintManagerID:string;
  complaintManagerName:string;
}

export interface DocDataDetail {
    documentNo: string;
    customerID: string;
    customerName: string;
    customerEmail: string;
    edd: string;
    documentDate: string;
    origin: string;
    destination: string;
    currentStatus:string;
    currentLocation:string;
}
export interface ComplaintCountDayWise {
  id: string,
  complaintDay: string,
  pendingCount: number,
  completedCount: number,
  active: boolean
}

export interface AssignToList {
  userId: string;
  userName: string;
}

export interface UpdateHistory {
  complaintID: string;
  documentNo: string;
  complaintDate: string;
  ticketSource: string;
  ticketType: string;
  ticketSubType: string;
  ticketPriority: string;
  ticketDescription: string;
  customerName: string;
  ticketCreateBy: string;
  updateBy: string;
  updateRemark: string;
  assignedTo: string;
  complaintStatus: string;
  ticketAddressTo: string;
  updateDate: string;
  remark: string;
}

export interface EscalatedHistory {
  complaintID: string;
  escalatedTo: string;
  escalatedEmail: string;
  escalatedDate: string;
  remark: string;
  createBy: string;
  createDate: string;
  escalatedId:string;
}
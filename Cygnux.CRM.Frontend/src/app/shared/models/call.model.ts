export interface CallResponse {
  callCategoryId?: number;
  callCategoryName?: string;
  callDate?: string;
  attendeeIDs?: string[];
  attendees?: string;
  customerName?: string;
  startTime?: Date;
  endTime?: Date;
  callStatus?: string;
  leadId?:string;
  customerCode?:string;
  companyName?:string;
  callId?: any;
}

export interface CallDetailResponse extends CallResponse {
  callPurpose: string;
  attendeeNames: string;
  callMOM: string;
  createdBy: string;
  modifiedBy: string;
  createdDate: Date;
  modifiedDate: Date;
  purpose: string;
  remarks: string;
}

export interface AddCallRequest {
  callPurpose: string;
  callDateTime: Date;
  callCategoryId: number;
  customerId: number;
  attendeeIDs: number[];
  remarks: string;
  callMoM: string;
}

export interface CallCategoryResponse {
  callCategoryId: number;
  callCategoryName: string;
}

export interface CallFilter {
  callStatus: string;
  callCategoryName: string;
  totalCount: string;
}
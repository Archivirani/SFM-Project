export interface MeetingResponse {
  meetingId?: any;
  leadId?: string;
  customerName?: string;
  meetingDate?: string;
  startTime?: Date;
  endTime?: Date;
  checkIn?: string;
  checkOut?: any ;
  isCheckInEnabled?: boolean,
  isCheckOutEnabled?: boolean,
  checkInReason?: String,
  checkOutReason?: String,
  meetingTimeInMins?: string;
  taTinHrs?: string;
  attendeeIDs?: string[];
  attendees?: any;
  meetingStatus?: string;
  meetingMOM?: string[];
  isCheckedIn?: boolean;
  meetingLocation?: string;
  geoLocation?: string;
  latitude?: any;
  longitude?: any;
  companyName?:string;
  customerCode:string;
  createdBy?:string;
  attendeeCode?:any;
  meetingRole?:any;
  meetingTypeId?:any;
}
export interface MeetingDetailResponse extends MeetingResponse {
  leadDate: Date;
  leadSource: string;
  contactName: string;
  contactNo: string;
  email: string;
  isAllDayEvent: boolean;
  meetingType: string;
  modifiedBy: string;
  checkInLocation: string;
  checkOutLocation: string;
  meetingLocation: string;
  checkInDate: Date;
  checkOutDate: Date;
  attendeeNames: string;
  createdDate?:Date;
  modifiedDate?:Date;
  checkInOutLocation:string;
  checkOutDateTime:string;
  checkInDateTime:string;
}
export interface AddMeetingResponse {
  leadId: string;
  customerName: string;
  contactName: string;
  address: string;
  contactNo: string;
  email: string;
  leadDate:string;
}
export interface MeetingTypeResponse {
  meetingTypeId: number;
  meetingTypeName: string;
}
export interface LocationResponse {
  locCode: string;
  locName: string;
}
export interface UserResponse {
  userId: number;
  name: string;
}
export interface AddMeetingRequest {
  customerId: number;
  contactId: number;
  address: string;
  contactNo: string;
  meetingPurpose: string;
  email: string;
  meetingDateTime: Date;
  meetingTypeId: number;
  meetingLocation: string;
  isAllDayEvent: boolean;
  attendeeIDs: number[];
  meetingMOM: string;
}

export interface AddMeetingCheckInRequest {
  meetingId: string;
  isCheckedIn: boolean;
}

export interface MeetingMoMResponse{
   id: number,
   moM: string
}

export interface MeetingCountDayWise {
  id: string;
  meetingDay: string;
  pendingCount: number;
  completedCount: number;
  seq: number;
}

export interface MeetingCheckInRequest{
    meetingID:string,
    userID: string,
    isAttendee: boolean,
    date: string,
    checkIn: string,
    checkOut: string,
    lat: number,
    lng: number
}

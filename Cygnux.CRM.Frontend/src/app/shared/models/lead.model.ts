export interface LeadResponse {
  leadId: string;
  leadCategory: string;
  companyName: string;
  contactName: string;  
  contactNo: string;
  email: string;
  address: string;
  leadDate: string;
  assignedTo: string;
  designationId: string;
  leadSourceId: string;
  leadSource: string;
  industryTypeId: string;
  ServiceInterestedIDs: string[];
  serviceInteresteds: string;
  isActive: boolean;
  leadCategoryId?:number;
  cityId?:number;
  branchId?:string;
  regionId?:string;
  assignedToId?:string;
}

export interface LeadByStatusResponse{
  id: string,
  totalLeadCount: number,
  leads: number,
  prospects: number,
  suspects: number,
  negotiation: number,
  finalState: number,
  closed: number
}

export interface LeadBySourceResponse{
  id: string,
  totalLeads: number,
  phoneLeads: number,
  emailLeads: number,
  whatsappLeads: number,
  webBotLeads: number
}

export interface LeadCategoryResponse{
  id: string,
  categoryName: number,
  leadCount:number
}

export interface LeadDetailResponse extends LeadResponse {
  cityId?: number;
  city?: string;
  industryType?: string;
  createdBy?: string;
  modifiedBy?: string;
  designation?: string;
  branchId?: string;
  branch?: string;
  regionId?: string;
  region?: string;
  serviceInterestedNames?: string;
  assignedToId?: string;
  callStatusId:string;
}

export interface LeadCategoryResponse {
  leadCategoryId: number;
  leadCategoryName: string;
}

export interface CityResponse {
  location: string;
  city_code: number;
}

export interface LeadSourceResponse {
  leadSourceId: number;
  leadSourceName: string;
}
export interface LeadContactResponse {
  contactId: number;
  contactName: string;
}
export interface DesignationResponse {
  designationId: number;
  designationName: string;
}

export interface IndustryTypeResponse {
  industryTypeId: number;
  industryTypeName: string;
}

export interface ServiceInterestedResponse {
  serviceInterestedId: number;
  serviceInterestedName: string;
}

export interface BranchResponse {
  branchId: number;
  branchName: string;
}

export interface AddLeadRequest {
  leadCategoryId: number;
  leadDate: string;
  companyName: string;
  contactName: string;
  contactNo: string;
  address: string;
  email: string;
  cityId: number;
  branchId: number;
  regionId: number;
  designationId: number;
  leadSourceId: number;
  assignedToId: number;
  industryTypeId: number;
  serviceInterestedIDs: number[];
  isActive: boolean;
}

export interface LeadByStatusResponse{
  id: string,
  totalLeadCount: number,
  leads: number,
  prospects: number,
  suspects: number,
  negotiation: number,
  finalState: number,
  closed: number
}
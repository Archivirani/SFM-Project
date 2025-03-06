export interface CustomerResponse {
  customerCode: string;
  customerName: string;
  contractId: string;
  startDate: Date;
  endDate: Date;
  salesMonth: number;
  salesYear: number;
  oSonDate: number;
  leadId: string;
}
export interface LeadCustomerResponse {
  leadId: string;
  customerName: string;
}

export interface CustomersListResponse {
  customerCode: string;
  customerName: string;
}

export interface CustResponse {
  custcd: string;
  custnm: string;
}

export interface AddCustomerRequest {
  customerCode: string;
  purchaseHead: string;
  purchaseHead_MobileNo: string;
  accountsHead: string;
  accountsHead_MobileNo: string;
  proprietorName: string;
  proprietor_MobileNo: string;
  proprietor_Email: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  channel: string;
  region: string;
  brand: string;
  subBrand: string;
  isAllowedForEwayBillGenration: boolean;
  isConsolidatedGSTNo: boolean;
  consolidatedGSTNo: string;
  businessClassification: string;
}

export interface CustomerFilter {
  id: string;               
  customerCount: number;    
  totalSales: number;       
  overdueOS: number;        
  totalOS: number;          
  nbd: number;              
  lostCustomerCount: number;
  avgGP: number;
  yield:number;           
}

export interface GetFilter {
  count:number | string;
  name:string; 
  color:string;  
  id?:number;       
}
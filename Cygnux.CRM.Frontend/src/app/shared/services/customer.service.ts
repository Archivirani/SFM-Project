import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/common.model';
import {
  AddCustomerRequest,
  CustomerDetailResponse,
  CustomerFilter,
  CustomerResponse,
  CustomersListResponse,
  LeadCustomerResponse,
} from '../models/customer.model';
import { ApiHandlerService } from './api-handler.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonService } from './common.service';
import { IdentityService } from './identity.service';
import { ToastrService } from 'ngx-toastr';
import { ExternalService } from './external.service';
import { UserResponse } from '../models/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public customersList: CustomersListResponse[] = [];
  public users: UserResponse[] = [];

  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService,
    private commonService:CommonService,
    private identityService:IdentityService,
    private toasterService:ToastrService,
    private externalService:ExternalService
  ) {}
  
  getCustomerList(
    filters: any
  ): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get('customer', filters);
  }
  exportCustomer(filters: any): Observable<IApiBaseResponse<any[]>> {
    return this.apiHandlerService.Get('customer/export', filters);
  }
  getLeadCustomerList(): Observable<IApiBaseResponse<LeadCustomerResponse[]>> {
    return this.apiHandlerService.Get('customer/lead');
  }

  getCustomerDetails(
    id: string
  ): Observable<IApiBaseResponse<CustomerResponse>> {
    return this.apiHandlerService.Get('customer/' + id);
  }

  addCustomer(
    addcustomerRequest: AddCustomerRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customer', addcustomerRequest);
  }

  updateCustomer(
    id: string,
    addcustomerRequest: AddCustomerRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Put('customer/' + id, addcustomerRequest);
  }

  deleteCustomer(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('customer/' + id, null);
  }

  getLeadCustomerfilters(filters:any): Observable<IApiBaseResponse<CustomerFilter>> {
    return this.apiHandlerService.Get('Dashboard/',filters);
  }

  getCustomerdropdown(filters:any): Observable<IApiBaseResponse<CustomersListResponse>> {
    return this.apiHandlerService.Get(`Customer/dropdown?searchtext=${filters}`);
  }

   customerDropdown(event:any){
      const searchTerm = event?.target ? event?.target.value:event;
      if (searchTerm.length >= 3) {
        this.getCustomerdropdown(searchTerm).pipe(debounceTime(300), distinctUntilChanged()).subscribe((data: any) => {
          this.customersList = data.data;
        });
      }
    }

      getUsers() {
        this.externalService.getUserData(this.identityService.getLoggedUserId()).subscribe({
          next: (response) => {
            if (response) {
              this.users= response.data.map((user: any) => ({
                userId: user.userId,
                name: `${user.userId } : ${user.name}`,
              }));
            }
          },
          error: (response: any) => {
            this.toasterService.error(response);
          },
        });
      }

  getCustomerDetail(customerCode:string | undefined): Observable<IApiBaseResponse<CustomerDetailResponse[]>>{
        return this.apiHandlerService.Get(`Customer/CustomerDetail?customerCode=${customerCode}`);
  }
}

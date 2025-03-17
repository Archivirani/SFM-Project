import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CustomerFilter, CustomerResponse, GetFilter } from '../../../shared/models/customer.model';
import { CommonService } from '../../../shared/services/common.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { ExportService } from '../../../shared/services/export.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { MeetingService } from '../../../shared/services/meeting.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})

export class CustomerListComponent implements OnInit {
  public customers: CustomerResponse[] = [];
  public startDate!: string ;
  public endDate!: string;
  getCustomerfilter!:CustomerFilter;
  selectedCustomer: CustomerResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  filters: { [key: string]: string } = {}; // Dynamic filter object
  @Output() edit = new EventEmitter<CustomerResponse>();
  dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  getfilter:GetFilter[]=[];
  selectedCustomerName:any;
  checkOutValue:string=''
   ranges: IRange[] = [
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
      label: 'Last 7 Days',
    },
    {
      value: [new Date(), new Date()],
      label: 'Today',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      label: 'Yesterday',
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
      label: 'Last 30 Days',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      label: 'This Month',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
      label: 'Last Month',
    },
    {
      value: [
        new Date(new Date().getFullYear(), 0, 1), // First day of the year
        new Date(new Date().getFullYear(), 11, 31), // Last day of the year
      ],
      label: 'This Year',
    },
  ];
  
  constructor(
    private customerService: CustomerService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private exportService: ExportService,
    private identityService: IdentityService,
    private meetingService: MeetingService,
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.dateRange = [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
    ];

    this.startDate = this.dateRange?.[0]?.toLocaleDateString("en-GB")
    this.endDate =  this.dateRange?.[1]?.toLocaleDateString("en-GB")
    this.getCustomerfilters(this.dateRange);
  }
  

  getCustomerfilters(event:any){
    this.startDate= event?.[0] ? event[0].toLocaleDateString("en-GB") : this.dateRange?.[0]?.toLocaleDateString("en-GB") || null,
    this.endDate = event?.[1]  ? event[1].toLocaleDateString("en-GB") : this.dateRange?.[1]?.toLocaleDateString("en-GB") || null
    if(event?.length){
      const filters = {
        userid:this.identityService.getLoggedUserId(),
        // startdate:this.startDate,
        // enddate:this.endDate
      }
      this.commonService.updateLoader(true);
     this.customerService.getLeadCustomerfilters(filters).subscribe({
      next:(response) =>{
        this.getCustomerfilter = response.data;
        this.getfilter = [
          { name: "Total Customers", count: response.data.customerCount || 0 ,color:'green' },
          { name: "Total Sales", count: response.data.totalSales || 0 ,color:'wheat' },
          { name: "Overdue O/s", count: response.data.overdueOS || 0 ,color:'pink' },
          { name: "Total O/s", count: response.data.totalOS || 0 ,color:'lightgreen' },
          { name: "NBD", count: response.data.nbd || 0 ,color:'blue' },
          { name: "Lost Customer", count: response.data.lostCustomerCount || 0 ,color:'purple ' },
          { name: "Yield", count: response.data.yield || 0 ,color:'bluecolor' },
        ];
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
     });
    }
    this.getCustomers()
  }

  onQuatation(event: Event, customer:any){
    event.preventDefault(); 
    const filters={
      customerName:customer.customerName,
      token:localStorage.getItem('token')
    }
    console.log(filters)
  }

  exportCustomers(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.customerService.exportCustomer(this.filters).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToExcel(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  exportCSVCustomers(event: any) {
    event.preventDefault();
    this.commonService.updateLoader(true);
    this.customerService.exportCustomer(this.filters).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToCSV(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  getCustomers(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    this.commonService.updateLoader(true);
    const filters: any = {
      ...this.filters,
      Page: page,
      UserID:this.identityService.getLoggedUserId(),
      PageSize: this.pageSize,
      startDate:this.startDate,
      endDate:this.endDate
    };
    this.customerService.getCustomerList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  clearDate() {
    if(this.filters['StartDate']){
      this.filters['StartDate'] = '';
    }else{
      this.filters['EndDate'] = '';
    } 
    this.getCustomers();;
  }

  callModal(event: Event, customerName:any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalCall');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedCustomerName = customerName;
      modal.show();
    }
  }
  closeCallModal() {
    const modalElement: any = document.getElementById('showModalCall');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    }
  }
  closeMeetingModal() {
    const modalElement: any = document.getElementById('showModalMeeting');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    }
  }
  meetingModal(event: Event, customer:any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('showModalMeeting');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.checkOutValue='-';
      this.meetingService.meetingResponseSubject.next(customer)
      this.selectedCustomerName = customer;
    }
  }
  deleteCustomer(customerCode: string) {
    this.commonService.updateLoader(true);
    this.customerService.deleteCustomer(customerCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.closeModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  openModal(event: Event, customerCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCustomer(customerCode);
    }
  }
  getCustomer(customerCode: string) {
    this.commonService.updateLoader(true);
    this.customerService.getCustomerDetails(customerCode).subscribe({
      next: (response) => {
        if (response) {
          this.selectedCustomer = response.data;
          this.edit.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  closeModal() {
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.hide();
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getCustomers(this.page);
  }
}

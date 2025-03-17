import { ChangeDetectorRef, Component, Input} from '@angular/core';
import { Chart} from 'chart.js/auto';
import { LeadService } from '../../../shared/services/lead.service';
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { LeadBySourceResponse, LeadByStatusResponse, LeadCategoryResponse } from '../../../shared/models/lead.model';
import { IdentityService } from '../../../shared/services/identity.service';
import { GetFilter } from '../../../shared/models/customer.model';
import { MeetingService } from '../../../shared/services/meeting.service';
import { MeetingCountDayWise, UserResponse} from '../../../shared/models/meeting.model';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { ComplaintCountDayWise } from '../../../shared/models/complaint.model';
import { ExternalService } from '../../../shared/services/external.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill} from "ng-apexcharts";
import { Subscription } from 'rxjs';
import { ExportService } from '../../../shared/services/export.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | [];  
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
interface PieChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverOffset: number;
  }[];
}
interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-user-chart',
  standalone: false,
  templateUrl: './user-chart.component.html',
  styleUrl: './user-chart.component.scss'
})
export class UserChartComponent {
  @Input() chartList: string = '';
  public chart: any;
  public charts: any;
  public RatingChart:any;
  public chartOptions:{}={};
  public ColumnOption: ChartOptions = {
    series: [],
    chart: {
      type: "bar",
      height: 250
    },
    dataLabels: { enabled: false }, 
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    responsive: [],
    xaxis: {
      categories: []
    },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };
  
  complaintColumnOption: ChartOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: [], // Initialize with an empty array
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'right',
      offsetX: 0,
      offsetY: 50,
    },
  };
  public meetingChartSubscription!: Subscription;
  public getLeadStatusfilter:GetFilter[]=[];
  public leadStatus:LeadByStatusResponse[]=[];
  public leadSource !:LeadBySourceResponse;
  public leadCatagory:LeadCategoryResponse[]=[];
  dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  startDate!: string ;
  endDate!: string;
  userType=localStorage.getItem('UserType')
  pieChartData!:PieChartData;
  public users: UserResponse[] = [];
  public userIdData:string='';
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
  ];
  constructor(
    public leadService:LeadService,
    public commonService:CommonService,
    private toasterService:ToastrService,
    private identityService:IdentityService,
    private meetingService:MeetingService,
    private complaintService:ComplaintService,
    public externalService:ExternalService,
    public identifyService :IdentityService,
    private exportService:ExportService,
    private cdr: ChangeDetectorRef
  ){
    this.setDefaultDates();
    this.userIdData = this.identifyService.getLoggedUserId();
    this.getUsers();
    this.meetingChartSubscription = this.commonService.userChart.subscribe((res)=>{
      if(this.chartList==='meeting'){
        this.getMeetingCountDayWise();
      }else if(this.chartList === 'complaint'){
        this.getTicketByDayWise();
      }else if(this.chartList === 'leads'){
        this.getLeadCatagoryChart();
        this.getLeadSourceChart();
        const selectedDates = [this.startDate, this.endDate]
        this.getCustomerfilters(selectedDates,this.userIdData);
      }
    });
  }

  setDefaultDates() {
    const today = new Date();
    this.startDate = today.toUTCString();
    this.endDate = today.toUTCString();
  }
  
  onDateRangeSelected(selectedDates: any,userIdData:string) {
    if (selectedDates && selectedDates.length === 2) {
      this.startDate = selectedDates[0].toUTCString();
      this.endDate = selectedDates[1].toUTCString();
    }
    this.userIdData = userIdData;
    this.getCustomerfilters(selectedDates,this.userIdData);
    if(this.chartList === 'leads'){
      this.getLeadCatagoryChart();
      this.getLeadSourceChart();
    }
    if(this.chartList==='meeting'){
      this.getUsers();
      this.getMeetingCountDayWise();
    }
    if(this.chartList === 'complaint'){
      this.getTicketByDayWise();
      this.getTicketBySource();
      this.getTicketStatusData();
    }
  }

  getMeetingCountDayWise(){
    var filters = {
      userid:this.identityService.getLoggedUserId(),
      startdate:this.startDate,
      enddate:this.endDate
    }
    this.meetingService.getMeetingCountDayWise(filters).subscribe({
      next:(response) =>{
      this.MeetingcolumnChart(response.data);
    }})
  }

  createcomplaintDaywiseChart(data: ComplaintCountDayWise[]) {
    const ctx = document.getElementById('MyChartComplaint') as HTMLCanvasElement;
    if (ctx) {
      const labels = data.map(item => item.complaintDay);
      const pendingCounts = data.map(item => item.pendingCount);
      const completedCounts = data.map(item => item.completedCount);
      if (this.charts) {
        this.charts.destroy();
      }
  
        this.charts = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: "Pending Meetings",
                data: pendingCounts,
                backgroundColor: '#ffb012'
              },
              {
                label: "Completed Meetings",
                data: completedCounts,
                backgroundColor: '#13b545'
              }
            ]
          },
          options: {
            aspectRatio: 2.5
          }
        });
    }
  }
  
   createDoughnutChart(status:any) {
    const ctx = document.getElementById('MyRatingChart') as HTMLCanvasElement;
    if (this.RatingChart) {
      this.RatingChart.destroy(); 
    }
    if (ctx) {
      const { poor,good} = status;
      this.pieChartData = {
        labels:  ['Poor', 'Good'],
        datasets: [
          {
            label: 'Rating',
            data: [poor,good],
            backgroundColor: ['#f380af', '#41709d'],
            hoverOffset: 4
          }
        ]
      };
      this.RatingChart = new Chart(ctx, {
        type: 'doughnut',
        data: this.pieChartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    }
  }

  initPieChart(leadSource: any) {
    if(this.chartList === 'leads'){
      if (this.chart) {
        this.chart.destroy(); 
      }
      const { phoneLeads, emailLeads, whatsappLeads, webBotLeads } = leadSource;
      this.pieChartData = {
        labels: ['Phone Leads', 'Email Leads', 'WhatsApp Leads', 'WebBot Leads'],
        datasets: [
          {
            label: 'Leads By Source',
            data: [phoneLeads, emailLeads, whatsappLeads, webBotLeads],
            backgroundColor: ['#f06548', '#455d74', '#ffcc00', '#34c38f'],
            hoverOffset: 4
          }
        ]
      };
    }else if(this.chartList === 'meeting'){
      if (this.chart) {
        this.chart.destroy(); 
      }
      const { completed, pending} = leadSource;
      this.pieChartData = {
        labels: ['Completed','Pending'],
        datasets: [
          {
            label: 'Meeting By Status',
            data: [completed, pending],
            backgroundColor: ['#8064a1', '#9bbb58'],
            hoverOffset: 4
          }
        ]
      };
    }else if(this.chartList === 'complaint'){
      if (this.chart) {
        this.chart.destroy(); 
      }
      const { phoneComplaint,emailComplaint,whatsappComplaint, webBotComplaint} = leadSource;
      this.pieChartData = {
        labels:  ['Phone', 'Email', 'WhatsApp', 'Web/Bot'],
        datasets: [
          {
            label: 'Tickets By Source',
            data: [phoneComplaint,emailComplaint,whatsappComplaint, webBotComplaint],
            backgroundColor: ['#f06548', '#455d74', '#ffcc00', '#34c38f'],
            hoverOffset: 4
          }
        ]
      };
    }
    const pieChartElement = document.getElementById('MyPieChart') as HTMLCanvasElement;
    if (pieChartElement) {
      this.chart = new Chart(pieChartElement, {
        type: 'doughnut',
        data: this.pieChartData,
          options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    }
  }

  getCustomerfilters(event:any,userid:string){
    if(event?.length && userid){
      var filters = {
        userid:userid,
        startdate:this.startDate,
        enddate: this.endDate
      }
    if(this.chartList === 'leads'){
      this.leadService.getLeadCatagoryData(filters).subscribe({
        next:(response) =>{
          this.getLeadStatusfilter = response.data
          .map((item:any) => ({
            name: item.categoryName, 
            count: item.leadCount, 
            color: this.getColorForCategory(item.categoryName),
            id: this.getIdForCategory(item.categoryName)
          }))
          .sort((a, b) => b.count - a.count);
        }
       });
      }else if(this.chartList === 'meeting'){
        this.meetingService.getMeetingStatusData(filters).subscribe({
          next:(response) =>{
            this.initPieChart(response.data);
            this.getLeadStatusfilter = [
              { name: "Total Meetings", count: response.data.totalMeetingCount || 0 ,color:'green'},
              { name: "Pending", count: response.data.pending || 0 ,color:'wheat'},
              { name: "Completed", count: response.data.completed || 0 ,color:'pink'}
            ];
          }
        });
      }
      else if(this.chartList === 'complaint'){
        this.getComplaintCount(userid)
      }
    }
  }
  getColorForCategory(category: string): string {
    const colorMapping: { [key: string]: string } = {
      "TOTAL": "green",
      "LEAD": "wheat",
      "PROSPECT": "pink",
      "SUSPECT": "lightgreen",
      "NEGOTIATION STAGE": "blue",
      "CLOSED": "bluecolor",
      "REQUEST RECEIVED":"tan",
      "CONFIRMATION AWAITED":"Lilac",
      "COMMERCIAL STAGE":"purple",
      "HOLD":"purple"
    };
    return colorMapping[category.toUpperCase()] || "gray";
  }
  
  getIdForCategory(category: string): number {
    const idMapping: { [key: string]: number } = {
      "TOTAL": 0,
      "LEAD": 1,
      "PROSPECT":2,
      "SUSPECT": 3,
      "NEGOTIATION STAGE": 5,
      "CLOSED": 7,
      "REQUEST RECEIVED":4,
      "CONFIRMATION AWAITED":6,
      "COMMERCIAL STAGE":9,
       "HOLD":8
    };
    return idMapping[category.toUpperCase()] || 99;
  }
  exportLeadCategory(data:any){
    if(this.chartList === 'leads'){
      this.commonService.updateLoader(true);
      const filters = {
        id:data,
        startdate:this.startDate,
        enddate:this.endDate
      }
      this.leadService.exportLeadCategory(filters).subscribe({
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
  }

  getLeadSourceChart(){
    const filters:any={
      userid:this.identityService.getLoggedUserId(),
      startdate:this.startDate,
      enddate:this.endDate
    }
      this.leadService.getLeadSourceData(filters).subscribe({
        next: (response) => {
          if (response) {
            this.leadSource=response.data;
            this.initPieChart(response.data);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }

  getLeadCatagoryChart(){
    const filters:any={
      userid:this.identityService.getLoggedUserId(),
      startdate:this.startDate,
      enddate:this.endDate
    }
    this.leadService.getLeadCatagoryData(filters).subscribe({
      next: (response) => {
        if (response) {
          this.leadCatagory=response.data;
          this.funnelChart(this.leadCatagory);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
    this.getLeadCatagoryChart(); 
  }, 0);
  }
  

  funnelChart(leadCategory: any[]): void {
    let dataPoints = leadCategory
    .filter(item => item.categoryName !== "Total") // Remove "Total" category
    .map(item => ({
      y: item.leadCount,
      name: item.categoryName
    }));
  dataPoints.sort((a, b) => b.y - a.y);
  this.chartOptions = { ...this.chartOptions };
    this.chartOptions = {
      ...this.chartOptions,
      animationEnabled: true,
      data: [{
        type: "funnel",
        indexLabel: "{name}: {y}",
        valueRepresents: "area",
        dataPoints: dataPoints
      }]
    }
    this.cdr.detectChanges();
    if (this.chartList === 'leads') {
          setTimeout(() => {
            this.chartOptions = { ...this.chartOptions };
            this.cdr.detectChanges();
              this.removeCanvasJSLink(); 
          }, 100);
  }
  }

  removeCanvasJSLink() {
    setTimeout(() => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        if (link.href.includes("canvasjs.com")) {
          link.remove(); 
        }
      });
    }, 1000);
  }

  getComplaintCount(userid:string){
    const filters: any = {
      userID: userid,
      startDate: new Date(this.startDate).toUTCString(),
      endDate: new Date(this.endDate).toUTCString()
    };
    this.complaintService.getCompalintCounteData(filters).subscribe({
      next: (response) => {
        if (response) {
          this.leadCatagory=response.data;
          this.getLeadStatusfilter=[
            { name: "Total <br> Complaints", count: response.data[0].totalComCount || 0 ,color:'green'},
            { name: "Open <br> Complaints", count: response.data[0].new || 0 ,color:'wheat'},
            { name: "Closed <br> Complaints", count: response.data[0].closed || 0 ,color:'pink'},
            { name: "Updated <br> Complaints", count: response.data[0].updated || 0 ,color:'lightgreen'},
            { name: "Escalated <br> Complaints", count: response.data[0].escalated || 0 ,color:'blue'}
          ];
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  getTicketBySource(){
    const filters:any={
      userid:this.userIdData,
      startdate:this.startDate,
      enddate:this.endDate
    }
      this.complaintService.getTicketSourceData(filters).subscribe({
        next: (response) => {
          if (response) {
            this.leadSource=response.data;
            this.initPieChart(response.data);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }
  getTicketStatusData(){
    const filters:any={
      userid:this.userIdData,
      startdate:this.startDate,
      enddate:this.endDate
    }
      this.complaintService.getTicketStatusData(filters).subscribe({
        next: (response) => {
          if (response) {
            this.leadSource=response.data;
            this.createDoughnutChart(response.data);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }

  getTicketByDayWise(){
    const filters:any={
      userid:this.userIdData,
      startdate:this.startDate,
      enddate:this.endDate
    }
      this.complaintService.getTicketDaywiseData(filters).subscribe({
        next: (response) => {
          if (response) {
              this.complainTicketDayWise(response.data);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response);
          this.commonService.updateLoader(false);
        },
      });
  }

  getUsers() {
    this.commonService.updateLoader(true);
    this.externalService.getUserMaster().subscribe({
      next: (response) => {
        if (response) {
          this.users = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  MeetingcolumnChart(data: MeetingCountDayWise[]) {
    this.ColumnOption = {
      series: [
      {
          name: "Pending",
          data: data.map(item => item.pendingCount) 
      },
      {
          name: "Completed",
          data: data.map(item => item.completedCount) 
      }
      ],
      chart: {
        type: "bar",
        height: 280,
        stacked: true, 
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: data.map(item => item.meetingDay) 
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1,
        colors: ['#4f81bc', '#c0504e'],
      }
    };
  }

  complainTicketDayWise(data: ComplaintCountDayWise[]) {
    const categories = data.map((item) => item.complaintDay);
    const pendingCounts = data.map((item) => item.pendingCount);
    const completedCounts = data.map((item) => item.completedCount);
    
    this.complaintColumnOption = {
      series: [
        {
          name: 'Pending Complaints',
          data: pendingCounts,
        },
        {
          name: 'Completed Complaints',
          data: completedCounts,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'right',
        offsetX: 0,
        offsetY: 50,
      },
    };
  }

  ngOnDestroy(): void {
    if (this.meetingChartSubscription) {this.meetingChartSubscription.unsubscribe()}
  }

}


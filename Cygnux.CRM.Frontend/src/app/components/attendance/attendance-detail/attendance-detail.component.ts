import { Component, OnInit} from '@angular/core';
import { AttendanceService } from '../../../shared/services/attendance.service';
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '../../../shared/services/identity.service';
import { GetFilter } from '../../../shared/models/customer.model';
import { AttendanceCardResponse } from '../../../shared/models/attendance.model';
import { UserResponse } from '../../../shared/models/meeting.model';
import { ExternalService } from '../../../shared/services/external.service';
interface IRange {
    value: Date[];
    label: string;
  }
  @Component({
  selector: 'app-attendance-detail',
  standalone: false,
  templateUrl: './attendance-detail.component.html',
  styleUrl: './attendance-detail.component.scss'
})
export class AttendanceDetailComponent{
  cardList:string = 'Attendance';
  public ispunchIn : boolean = true;
  public ispunchOut : boolean =false;
  public dateRange = [new Date(), new Date()];
  public users: UserResponse[] = [];
  public getAttendancefilter!:AttendanceCardResponse;
  public getfilter:GetFilter[]=[];
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
  public attendanceService:AttendanceService,
  public commonService:CommonService,
  public toasterService:ToastrService,
  public identifyService :IdentityService,
  public externalService:ExternalService
){ 
  this.getUsers();
  this.userIdData = this.identifyService.getLoggedUserId();
}

  ngOnInit(){
    this.getAttendenceByUserDetail();
  }

  onAttendance(detail: any) {
    this.commonService.updateLoader(true);
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "/"); // dd/mm/yyyy
    const formattedTime = today.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // HH:mm
    const formattedDateTime = `${formattedDate} ${formattedTime}`; // dd/mm/yyyy HH:mm
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let payload: any = {
                    userID: this.userIdData,
                    date: formattedDate,
                };
                if (detail === 'punchIn') {
                    this.ispunchIn = false;
                    payload.punchIn = formattedDateTime;
                    payload.punchInLat = position.coords.latitude;
                    payload.punchInLng = position.coords.longitude;
                } else {
                    this.ispunchIn = true;
                    payload.punchOut = formattedDateTime;
                    payload.punchOutLat = position.coords.latitude;
                    payload.punchOutLng = position.coords.longitude;
                }
                this.attendanceService.getAttendanceDetail(payload).subscribe({
                    next: (response) => {
                        if (response) {
                            this.toasterService.success(response.data.message);
                        }
                        this.commonService.updateLoader(false);
                    },
                    error: (response: any) => {
                        this.toasterService.error(response);
                        this.commonService.updateLoader(false);
                    },
                });
            },
            (error) => {
                this.toasterService.error("Failed to get location: " + error.message);
                this.commonService.updateLoader(false);
            }
        );
    }
}

  getCustomerfilters(event:any,userId?:string){
    if(event?.length && userId){
      const filters = {
        userID:userId,
        startdate:event[0].toISOString(),
        enddate:event[1].toISOString()
      }
     this.attendanceService.getAttendanceCardDetail(filters).subscribe({
      next:(response) =>{
        this.getAttendancefilter = response.data;
        this.getfilter = [
          { name: "Total Number of Days", count: response.data[0].attendanceStatusCount || 0 ,color:'green' },
          { name: "Total Number of Present Day", count: response.data[1].attendanceStatusCount || 0 ,color:'wheat' },
          { name: "Total Number of Absent Day", count: response.data[2].attendanceStatusCount || 0 ,color:'pink' }
        ];
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
     });
    }
  }

  getAttendenceByUserDetail(){
    this.commonService.updateLoader(true);
    this.attendanceService.getAttendenceByUser(this.identifyService.getLoggedUserId()).subscribe({
      next:(response) =>{
       if(response.data.isPunchIn===true){
        this.ispunchIn=false
       }
       if(response.data.ispunchOut===true){
        this.ispunchOut=false;
       }
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
  
}

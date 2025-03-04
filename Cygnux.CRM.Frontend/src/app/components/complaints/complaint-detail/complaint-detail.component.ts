import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ComplaintDetailResponse, EscalatedHistory, UpdateHistory } from '../../../shared/models/complaint.model';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-complaint-detail',
  standalone: false,
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss'],
})
export class ComplaintDetailComponent{
  updateHistoryList:UpdateHistory[]=[];
  escalatedHistory:EscalatedHistory[]=[];
  @Input() complaintResponse: ComplaintDetailResponse | null = null;
  constructor(private complaintService: ComplaintService){}
   ngOnChanges(changes: SimpleChanges) {
      this.updateHistory(this.complaintResponse?.complaintID)
   }
  updateHistory(complaintID:any){
    this.complaintService.getupdateHistory(complaintID).subscribe((res:any)=>{
        this.updateHistoryList = res.data;
    });
    this.complaintService.getEscalatedHistory(complaintID).subscribe((res:any)=>{
      this.escalatedHistory = res.data;
  });
  }
}

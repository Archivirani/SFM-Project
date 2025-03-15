import { Component, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { ComplaintDetailResponse, DocDataDetail, EscalatedHistory, UpdateHistory } from '../../../shared/models/complaint.model';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { Modal } from 'bootstrap';
import { CommonService } from '../../../shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-complaint-detail',
  standalone: false,
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss'],
})
export class ComplaintDetailComponent implements OnDestroy{
  updateHistoryList:UpdateHistory[]=[];
  escalatedHistory:EscalatedHistory[]=[];
  docketNoList?:DocDataDetail;
  complaintViewModalSubscription!:Subscription;
  @Input() complaintResponse: ComplaintDetailResponse | null = null;
  constructor(
    private complaintService: ComplaintService,
    public commonService: CommonService,
  ){
    if(this.complaintViewModalSubscription){this.complaintViewModalSubscription.unsubscribe()}
    this.complaintViewModalSubscription = this.commonService.complaintViewModal.subscribe((res)=>{
      if(res){
        this.updateHistory(res?.complaintID)
        this.onDocketNo(res?.documentNo)
      }
    });
  }
  ngOnDestroy(): void {
    if(this.complaintViewModalSubscription){this.complaintViewModalSubscription.unsubscribe()}
  }
  
   updateHistory(complaintID:any){
    this.complaintService.getupdateHistory(complaintID).subscribe((res:any)=>{
        this.updateHistoryList = res.data;
    });
    this.complaintService.getEscalatedHistory(complaintID).subscribe((res:any)=>{
      this.escalatedHistory = res.data;
  });
  }

  openHistoryPopup(){
    const modalElement = document.getElementById('showUpdateHistoryModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openEscalation(){
    const modalElement = document.getElementById('showUpdateEscalation');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onDocketNo(docketNo: any) {
    this.commonService.updateLoader(true);
    this.complaintService.getDocDataDetail(docketNo).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.docketNoList = response.data
        } 
        this.commonService.updateLoader(false);
      },
      error: (error: any) => {
        this.commonService.updateLoader(false);
      },
    });
  }
}

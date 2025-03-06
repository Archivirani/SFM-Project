import { Component, Input, SimpleChanges } from '@angular/core';
import { ComplaintDetailResponse, DocDataDetail, EscalatedHistory, UpdateHistory } from '../../../shared/models/complaint.model';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { Modal } from 'bootstrap';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-complaint-detail',
  standalone: false,
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss'],
})
export class ComplaintDetailComponent{
  updateHistoryList:UpdateHistory[]=[];
  escalatedHistory:EscalatedHistory[]=[];
  docketNoList?:DocDataDetail;
  @Input() complaintResponse: ComplaintDetailResponse | null = null;


  constructor(
    private complaintService: ComplaintService,
    public commonService: CommonService,
  ){}
  
  ngOnChanges(changes: SimpleChanges) {
      this.updateHistory(this.complaintResponse?.complaintID)
      this.onDocketNo(this.complaintResponse?.documentNo)
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LeadService } from '../../../shared/services/lead.service';
import { CommonService } from '../../../shared/services/common.service';
import { ExportService } from '../../../shared/services/export.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-list',
  standalone: false,
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {
  @Input() cardList: string ='';
  @Input() getfilter:any;
  filters: { [key: string]: string } = {}; 
  @Output() selectCardList = new EventEmitter<string>();
  constructor(
    public leadService:LeadService,
    public commonService:CommonService
  ){}

  exportLeadCategory(data:any){
    this.selectCardList.emit(data);
  }
}

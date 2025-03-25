import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: false,
  styleUrls: [],
})
export class SidebarComponent implements OnInit {
  isSFMMasters:any
  constructor(private scriptLoader: ScriptLoaderService,public commonService:CommonService) {
  }  
  ngOnInit(): void {
    this.isSFMMasters = JSON.parse(localStorage.getItem('ISSFMMASTER') || '{}');
    this.getMenuList(); 
    this.scriptLoader
      .loadScript('assets/js/app.js')
      .then(() => {})
      .catch((error) => console.error(error)); 
  }

  ngOnChanges(changes: any): void {
      this.commonService.isSFMMaster.subscribe((res)=>{
        this.isSFMMasters = res
      });
  }

  getMenuList(){
    this.commonService.getMenu().subscribe((res)=>{
      localStorage.setItem('ISSFMMASTER', JSON.stringify(res.data[0]));
      this.isSFMMasters = res.data[0]
    })
  }
}
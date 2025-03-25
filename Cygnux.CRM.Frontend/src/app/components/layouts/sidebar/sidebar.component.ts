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
  isSFMMaster = JSON.parse(localStorage.getItem('ISSFMMASTER') || '{}');
  constructor(private scriptLoader: ScriptLoaderService,private commonService:CommonService) {
    this.getMenuList();
  }

  getMenuList(){
    this.commonService.getMenu().subscribe((res)=>{
      localStorage.setItem('ISSFMMASTER', JSON.stringify(res.data[0]));
      this.isSFMMaster = res.data[0];
    })
  }

  ngOnInit(): void {
    this.scriptLoader
      .loadScript('assets/js/app.js')
      .then(() => {})
      .catch((error) => console.error(error));
  }
}

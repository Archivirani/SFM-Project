import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: false,
  styleUrls: [],
})
export class SidebarComponent implements OnInit {
  isSFMMasters: any
  constructor(private scriptLoader: ScriptLoaderService, public commonService: CommonService, private router: Router, private cd: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.isSFMMasters = JSON.parse(localStorage.getItem('ISSFMMASTER') || '{}');
    // this.getMenuList(); 
    
    this.commonService.getMenuList();  // In case of direct route hit or page reload
    
    this.commonService.isSFMMaster.subscribe((res) => {
      this.isSFMMasters = res;
      this.cd.detectChanges();
    });
  
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe(() => {
      this.commonService.getMenuList();  // Optional — if you want reload on every nav
    });
  }

  ngOnChanges(changes: any): void {
    this.commonService.isSFMMaster.subscribe((res) => {
      this.isSFMMasters = res
    });
  }

  getMenuList() {
    this.commonService.getMenu().subscribe((res) => {
      localStorage.setItem('ISSFMMASTER', JSON.stringify(res.data[0]));
      this.isSFMMasters = res.data[0]
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
declare function G(): void;
import * as bootstrap from 'bootstrap';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  public email: string | null = null;
  public userId : string | null = null;
  public designation : string | null = null;
  public userName : string | null = null;

  constructor(
    private identityService: IdentityService,
    private router: Router,
    private scriptLoader: ScriptLoaderService
 
  ) {
    this.email = identityService.getLoggedEmail();
    this.userId = identityService.getLoggedUserId();
    this.designation = identityService.getdesignationName();
    this.userName = identityService.getUserName();
  }

  ngOnInit(): void {
    // if (typeof G === 'function') {G();}

  }

    ngAfterViewInit(): void {
    const dropdownEl = document.getElementById('page-header-user-dropdown');
    if (dropdownEl) {
      new bootstrap.Dropdown(dropdownEl);
    }
  }

  signout(event: any): void {
    event.preventDefault();
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
   toggleSidebar() {
      this.scriptLoader.loadScript('assets/js/app.js').then(() => console.log('Script loaded')).catch(error => console.error(error));
  }
}

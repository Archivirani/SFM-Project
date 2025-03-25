import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
})
export class FullComponent implements OnInit{
  constructor(
    private identityService: IdentityService,
    public commonService: CommonService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.commonService.getMenuList(); 
  }

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

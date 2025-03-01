import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
})
export class FullComponent {
  constructor(
    private identityService: IdentityService,
    public commonService: CommonService,
    private router: Router
  ) {}

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

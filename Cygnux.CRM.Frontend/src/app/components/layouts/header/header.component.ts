import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';

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
    private router: Router
  ) {
    this.email = identityService.getLoggedEmail();
    this.userId = identityService.getLoggedUserId();
    this.designation = identityService.getdesignationName();
    this.userName = identityService.getUserName();
  }

  ngOnInit(): void {}

  signout(event: any): void {
    event.preventDefault();
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

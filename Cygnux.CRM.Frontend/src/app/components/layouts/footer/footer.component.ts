import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: []
})
export class FooterComponent implements OnInit  {

  constructor(private identityService: IdentityService,
    private router: Router){

  }

  ngOnInit(): void {

  }

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

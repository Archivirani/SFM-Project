import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { CommonService } from '../../shared/services/common.service';
import { IdentityService } from '../../shared/services/identity.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public loginFormGroup!: FormGroup;
  public isFormSubmit = false;
  isPasswordVisible: boolean = false;
  password: string = '';
  constructor(
    private identityService: IdentityService,
    private commonService: CommonService,
    private authService: AuthService,
    private toasterService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.validateToken(token!);

      setTimeout(() => {
        this.refreshToken();
      }, 3000);
    }
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginFormGroup = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        //  Validators.pattern(PasswordRegex),
        // Validators.minLength(8),
      ]),
      username: new FormControl(null, [Validators.required]),
    });
  }

  validateToken(token: string) {
    this.commonService.updateLoader(true);
    this.authService.validateToken({ token: token }).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.data.isValid) {
            this.identityService.setToken(token);
            this.router.navigateByUrl('/customer');
          } else {
            this.router.navigateByUrl('/login');
          }
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  get loginControls(): { [key: string]: AbstractControl } {
    let loginDetail = this.loginFormGroup.controls;
    return loginDetail;
  }

  public onSubmitLogin(): void {
    if (this.loginFormGroup.invalid) {
      return;
    }
    this.login();
    setTimeout(() => {
      this.refreshToken();
    }, 3000);
  }

  login() {
    this.commonService.updateLoader(true);
    this.identityService.login(this.loginFormGroup.getRawValue()).subscribe({
      next: (response) => {
        if (response && response.data && response.data.token) {
          console.log(response && response.data)
          this.toasterService.success('Login Successfully.');
          this.identityService.setToken(response.data.token);
          this.identityService.setBranchCode(response.data.branchCode);
          this.commonService.getMenuList(); 
          this.identityService.setLocation(response.data.multiLocation);
          this.identityService.setBranchName(response.data.branchName);
          this.identityService.setDesignation(response.data.designation);
          this.identityService.setRegion(response.data.reportLocName);
          this.identityService.setUserName(response.data.name);
          this.identityService.setRegionCode(response.data.reportingLoc);
          localStorage.setItem('loginUser', JSON.stringify(response.data));
          this.router.navigateByUrl('/customer');
          this.identityService.setUserType()   
        } else {
          this.toasterService.error(response.errorMessage);
          this.commonService.updateLoader(false);
        }
      },
      error: (response: any) => {
        this.commonService.updateLoader(false);
        this.toasterService.error(response.error.message);
      },
    });
  }

  refreshToken() {
    this.identityService.generateRefreshToken().subscribe({
      next: (response) => {
        if (response && response.data && response.data.refreshToken) {
          this.identityService.setRefreshToken(response.data.refreshToken);
        }
      },
      error: (response: any) => {
        // this.toasterService.error(response);
      },
    });
  }

  public onShowLogin(): void {
    this.buildLoginForm();
    this.isFormSubmit = false;
  }
}

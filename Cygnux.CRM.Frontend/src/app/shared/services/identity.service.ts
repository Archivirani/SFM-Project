import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {
  ApiBranchCode,
  ApiBranchName,
  ApiDesignation,
  ApiLocation,
  ApiRefreshTokenName,
  ApiRegion,
  ApiRegionCode,
  ApiTokenName,
  ApiUserName,
  ApiUserType,
} from '../constants/common';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { ApiHandlerService } from './api-handler.service';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  constructor(
    private apiHandlerService: ApiHandlerService,
    @Inject(DOCUMENT) private jwtHelper: JwtHelperService,
    @Inject(DOCUMENT) private _doc: Document
  ) {}

  localStorage(): Storage | undefined {
    return this._doc.defaultView?.localStorage;
  }

  login(loginDetails: any): Observable<IApiBaseResponse<any>> {
    const headers = new HttpHeaders().set('no-auth', 'true');
    return this.apiHandlerService.Post(
      'external/login',
      loginDetails,
      undefined,
      headers
    );
  }

  generateRefreshToken(): Observable<IApiBaseResponse<any>> {
    const headers = new HttpHeaders().set('no-auth', 'true');
    const params = {
      userId: this.getLoggedUserId(),
    };
    return this.apiHandlerService.Post(
      'auth/generate-refresh-token',
      params,
      undefined,
      headers
    );
  }

  setToken(token: string): void {
    this.localStorage()?.setItem(ApiTokenName, token);
  }

  setRefreshToken(refreshToken: string): void {
    this.localStorage()?.setItem(ApiRefreshTokenName, refreshToken);
  }

  setBranchCode(branchCode: string): void {
    this.localStorage()?.setItem(ApiBranchCode, branchCode);
  }

  setRegionCode(regionCode:string):void{
    this.localStorage()?.setItem(ApiRegionCode, regionCode);

  }
  setLocation(location: any[]): void {
    this.localStorage()?.setItem(ApiLocation, location?.shift().locCode);
  }

  setBranchName(branchName:string):void{
    this.localStorage()?.setItem(ApiBranchName, branchName);
  }

  setDesignation(designation:string):void{
    this.localStorage()?.setItem(ApiDesignation, designation);
  }

  setRegion(region:string):void{
    this.localStorage()?.setItem(ApiRegion, region);
  }

  setUserName(userName : string ):void{
    this.localStorage()?.setItem(ApiUserName, userName);
  }

  setUserType(): void {
    const UserType = this.getLoggedUserType()
    this.localStorage()?.setItem(ApiUserType, UserType);
  }

  getToken(): any {
    let token = null;
    if (this.localStorage()) {
      token = this.localStorage()?.getItem(ApiTokenName);
    }
    return token;
  }

  getRefreshToken(): string | null | undefined {
    let token = null;
    if (this.localStorage()) {
      token = this.localStorage()?.getItem(ApiRefreshTokenName);
    }
    return token;
  }

  clearToken(): void {
    this.localStorage()?.removeItem(ApiTokenName);
    this.localStorage()?.removeItem(ApiRefreshTokenName);
  }
  // Check if access token is expired
  isAccessTokenExpired(): boolean | Promise<boolean> {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }

  // Refresh access token
  refreshAccessToken() {
    let refreshToken = this.getRefreshToken();
    let userId = this.getLoggedUserId();
    const params: any = {
      RefreshToken: refreshToken,
      UserId: userId,
    };
    return this.apiHandlerService.Post('/api/refresh-token', { params });
  }
  getLoggedUserId(): string {
    let token = this.getToken();
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.Id;
    }
    return '';
  }

  getLoggedUserType(): string {
    let token = this.getToken();
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.UserType;
    }
    return '';
  }

  getLoggedEmail(): string {
    let token = this.getToken();
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.email;
    }
    return '';
  }

  getBranchCode(): any {
    let branchCode = null;
    if (this.localStorage()) {
      branchCode = this.localStorage()?.getItem(ApiBranchCode);
    }
    return branchCode;
  }
  getLocation(): any {
    let location = null;
    if (this.localStorage()) {
      location = this.localStorage()?.getItem(ApiLocation);
    }
    return location;
  }

  getRegion():any{
    let region = null;
    if (this.localStorage()) {
      region = this.localStorage()?.getItem(ApiRegion);
    }
    return region;
  }

  getRegionCode(): any {
    let regionCode = null;
    if (this.localStorage()) {
      regionCode = this.localStorage()?.getItem(ApiRegionCode);
    }
    return regionCode;
  }

  getdesignationName(): any {
    let designation = null;
    if (this.localStorage()) {
      designation = this.localStorage()?.getItem(ApiDesignation);
    }
    return designation;
  }

  getUserName(): any {
    let userName = null;
    if (this.localStorage()) {
      userName = this.localStorage()?.getItem(ApiUserName);
    }
    return userName;
  }

  getUserType(): any {
    let userType = null;
    if (this.localStorage()) {
      userType = this.localStorage()?.getItem(ApiUserType);
    }
    return userType;
  }

  isAuthenticate(): boolean {
    return this.getToken() ? true : false;
  }
}

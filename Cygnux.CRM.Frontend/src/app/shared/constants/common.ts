export const AppName = 'Cygnux-LSP-webapp';
export const ApiTokenName = 'token';
export const ApiRefreshTokenName = 'refreshToken';
export const ApiBranchCode = 'BranchCode';
export const ApiRegionCode = 'RegionCode';
export const ApiBranchName = 'BranchName';
export const ApiDesignation = 'Designation';
export const ApiRegion = 'Region';
export const ApiUserName = 'UserName';
export const ApiLocation = 'Location';
export const ApiUserType = 'UserType';
export const EmailRegex =
  /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
export const  MultipleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PincodeRegex = /^[0-9]{6}$/;
export const MobileRegex = /^[0-9]{10}$/;
export const AadharRegex = /^[0-9]{12}$/;
export const OnlyDigitRegex = /^[0-9]*$/;
export const FourDigitRegex = /^[0-9]{4}$/;
export const ThreeDigitRegex = /^[0-9]{3}$/;
export const TwoDigitRegex = /^[0-9]{2}$/;
export const MaxFileSize = 2098000; // 2 MB
export const PasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]+$/;
export const GSTRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const todayDate = new Date().toISOString().split('T')[0];

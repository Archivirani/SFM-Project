export interface ValidateResponse {
  isValid: boolean;
}

export interface TokenPayload {
  Id: string; // Subject (user ID)
  email: string;
  UserType:string;
}

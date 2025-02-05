export class LoginResponse {
  error : string;
  token : string;
  expiresInSec : number;

  constructor(error: string, token: string, expiresInSec: number) {
    this.error = error;
    this.token = token;
    this.expiresInSec = expiresInSec;
  }
}

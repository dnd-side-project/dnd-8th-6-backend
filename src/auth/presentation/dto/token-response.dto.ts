export class TokenResponseDto {
  token_type: string;
  access_token: string;
  expires_in: string;
  refresh_token: string;
  refresh_token_expires_in: string;

  constructor(
    access_token: string,
    expires_in: string,
    refresh_token: string,
    refresh_token_expires_in: string,
  ) {
    this.token_type = 'bearer';
    this.access_token = access_token;
    this.expires_in = expires_in;
    this.refresh_token = refresh_token;
    this.refresh_token_expires_in = refresh_token_expires_in;
  }
}

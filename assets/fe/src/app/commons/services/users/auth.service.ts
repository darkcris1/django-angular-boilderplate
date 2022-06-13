import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AUTH_KEY } from 'src/app/commons/constants/conf.constant';
import { urlsafe, encodeURL } from 'src/app/commons/utils/http.util';

import {
  API_USERS_LOGIN,
  API_USERS_SIGNUP,
} from 'src/app/commons/constants/api.constant';

import { Login, Signup } from 'src/app/commons/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  // temporarily store signup email to
  // display it on the success page.
  email: string = "";

  async login(data: Login) {
    const resp = await this.http.post(API_USERS_LOGIN, data)
      .toPromise();
    this.token = resp;
  }

  logout(): void {
    (window as any).localStorage.removeItem(AUTH_KEY);
  }

  async signup(data: Signup) {
    const resp = await this.http.post(API_USERS_SIGNUP, data)
      .toPromise();
    this.email = data.email;
    return resp;
  }

  async verify(code: string) {
    const resp = await this.http.post(
      urlsafe(API_USERS_SIGNUP, 'verify'),
      {code}
    ).toPromise();
    this.token = resp;

    return resp;
  }

  // User auth token

  set token(key: any) {
    (window as any).localStorage[AUTH_KEY] = JSON.stringify(key)
  }

  get token() {
    const d = (window as any).localStorage[AUTH_KEY];
    return !d ? {'token': null}: JSON.parse(d);
  }

  get authenticated(): boolean {
    return Boolean(this.token.token);
  }
  
}

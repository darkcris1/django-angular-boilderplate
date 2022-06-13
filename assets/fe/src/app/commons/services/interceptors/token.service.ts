import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/commons/services/users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private auth: AuthService
  ) { }

  intercept(r: HttpRequest<any>, n: HttpHandler): Observable <HttpEvent <any>> {
    const req = r.clone({
      headers: r.headers.set('Authorization', `Token ${this.auth.token.token||null}`)
    });
    return n.handle(req).pipe(tap(resp=>resp));
  }
}

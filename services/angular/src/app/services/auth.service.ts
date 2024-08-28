import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.expressUrl;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public setCookieExpiry(): Date {
    const expiryDate: Date = new Date();
    expiryDate.setHours( expiryDate.getHours() + 12 );
    return expiryDate;
  }

  public isAuthenticated(): boolean {
    return (this.cookie.get('user') ? true : false);
  }

  public validate(body: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, body, {
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    }).toPromise();
  }

  public logout(): void {
    this.cookie.deleteAll();
  }

  public setCookie(user: any): void {
    this.cookie.set('user', JSON.stringify(user), this.setCookieExpiry());
    this.cookie.set('signum', user.username, this.setCookieExpiry());
    this.cookie.set('name', user.forename, this.setCookieExpiry());
    this.cookie.set('surname', user.surname, this.setCookieExpiry());
    this.cookie.set('email', user.email, this.setCookieExpiry());
  }

  public getCookie(userData: string): any {
    return this.cookie.get(userData);
  }
}

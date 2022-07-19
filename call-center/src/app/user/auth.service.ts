import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const AUTH_API  = environment.api.url + '/api/v1/auth/';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(phone: string, password: string, role: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      phone,
      password,
      role
    }, httpOptions);
  }

  register(phone: string, password: string, role: string): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      phone,
      password,
      role
    }, httpOptions);
  }
}
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';
import { TokenStorageService } from 'src/app/user/token-storage.service';

import { catchError } from 'rxjs/operators';

let headers : HttpHeaders = new HttpHeaders();
const API_URL = environment.api.url + '/api/v1';

@Injectable()
export class ApiService {
  token = "Bearer "+ this.tokenStorage.getToken();
  headers: HttpHeaders = new HttpHeaders().set('AUTHORIZATION',this.token);

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    headers = this.headers;
  }

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams): Observable<any> {
    return this.http.get(API_URL + path , { params,  headers })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      API_URL + path,
      JSON.stringify(body),
      { headers }
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      API_URL + path,
      body,
      { headers }
    ).pipe(catchError(this.formatErrors));
  }

  delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.delete(
      API_URL + path, { params, headers }
    ).pipe(catchError(this.formatErrors));
  }
}
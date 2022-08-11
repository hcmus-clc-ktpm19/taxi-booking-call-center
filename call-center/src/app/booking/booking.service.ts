import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';

const url = "/car-request/callcenter"


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  postInfo(body: any): Observable<any> {
    return this.apiService.post(`${url}/create-or-update`, body);
  }
}

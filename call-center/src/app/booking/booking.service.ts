import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';

const BOOKING_API  = environment.api.url + '/api/v1/callcenter';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  postInfo(body: Object = {}): Observable<any> {
    return this.apiService.post(BOOKING_API + '/booking', body);
  }
}

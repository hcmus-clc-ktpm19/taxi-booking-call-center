import { carRequest } from './../shared/interface/car-request';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { map } from 'rxjs/operators';


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

  getCarRequest(): Observable<carRequest[]> {
    return this.apiService.get(`${url}/locating`);
  }
}

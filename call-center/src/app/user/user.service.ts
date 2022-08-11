import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/interface/user';
import { ApiService } from '../shared/services/api.service';

const url = "/callcenter"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService:  ApiService) { }
  
  getUserByPhone(phone: string): Observable<User> {
    return this.apiService.get(`${url}/user/phone/${phone}`);
  } 
}

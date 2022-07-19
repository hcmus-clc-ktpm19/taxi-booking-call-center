import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/interface/user';

const url = environment.api.url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
}

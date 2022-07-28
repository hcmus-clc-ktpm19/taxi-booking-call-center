import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './user/token-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'call-center';
  private role: string;
  isLoggedIn = false;
  username?: string;

  constructor(public router: Router, private tokenStorageService: TokenStorageService){}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      // const user = this.tokenStorageService.getUser();
      // this.roles = user.roles;

      // this.username = user.username;
    }
  }
}

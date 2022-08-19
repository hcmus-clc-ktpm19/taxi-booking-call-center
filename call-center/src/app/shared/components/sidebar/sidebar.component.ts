import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../user/token-storage.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role: string;
  isLoggedIn = false;
  username?: string;

  constructor(public router: Router, private tokenStorageService: TokenStorageService){}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.phone;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
    this.router.navigate(['/login']);
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) { }
  canActivate() {
    const token = this.tokenStorage.getToken();
    // if user is signed in
    if (token===null) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createRequestForm();
  }

  createRequestForm() {
    this.loginForm = this.fb.group({
      phone: [null, Validators.required, Validators.pattern('^[0-9]{10}$')],
      password: [null, Validators.required],
      role: ["", Validators.required]
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.controls['phone'].value, this.loginForm.controls['password'].value, this.loginForm.controls['role'].value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['/booking']);
      },
      err => {
        alert("Login failed");
        this.isLoginFailed = true;
      }
    );
  }

}

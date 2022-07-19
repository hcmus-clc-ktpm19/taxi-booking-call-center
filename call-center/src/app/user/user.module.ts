import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { UserRoutingModule } from './user-routing.module';
import { SigninComponent } from './signin/signin.component';


@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }

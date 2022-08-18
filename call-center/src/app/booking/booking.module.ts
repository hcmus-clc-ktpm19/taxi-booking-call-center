import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';


import { BookingRoutingModule } from './booking-routing.module';
import { HomeComponent } from './home/home.component';

import { ApiService } from '../shared/services/api.service';
import { TokenStorageService } from '../user/token-storage.service';
import { UserService } from '../user/user.service';
import { NominatimService } from './nominatim-service';
import { StompService } from './stomp.service';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  providers: [
    ApiService,
    TokenStorageService,
    UserService,
    NominatimService,
    StompService
  ]
})
export class BookingModule { }

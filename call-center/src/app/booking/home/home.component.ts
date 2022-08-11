import { Component, OnInit, EventEmitter } from '@angular/core';
import { BookingService } from '../booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import * as L from 'leaflet';
import {NominatimService} from '../nominatim-service';
import { NominatimResponse } from '../../shared/model/nominatim-response';
import { StompService } from '../stomp.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookingForm: FormGroup;
  searchForm: FormGroup;
  callCenterID: any;
  errorMessage: string;
  wsData: Object;

  private map: L.Map;
  private centroid: L.LatLngExpression = [10.762050,106.681830];

  searchResults: NominatimResponse[];

  // latitude: number = 10.762050;
  // longitude: number = 106.681830;
  // zoom = 15;
  // locationChosen = false;

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    private userService: UserService,
    private tokenStorage: TokenStorageService,
    private nominatimService: NominatimService,
    private stompService: StompService
  ) { }

  ngOnInit(): void {
    this.getCallCenterID();
    this.createRequestForm();
    this.initMap();
    // this.webSocketAPI._connect();          
    // this.onNewValueReceive();
    this.stompService.subscribe('/locate', (): void => {
      
    });
  }

  private initMap() {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 15
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,  
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  addressLookup() {
    // if (this.searchForm.get.length > 3) {
    //   this.nominatimService.addressLookup(event.target.value).subscribe(results => {
    //     this.searchResults = results;
    //   });
    // } else {
    //   this.searchResults = [];
    // }
    this.nominatimService.addressLookup(this.searchForm.controls['key'].value).subscribe(results => {
      this.searchResults = results;
      console.log(this.searchResults);
    });
  }

  getCallCenterID() {
    this.userService.getUserByPhone(this.tokenStorage.getUser().phone).subscribe(
      data => {
        this.callCenterID = data.id;
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  createRequestForm(){
    this.bookingForm = this.fb.group({
      callCenterId: [null],
      customerName:  [null, Validators.required],
      customerPhone: [null, Validators.required],
      carType: ["", Validators.required],
      pickingAddress: [null, Validators.required],
      status: ["LOCATING", Validators.required],
    });

    this.searchForm = this.fb.group({
      key: ["", Validators.required]
    });
  }

  onSubmit(): void {
    this.bookingForm.patchValue({
      callCenterId: this.callCenterID
    })
    this.bookingService.postInfo(this.bookingForm.value).subscribe(
      data => {
        console.log(data);
        alert("Booking car successfully !!");
        this.bookingForm.reset();
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }


}

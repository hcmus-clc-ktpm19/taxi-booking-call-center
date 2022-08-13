import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BookingService } from '../booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import * as L from 'leaflet';
import { NominatimService } from '../nominatim-service';
import { NominatimResponse } from '../../shared/model/nominatim-response';
import { StompService } from '../stomp.service';
import { carRequest } from './../../shared/interface/car-request';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  bookingForm: FormGroup;
  searchForm: FormGroup;
  callCenterID: any;
  errorMessage: string;
  currentRequest = null;
  dataSource: carRequest[] = [];
  displayedColumns = [
    'id',
    'name',
    'phone',
    'address',
    'action'
  ];
  private map: L.Map;
  private centroid: L.LatLngExpression = [10.762050, 106.681830];
  searchResults: NominatimResponse[];

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    private userService: UserService,
    private tokenStorage: TokenStorageService,
    private nominatimService: NominatimService,
    private stompService: StompService,
    private changeDetection: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getCallCenterID();
    this.createRequestForm();
    this.initMap();
    this.fetchData();
    this.stompService.subscribe('/locate', (): void => {
      this.fetchData();
    });
  }

  private fetchData() {
    this.bookingService.getCarRequest().subscribe(data => {
      this.dataSource = data;
      this.changeDetection.markForCheck();
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
    this.nominatimService.addressLookup(this.searchForm.controls['key'].value).subscribe(results => {
      this.searchResults = results;
      console.log(this.searchResults);
      this.addMarker();
    });
  }

  private addMarker() {
    this.searchResults.forEach(result => {
      const marker = new L.Marker([result.latitude, result.longitude])
        .setIcon(
          L.icon({
            iconSize: [25, 38],
            iconAnchor: [13, 41],
            iconUrl: 'assets/img/marker-icon.png'
          }));
      marker.addTo(this.map);
    });
  }

  locateRequest(id: any){
    this.currentRequest = id;
    // this.bookingService.locateRequest(id).subscribe({
    //   complete: () => {
    //     alert("Locating car successfully !!");
    //     console.log("Locating car successfully !!");
    //   },
    //   error: err => {
    //     this.errorMessage = err.error.message;
    //     alert("Something went wrong!!");
    //     console.log(err);
    //   }
    // });
  }

  cancelLocateRequest(){
    this.currentRequest = null;
  }

  isLocating(id: any): boolean {
      return this.currentRequest !== id && this.currentRequest !== null;
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

  createRequestForm() {
    this.bookingForm = this.fb.group({
      callCenterId: [null],
      customerName: [null, Validators.required],
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
    });
    this.bookingService.postInfo(this.bookingForm.value).subscribe({
      complete: () => { 
        alert("Booking car successfully !!");
        this.bookingForm.reset();
        console.log("Booking car successfully !!");
      },
      error: err => {
        this.errorMessage = err.error.message;
        alert("Something went wrong!!");
        console.log(err);
      }
    });
  }

}

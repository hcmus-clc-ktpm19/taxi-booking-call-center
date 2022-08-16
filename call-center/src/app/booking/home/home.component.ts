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
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private map: L.Map;
  private centroid: L.LatLngExpression = [10.762050, 106.681830];
  bookingForm: FormGroup;
  searchForm: FormGroup;
  callCenterID: any;
  errorMessage: string;
  suggestAddress = [];
  currentRequest: carRequest | null = null;
  searchColumns = ['searchResult'];
  dataSource: carRequest[] = [];
  searchResults: NominatimResponse[];
  addressSelected: NominatimResponse | null = null;
  markerList : L.Marker [] = [];
  displayedColumns = [
    'id',
    'name',
    'phone',
    'address',
    'action'
  ];

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
    this.stompService.subscribe('/b', (): void => {
      this.fetchData();
    });
  }

  fetchData() {
    this.bookingService.getCarRequest().subscribe(data => {
      this.dataSource = data;
      this.changeDetection.markForCheck();
    });
  }

  initMap() {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 15
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 5,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  addressLookup() {
    this.markerList.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.nominatimService.addressLookup(this.searchForm.controls['key'].value).subscribe(results => {
      this.searchResults = results;
      this.changeDetection.markForCheck();
    });
  }

  selectAddress(address: NominatimResponse) {
    if (this.addressSelected === null || this.addressSelected.displayName !== address.displayName) {
      this.addressSelected = address;
      this.addMarker(address);
      this.map.setView([address.latitude, address.longitude], 15);
    } else {
      this.addressSelected = null;
    }
  }

  addMarker(address: NominatimResponse) {
    const marker = new L.Marker([address.latitude, address.longitude])
      .setIcon(
        L.icon({
          iconSize: [30, 40],
          iconAnchor: [13, 41],
          iconUrl: 'assets/img/marker-icon.png'
        }));
    marker.addTo(this.map);
    this.markerList.push(marker);
  }

  setLatLngRequest() {
    if (this.addressSelected !== null && this.currentRequest !== null) {
      this.currentRequest.latPickingAddress = this.addressSelected.latitude;
      this.currentRequest.lngPickingAddress = this.addressSelected.longitude;

      this.bookingService.postInfo(this.currentRequest).subscribe({
        complete: () => {
          alert("Locating car successfully !!");
          this.cancelLocateRequest();
        },
        error: err => {
          this.errorMessage = err.error.message;
          alert("Something went wrong!!");
          console.error(err);
        }
      });
    }
  }

  locateRequest(request: carRequest) {
    this.currentRequest = request;
    this.searchForm.patchValue({
      key: request.pickingAddress
    });
    this.addressLookup();
    this.changeDetection.markForCheck();
  }

  cancelLocateRequest() {
    this.currentRequest = null;
    this.searchForm.patchValue({
      key: ""
    });
    this.searchResults = [];
    this.changeDetection.markForCheck();
  }

  isLocating(request: carRequest): boolean {
    return this.currentRequest !== request && this.currentRequest !== null;
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

  getSuggestAddress() {
    let customerPhone = this.bookingForm.controls['customerPhone'].value !== null ? this.bookingForm.controls['customerPhone'].value : null;
    customerPhone !== null && customerPhone !== ""? this.bookingService.getSuggestAddress(customerPhone).subscribe(
      data => {
        this.suggestAddress = data.addresses;
      }
    ) : this.suggestAddress = [];
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
        this.createRequestForm();
        this.cancelLocateRequest();
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

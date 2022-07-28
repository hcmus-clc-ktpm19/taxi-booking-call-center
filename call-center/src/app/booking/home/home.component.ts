import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: any = {
    name:  null,
    phone: null,
    houseNo: null,
    street: null,
    ward: null,
    district: null,
    city: null,
  };
  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // const { phone, password, role } = this.form;

    console.log(this.form);


    // this.bookingService.postInfo(phone).subscribe(
    //   data => {
    //     this.tokenStorage.saveToken(data.accessToken);
    //     this.isLoginFailed = false;
    //     this.isLoggedIn = true;
    //     this.router.navigate(['/booking']);
    //   },
    //   err => {
    //     this.errorMessage = err.error.message;
    //     this.isLoginFailed = true;
    //   }
    // );
  }

}

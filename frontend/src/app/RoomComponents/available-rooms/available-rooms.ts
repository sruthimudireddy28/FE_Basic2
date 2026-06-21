import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-available-rooms',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './available-rooms.html',
  styleUrl: './available-rooms.css'
})
export class AvailableRooms {

  hotelId: number = 0;
  checkIn: string = '';
  checkOut: string = '';
  rooms: any[] = [];
  hotel: any = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.getHotelDetails();

      const qCheckIn = this.route.snapshot.queryParamMap.get('checkIn');
      const qCheckOut = this.route.snapshot.queryParamMap.get('checkOut');
      if (qCheckIn && qCheckOut) {
        this.checkIn = qCheckIn;
        this.checkOut = qCheckOut;
        this.getAvailableRooms();
      }
    }
  }

  getHotelDetails() {
    this.http.get<any>(`http://localhost:5000/api/hotels/${this.hotelId}`)
      .subscribe({
        next: (res) => {
          this.hotel = res.data;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  getAvailableRooms() {

    if (!this.hotelId || !this.checkIn || !this.checkOut) {
      alert('Enter HotelId, Check-In and Check-Out dates');
      return;
    }

    const url = `http://localhost:5000/api/rooms/hotel/${this.hotelId}/available?checkIn=${this.checkIn}&checkOut=${this.checkOut}`;

    console.log(url);

    this.http.get<any>(url)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.rooms = res.data;
        },
        error: (err) => {
          console.log(err);
          alert('Failed to load available rooms');
        }
      });
  }
}

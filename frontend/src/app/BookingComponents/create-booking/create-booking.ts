import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.css'
})
export class CreateBooking implements OnInit {
  bookingData = {
    roomId: 0,
    hotelId: 0,
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const roomIdParam = this.route.snapshot.paramMap.get('roomId');
    const hotelIdParam = this.route.snapshot.paramMap.get('hotelId');
    if (roomIdParam) this.bookingData.roomId = Number(roomIdParam);
    if (hotelIdParam) this.bookingData.hotelId = Number(hotelIdParam);
  }

  submitBooking() {
    if (!this.bookingData.checkInDate || !this.bookingData.checkOutDate || !this.bookingData.guestName) {
      alert('Please fill in the Check-In, Check-Out, and Guest Name fields.');
      return;
    }
    this.http.post<any>('http://localhost:5000/api/bookings', this.bookingData).subscribe({
      next: (res) => {
        alert('Booking created successfully! Redirecting to pay...');
        // Take them to payment page
        this.router.navigate(['/process-payment', res.data.bookingId, res.data.totalAmount]);
      },
      error: (err) => {
        alert('Booking failed: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.http.get<any>('http://localhost:5000/api/bookings/my-bookings').subscribe({
      next: (res) => {
        this.bookings = res.data;
      },
      error: (err) => {
        alert('Failed to load bookings: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }

  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.http.post<any>(`http://localhost:5000/api/bookings/${id}/cancel`, { cancellationReason: 'Cancelled by guest via web interface' }).subscribe({
        next: (res) => {
          alert('Booking cancelled successfully.');
          this.loadBookings();
        },
        error: (err) => {
          alert('Cancellation failed: ' + (err.error?.message || 'Error occurred'));
        }
      });
    }
  }
}

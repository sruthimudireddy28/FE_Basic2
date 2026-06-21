import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-bookings.html',
  styleUrl: './all-bookings.css'
})
export class AllBookings implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAllBookings();
  }

  loadAllBookings() {
    this.http.get<any>('http://localhost:5000/api/bookings').subscribe({
      next: (res) => {
        this.bookings = res.data;
      },
      error: (err) => {
        alert('Failed to load all bookings. Admin/Manager role required.');
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.http.put<any>(`http://localhost:5000/api/bookings/${id}/status`, { status }).subscribe({
      next: (res) => {
        alert('Status updated successfully.');
        this.loadAllBookings();
      },
      error: (err) => {
        alert('Update failed: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }
}

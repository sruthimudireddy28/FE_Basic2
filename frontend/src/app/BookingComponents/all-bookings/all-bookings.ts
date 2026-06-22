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
  hotelsMap: Map<number, string> = new Map();
  roomsMap: Map<number, string> = new Map();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAllBookings();
  }

  loadAllBookings() {
    this.http.get<any>('http://localhost:5000/api/bookings').subscribe({
      next: (res) => {
        this.bookings = res.data || [];
        this.bookings.forEach(b => {
          b.hotelName = 'Loading...';
          b.roomType = 'Loading...';
        });
        this.enrichBookings();
      },
      error: (err) => {
        alert('Failed to load all bookings. Admin/Manager role required.');
      }
    });
  }

  enrichBookings() {
    // 1. Fetch all hotels
    this.http.get<any>('http://localhost:5000/api/hotels').subscribe({
      next: (res) => {
        if (res && res.data) {
          res.data.forEach((h: any) => {
            this.hotelsMap.set(h.hotelId, h.name);
          });
          this.bookings.forEach(b => {
            b.hotelName = this.hotelsMap.get(b.hotelId) || `Hotel #${b.hotelId}`;
          });
        }
      },
      error: (err) => console.log('Failed to load hotels map', err)
    });

    // 2. Fetch room details for each unique roomId
    const uniqueRoomIds = Array.from(new Set(this.bookings.map(b => b.roomId)));
    uniqueRoomIds.forEach(roomId => {
      this.http.get<any>(`http://localhost:5000/api/rooms/${roomId}`).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.roomsMap.set(roomId, res.data.roomType);
            this.bookings.forEach(b => {
              if (b.roomId === roomId) {
                b.roomType = res.data.roomType;
              }
            });
          }
        },
        error: (err) => console.log(`Failed to load room type for room ${roomId}`, err)
      });
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

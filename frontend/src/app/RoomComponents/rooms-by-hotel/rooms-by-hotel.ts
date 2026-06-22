import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms-by-hotel',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './rooms-by-hotel.html',
  styleUrl: './rooms-by-hotel.css'
})
export class RoomsByHotel {

  hotelId: number = 0;
  rooms: any[] = [];
  hotel: any = null;

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.getHotelDetails();
      this.getRooms();
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

  getRooms() {
    if (!this.hotelId) {
      alert('Please enter Hotel ID');
      return;
    }

    this.http.get<any>(`http://localhost:5000/api/rooms/hotel/${this.hotelId}`)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.rooms = res.data;
        },
        error: (err) => {
          console.log(err);
          alert('Failed to load rooms');
        }
      });
  }

  deleteRoom(roomId: number) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.http.delete(`http://localhost:5000/api/rooms/${roomId}`).subscribe({
        next: () => {
          alert('Room deleted successfully.');
          this.getRooms();
        },
        error: (err) => {
          alert('Delete failed: ' + (err.error?.message || 'Error occurred'));
        }
      });
    }
  }

  toggleAvailability(roomId: number, currentAvailable: boolean) {
    const isAvailable = !currentAvailable;
    this.http.put(`http://localhost:5000/api/rooms/${roomId}/availability`, { roomId, isAvailable }).subscribe({
      next: () => {
        alert('Availability updated successfully.');
        this.getRooms();
      },
      error: (err) => {
        alert('Failed to update availability: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }
}


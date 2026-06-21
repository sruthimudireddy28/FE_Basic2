import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-rooms-by-hotel',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './rooms-by-hotel.html',
  styleUrl: './rooms-by-hotel.css'
})
export class RoomsByHotel {

  hotelId: number = 0;
  rooms: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.getRooms();
    }
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
}


import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RoomSearch } from '../../models/room-search';
import { RoomResponse } from '../../models/room-response';

@Component({
  selector: 'app-search-rooms',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-rooms.html',
  styleUrl: './search-rooms.css',
})
export class SearchRooms {

  search: RoomSearch = {};
  rooms: RoomResponse[] = [];
  isSearched = false;

  constructor(private http: HttpClient) {}

  searchRooms() {
    console.log('Payload:', this.search);

    this.http.post<any>('http://localhost:5000/api/rooms/search', this.search)
      .subscribe({
        next: (res) => {
          this.rooms = res.data;
          this.isSearched = true;
        },
        error: (err) => {
          console.log(err);
          alert('Search failed');
        }
      });
  }

  reset() {
    this.search = {};
    this.rooms = [];
    this.isSearched = false;
  }
}

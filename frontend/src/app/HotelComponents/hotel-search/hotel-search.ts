import { Component } from '@angular/core';
import { SearchHotel } from '../../models/search-hotel';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotel-search',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './hotel-search.html',
  styleUrl: './hotel-search.css',
})
export class HotelSearch {
  
search: SearchHotel = {};
hotels: any[] = [];

get isAdmin(): boolean {
  return localStorage.getItem('userRole') === 'Admin';
}

constructor(private http: HttpClient) {}

searchHotels() {
    this.http.post<any>('http://localhost:5000/api/hotels/search', this.search)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.hotels = res.data;
        },
        error: (err) => {
          console.log(err);
          alert('Search failed');
        }
      });
  }

}


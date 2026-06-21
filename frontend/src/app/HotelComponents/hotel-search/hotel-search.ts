import { Component } from '@angular/core';
import { SearchHotel } from '../../models/search-hotel';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-search',
  imports: [FormsModule],
  templateUrl: './hotel-search.html',
  styleUrl: './hotel-search.css',
})
export class HotelSearch {
  
search: SearchHotel = {};
hotels: any[] = [];

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


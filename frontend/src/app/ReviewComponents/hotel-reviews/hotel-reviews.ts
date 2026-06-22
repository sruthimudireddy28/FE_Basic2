import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-reviews.html',
  styleUrl: './hotel-reviews.css'
})
export class HotelReviews implements OnInit {
  hotelId = 0;
  reviews: any[] = [];
  hotel: any = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('hotelId');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.loadHotelDetails();
      this.loadReviews();
    }
  }

  loadHotelDetails() {
    this.http.get<any>(`http://localhost:5000/api/hotels/${this.hotelId}`).subscribe({
      next: (res) => {
        this.hotel = res.data;
      },
      error: (err) => console.log('Failed to load hotel details', err)
    });
  }

  loadReviews() {
    this.http.get<any>(`http://localhost:5000/api/reviews/hotel/${this.hotelId}`).subscribe({
      next: (res) => {
        this.reviews = res.data;
      },
      error: () => {
        alert('Failed to load reviews.');
      }
    });
  }

  helpful(id: number) {
    this.http.post<any>(`http://localhost:5000/api/reviews/${id}/helpful`, {}).subscribe({
      next: () => {
        alert('Review marked as helpful!');
        this.loadReviews();
      }
    });
  }
}

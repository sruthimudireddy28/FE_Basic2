import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-reviews.html',
  styleUrl: './manage-reviews.css'
})
export class ManageReviews implements OnInit {
  reviews: any[] = [];
  
  // Filters
  filterHotelId: number | null = null;
  filterUserId: number | null = null;
  filterIsApproved: string = 'all'; // 'all', 'true', 'false'

  // Responses dictionary
  responses: { [key: number]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.searchReviews();
  }

  searchReviews() {
    const payload: any = {};
    if (this.filterHotelId !== null && this.filterHotelId > 0) {
      payload.hotelId = this.filterHotelId;
    }
    if (this.filterUserId !== null && this.filterUserId > 0) {
      payload.userId = this.filterUserId;
    }
    if (this.filterIsApproved === 'true') {
      payload.isApproved = true;
    } else if (this.filterIsApproved === 'false') {
      payload.isApproved = false;
    }

    this.http.post<any>('http://localhost:5000/api/reviews/search', payload).subscribe({
      next: (res) => {
        this.reviews = res.data || [];
        // Initialize responses field
        this.reviews.forEach(r => {
          this.responses[r.reviewId] = r.managerResponse || '';
        });
      },
      error: (err) => {
        alert('Failed to load reviews. Admin or Manager role required.');
        console.log(err);
      }
    });
  }

  approveReview(id: number) {
    this.http.post<any>(`http://localhost:5000/api/reviews/${id}/approve`, {}).subscribe({
      next: () => {
        alert('Review approved successfully.');
        this.searchReviews();
      },
      error: (err) => {
        alert('Approval failed: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }

  submitResponse(id: number) {
    const responseText = this.responses[id];
    if (!responseText || !responseText.trim()) {
      alert('Please enter a response message.');
      return;
    }

    this.http.post<any>(`http://localhost:5000/api/reviews/${id}/respond`, { response: responseText }).subscribe({
      next: () => {
        alert('Response submitted successfully.');
        this.searchReviews();
      },
      error: (err) => {
        alert('Response failed: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }

  deleteReview(id: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.http.delete<any>(`http://localhost:5000/api/reviews/${id}`).subscribe({
        next: () => {
          alert('Review deleted successfully.');
          this.searchReviews();
        },
        error: (err) => {
          alert('Delete failed: ' + (err.error?.message || 'Error occurred'));
        }
      });
    }
  }

  resetFilters() {
    this.filterHotelId = null;
    this.filterUserId = null;
    this.filterIsApproved = 'all';
    this.searchReviews();
  }
}

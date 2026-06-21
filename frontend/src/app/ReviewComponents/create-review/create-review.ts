import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-review.html',
  styleUrl: './create-review.css'
})
export class CreateReview implements OnInit {
  reviewData = {
    hotelId: 0,
    rating: 5,
    comment: '',
    title: ''
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const hotelIdParam = this.route.snapshot.paramMap.get('hotelId');
    if (hotelIdParam) this.reviewData.hotelId = Number(hotelIdParam);
  }

  submitReview() {
    if (!this.reviewData.title || !this.reviewData.comment) {
      alert('Please fill out the Title and Comment fields.');
      return;
    }
    this.http.post<any>('http://localhost:5000/api/reviews', this.reviewData).subscribe({
      next: (res) => {
        alert('Review submitted successfully!');
        this.router.navigate(['/hotels']);
      },
      error: (err) => {
        alert('Failed to submit review: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }
}

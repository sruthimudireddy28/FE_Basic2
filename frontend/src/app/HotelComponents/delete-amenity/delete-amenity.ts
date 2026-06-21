import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-delete-amenity',
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-amenity.html',
  styleUrl: './delete-amenity.css',
})
export class DeleteAmenity {

  amenityId: number = 0;
  message: string = '';

  constructor(private client: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.amenityId = Number(idParam);
      this.message = `Ready to delete Amenity ID: ${this.amenityId}`;
    }
  }

  deleteAmenity() {
    if (!this.amenityId) {
      this.message = "Please enter Amenity ID";
      return;
    }

    this.client
      .delete<ApiResponse>(`http://localhost:5000/api/amenities/${this.amenityId}`)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message;
        },
        error: (err) => {
          console.log(err);
          this.message = err.error?.message || "Error deleting amenity";
        },
      });
  }
}


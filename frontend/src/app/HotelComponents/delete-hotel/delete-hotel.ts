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
  selector: 'app-delete-hotel',
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-hotel.html',
  styleUrl: './delete-hotel.css',
})
export class DeleteHotel {

  hotelId: number = 0;
  message: string = '';

  constructor(private client: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.message = `Ready to delete Hotel ID: ${this.hotelId}`;
    }
  }

  deleteHotel() {
    if (!this.hotelId) {
      this.message = "Please enter Hotel ID";
      return;
    }

    this.client
      .delete<ApiResponse>(`http://localhost:5000/api/hotels/${this.hotelId}`)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message;
        },
        error: (err) => {
          console.log(err);
          this.message = err.error?.message || "Error deleting hotel";
        },
      });
  }
}


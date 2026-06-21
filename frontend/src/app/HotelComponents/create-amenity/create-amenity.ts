import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Amenities } from '../../models/amenities';
import { PostAmenity } from '../../models/post-amenity';
import { FormsModule } from '@angular/forms';

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Amenities;
}

@Component({
  selector: 'app-hotel-amenities',
  imports: [FormsModule],
  templateUrl: './create-amenity.html',
  styleUrl: './create-amenity.css',
})
export class CreateAmenity {

  amenities: Amenities[] = [];

  // ✅ Use CreateAmenity model here (Input DTO)
  newAmenity: PostAmenity = {
    name: '',
    description: '',
    icon: '',
    category: ''
  };

  constructor(private client: HttpClient) {}

  createAmenity(): void {

    this.client.post<ApiResponse>(
      "http://localhost:5000/api/amenities",
      this.newAmenity   // sending CreateAmenity
    )
    .subscribe({next: (res) => {
        if (res.success) {alert(res.message);
          // response is Amenities (AmenityDto)
          this.amenities.push(res.data);

          // reset input model
          this.newAmenity = {
            name: '',
            description: '',
            icon: '',
            category: ''
          };

        } else {
          alert(res.message);
        }
      },

      error: (error) => {alert(JSON.stringify(error));
      }
    });
  }
}


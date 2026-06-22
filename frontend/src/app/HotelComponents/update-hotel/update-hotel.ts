import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PutHotel } from '../../models/put-hotel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-hotel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-hotel.html',
  styleUrl: './update-hotel.css',
})
export class UpdateHotel {

  hotelId!: number;

  // Use model directly (not any)
  hotel: PutHotel = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.loadHotel();
    }
  }

  // Load hotel (map only required fields)
  loadHotel() {
    this.http.get<any>(`http://localhost:5000/api/hotels/${this.hotelId}`)
      .subscribe({
        next: (res) => {

          // ✅ IMPORTANT: map ONLY PutHotel fields
          this.hotel = {
            name: res.data.name,
            location: res.data.location,
            address: res.data.address,
            city: res.data.city,
            state: res.data.state,
            country: res.data.country,
            zipCode: res.data.zipCode,
            description: res.data.description,
            imageUrl: res.data.imageUrl,
            contactNumber: res.data.contactNumber,
            email: res.data.email,
            imageUrls: res.data.imageUrls,
            amenityIds: res.data.amenityIds
          };

        },
        error: () => {
          alert('Hotel not found ');
        }
      });
  }

  // Update using model directly
  updateHotel() {

    console.log('Sending:', this.hotel); 

    this.http.put(`http://localhost:5000/api/hotels/${this.hotelId}`, this.hotel)
      .subscribe({
        next: () => {
          alert('Hotel updated successfully');
          this.router.navigate(['/hotels']);
        },
        error: (err) => {
          console.log(err);
          alert(err.error?.message || 'Update failed');
        }
      });
  }
}

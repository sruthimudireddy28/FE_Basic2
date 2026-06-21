import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PostAmenity } from '../../models/post-amenity';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-amenity',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-amenity.html',
  styleUrl: './update-amenity.css',
})
export class UpdateAmenity {

  amenityId!: number;

  // Input model
  amenity: PostAmenity = {
    name: '',
    description: '',
    icon: '',
    category: ''
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.amenityId = Number(idParam);
      this.loadAmenity();
    }
  }

  // Load Amenity by ID
  loadAmenity() {

    this.http.get<any>(`http://localhost:5000/api/amenities/${this.amenityId}`)
      .subscribe({
        next: (res) => {

          // map ONLY required fields
          this.amenity = {
            name: res.data.name,
            description: res.data.description,
            icon: res.data.icon,
            category: res.data.category
          };

        },
        error: () => {
          alert('Amenity not found');
        }
      });
  }

  // Update Amenity
  updateAmenity() {

    console.log('Sending:', this.amenity);

    this.http.put(
      `http://localhost:5000/api/amenities/${this.amenityId}`,
      this.amenity
    )
    .subscribe({
      next: () => {
        alert('Amenity updated successfully');
      },
      error: (err) => {
        console.log(err);
        alert(err.error?.message || 'Update failed');
      }
    });
  }
}

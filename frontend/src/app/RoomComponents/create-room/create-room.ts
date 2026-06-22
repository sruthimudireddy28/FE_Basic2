import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-room.html',
  styleUrl: './create-room.css',
})
export class CreateRoom {
  hotelId: number = 0;
  roomNumber: string = '';
  roomType: string = '';
  description: string = '';
  pricePerNight: number = 0;
  maxOccupancy: number = 2;
  bedCount: number = 1;
  bedType: string = '';
  floorNumber: number = 1;
  roomSize: number = 0;
  imageUrl: string = '';
  amenityInput: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const hotelIdParam = this.route.snapshot.paramMap.get('hotelId');
    if (hotelIdParam) {
      this.hotelId = Number(hotelIdParam);
    }
  }

  create() {
    const amenities = this.amenityInput
      .split(',')
      .map(x => Number(x.trim()))
      .filter(x => !isNaN(x) && x > 0)
      .map(id => ({ amenityId: id }));

    const payload = {
      hotelId: this.hotelId,
      roomNumber: this.roomNumber,
      roomType: this.roomType,
      description: this.description,
      pricePerNight: this.pricePerNight,
      maxOccupancy: this.maxOccupancy,
      bedCount: this.bedCount,
      bedType: this.bedType,
      floorNumber: this.floorNumber,
      roomSize: this.roomSize,
      imageUrl: this.imageUrl,
      amenities: amenities
    };

    this.http.post('http://localhost:5000/api/rooms', payload).subscribe({
      next: (res) => {
        alert('Room created successfully.');
        this.router.navigate(['/rooms-by-hotel', this.hotelId]);
      },
      error: (err) => {
        alert('Creation failed: ' + (err.error?.message || 'Error occurred'));
        console.log(err);
      }
    });
  }
}

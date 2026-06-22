import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-room.html',
  styleUrl: './update-room.css',
})
export class UpdateRoom {
  roomId: number = 0;
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
  isAvailable: boolean = true;
  amenityInput: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.roomId = Number(idParam);
      this.loadRoom();
    }
  }

  loadRoom() {
    this.http.get<any>(`http://localhost:5000/api/rooms/${this.roomId}`).subscribe({
      next: (res) => {
        if (res && res.data) {
          const r = res.data;
          this.hotelId = r.hotelId;
          this.roomNumber = r.roomNumber;
          this.roomType = r.roomType;
          this.description = r.description;
          this.pricePerNight = r.pricePerNight;
          this.maxOccupancy = r.maxOccupancy;
          this.bedCount = r.bedCount;
          this.bedType = r.bedType;
          this.floorNumber = r.floorNumber;
          this.roomSize = r.roomSize;
          this.imageUrl = r.imageUrl;
          this.isAvailable = r.isAvailable;
          this.amenityInput = r.amenities ? r.amenities.map((a: any) => a.amenityId).join(', ') : '';
        }
      },
      error: (err) => {
        alert('Failed to load room details.');
        console.log(err);
      }
    });
  }

  update() {
    const amenities = this.amenityInput
      .split(',')
      .map(x => Number(x.trim()))
      .filter(x => !isNaN(x) && x > 0)
      .map(id => ({ amenityId: id }));

    const payload = {
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
      isAvailable: this.isAvailable,
      amenities: amenities
    };

    this.http.put(`http://localhost:5000/api/rooms/${this.roomId}`, payload).subscribe({
      next: (res) => {
        alert('Room updated successfully.');
        this.router.navigate(['/rooms-by-hotel', this.hotelId]);
      },
      error: (err) => {
        alert('Update failed: ' + (err.error?.message || 'Error occurred'));
        console.log(err);
      }
    });
  }
}

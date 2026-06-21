import { Component } from '@angular/core';
import { Amenities } from '../../models/amenities';
import { HttpClient } from '@angular/common/http';

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Amenities[];
}

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotel-amenities',
  imports: [RouterLink],
  templateUrl: './hotel-amenities.html',
  styleUrl: './hotel-amenities.css',
})
export class HotelAmenities {
  amenity:Array<Amenities>=[];
  constructor(private client:HttpClient){}
  ngOnInit():void{
     this.client.get<ApiResponse>("http://localhost:5000/api/amenities")
    .subscribe({
      next:(res)=>{ this.amenity=res.data;},
      error:(error)=>{
        alert(JSON.stringify(error));
        console.log(error);
      }
    })
  }
}


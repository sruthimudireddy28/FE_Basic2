import { Component } from '@angular/core';
import { PosttHotel } from '../../models/post-hotel';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-hotel',
  imports: [FormsModule],
  templateUrl: './create-hotel.html',
  styleUrl: './create-hotel.css',
})
export class CreateHotel {
  p:PosttHotel=new PosttHotel();
  amenityInput: string = '';
  constructor(private client:HttpClient){}
  create(){
this.p.amenityIds = this.amenityInput
      .split(',')
      .map(x => Number(x.trim()))
      .filter(x => !isNaN(x));

    this.client.post("http://localhost:5000/api/hotels",this.p)
    .subscribe({next:(data)=>alert(JSON.stringify(data)),
              error:(err)=>alert(JSON.stringify(err))});
  }
}


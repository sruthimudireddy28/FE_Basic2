import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Hotel[];
}

@Component({
  selector: 'app-hotels',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels {
  hotels:Array<Hotel>=[];
  checkIn: string = '';
  checkOut: string = '';
  
  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }

  constructor(private client: HttpClient) {}
    ngOnInit():void{
      this.client.get<ApiResponse>('http://localhost:5000/api/hotels')
      .subscribe({next:(res)=>{
        console.log(res);
        console.log(res.data);
        this.hotels=res.data;},
    error:(err)=>{
      alert(JSON.stringify(err));
      console.log(err);
    }
    });
  }
}


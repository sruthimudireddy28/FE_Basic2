import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-payments.html',
  styleUrl: './my-payments.css'
})
export class MyPayments implements OnInit {
  payments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:5000/api/payments/my-payments').subscribe({
      next: (res) => {
        this.payments = res.data;
      },
      error: (err) => {
        alert('Failed to load payment history.');
      }
    });
  }
}

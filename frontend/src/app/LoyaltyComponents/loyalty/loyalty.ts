import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loyalty.html',
  styleUrl: './loyalty.css'
})
export class LoyaltyStatus implements OnInit {
  hasAccount = false;
  account: any = null;
  history: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkLoyaltyAccount();
  }

  checkLoyaltyAccount() {
    this.http.get<any>('http://localhost:5000/api/loyalty/account').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.hasAccount = true;
          this.account = res.data;
          this.loadHistory();
        } else {
          this.hasAccount = false;
        }
      },
      error: () => {
        this.hasAccount = false;
      }
    });
  }

  enroll() {
    this.http.post<any>('http://localhost:5000/api/loyalty/account', {}).subscribe({
      next: (res) => {
        alert('Enrolled successfully! You received starting loyalty points.');
        this.checkLoyaltyAccount();
      },
      error: (err) => {
        alert('Enrollment failed: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }

  loadHistory() {
    this.http.get<any>('http://localhost:5000/api/loyalty/history').subscribe({
      next: (res) => {
        this.history = res.data;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './process-payment.html',
  styleUrl: './process-payment.css'
})
export class ProcessPayment implements OnInit {
  bookingId = 0;
  amount = 0;
  pointsToRedeem = 0;
  loyaltyBalance = 0;
  redeemChecked = false;

  paymentData = {
    paymentMethod: 'CreditCard',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const bookingIdParam = this.route.snapshot.paramMap.get('bookingId');
    const amountParam = this.route.snapshot.paramMap.get('amount');
    if (bookingIdParam) this.bookingId = Number(bookingIdParam);
    if (amountParam) this.amount = Number(amountParam);

    // Fetch loyalty account to check points balance
    this.http.get<any>('http://localhost:5000/api/loyalty/account').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.loyaltyBalance = res.data.pointsBalance;
        }
      },
      error: () => {
        // Loyalty account might not exist, ignore and keep balance 0
      }
    });
  }

  onPay() {
    if (!this.paymentData.cardNumber || !this.paymentData.cardHolderName || !this.paymentData.cvv) {
      alert('Please fill in card details.');
      return;
    }

    if (this.redeemChecked && this.pointsToRedeem > this.loyaltyBalance) {
      alert('You cannot redeem more points than your current balance.');
      return;
    }

    const payload = {
      bookingId: this.bookingId,
      amount: this.amount,
      pointsToRedeem: this.redeemChecked ? this.pointsToRedeem : 0,
      paymentMethod: this.paymentData.paymentMethod,
      currency: 'INR',
      description: 'Room Booking Payment',
      cardNumber: this.paymentData.cardNumber,
      cardHolderName: this.paymentData.cardHolderName,
      expiryDate: this.paymentData.expiryDate,
      cvv: this.paymentData.cvv
    };

    // Step 1: Initiate Payment
    this.http.post<any>('http://localhost:5000/api/payments/initiate', payload).subscribe({
      next: (res) => {
        if (res.success) {
          const paymentId = res.data.paymentId;
          
          // Step 2: Process Payment automatically
          const processPayload = {
            paymentId: paymentId,
            transactionId: 'TXN_' + Math.floor(Math.random() * 1000000000),
            isSuccessful: true,
            failureReason: ''
          };

          this.http.post<any>('http://localhost:5000/api/payments/process', processPayload).subscribe({
            next: (procRes) => {
              alert('Payment processed successfully! Booking confirmed.');
              this.router.navigate(['/my-bookings']);
            },
            error: (procErr) => {
              alert('Payment processing failed: ' + (procErr.error?.message || 'Error occurred'));
            }
          });
        }
      },
      error: (err) => {
        alert('Payment initiation failed: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }
}

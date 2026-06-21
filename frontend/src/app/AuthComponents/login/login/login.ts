import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Maps directly to LoginRequestDto
  loginData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.success) {
          // Save token and user details from LoginResponseDto
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userRole', response.data.role);
          alert('Login successful! Redirecting...');
            this.router.navigate(['/hotels']); // make sure route exists
        }
      },
      error: (err) => {
        alert('Login failed: ' + err.error?.message || 'Server error');
      }
    });
  }
}
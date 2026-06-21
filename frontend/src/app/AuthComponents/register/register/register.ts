import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  // Maps directly to RegisterRequestDto
  registerData = {
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    role: 'Guest' // Default value
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Registration successful! Redirecting to login...');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        alert('Registration failed: ' + (err.error?.message || 'Server error'));
      }
    });
  }
}
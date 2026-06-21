import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    alert('Logged out successfully.');
    this.router.navigate(['/']);
  }
}


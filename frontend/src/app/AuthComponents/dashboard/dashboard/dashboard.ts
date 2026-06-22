import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  
  // Controls the 'UpdateUserDto' tracking state
  selectedUserId: number | null = null;
  updateData = {
    name: '',
    contactNumber: '',
    password: ''
  };

  // Loyalty Management Properties
  selectedUserLoyaltyId: number | null = null;
  selectedUserLoyalty: any = null;
  bonusPoints: number = 100;
  bonusReason: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data; // Expecting List<UserResponseDto>
        }
      },
      error: (err) => alert('Error loading users: Admin role required.')
    });
  }

  selectUserForEdit(user: any) {
    this.selectedUserId = user.userId;
    this.updateData.name = user.name;
    this.updateData.contactNumber = user.contactNumber;
    this.updateData.password = ''; // Clear password field for security
  }

  onUpdateUser() {
    if (this.selectedUserId !== null) {
      this.authService.updateUser(this.selectedUserId, this.updateData).subscribe({
        next: (response) => {
          alert('User updated successfully!');
          this.selectedUserId = null;
          this.loadUsers(); // Refresh data table
        },
        error: (err) => alert('Update failed')
      });
    }
  }

  onDeleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully.');
          this.loadUsers(); // Refresh data table
        },
        error: (err) => alert('Deletion failed')
      });
    }
  }

  onLogout() {
    this.authService.logout();
    alert('Logged out');
  }

  // Loyalty Points Functions
  viewLoyalty(userId: number) {
    this.selectedUserLoyalty = null;
    this.selectedUserLoyaltyId = userId;
    this.bonusReason = '';
    this.http.get<any>(`http://localhost:5000/api/loyalty/account/${userId}`).subscribe({
      next: (res) => {
        this.selectedUserLoyalty = res.data;
      },
      error: (err) => {
        alert('Failed to load loyalty account for user ' + userId + '. Ensure they have enrolled in Loyalty Rewards.');
        this.selectedUserLoyaltyId = null;
      }
    });
  }

  awardBonus() {
    if (this.selectedUserLoyaltyId === null) return;
    if (this.bonusPoints <= 0) {
      alert('Points must be a positive number.');
      return;
    }
    if (!this.bonusReason.trim()) {
      alert('Please specify a reason for awarding bonus points.');
      return;
    }
    const payload = {
      points: this.bonusPoints,
      reason: this.bonusReason
    };
    this.http.post<any>(`http://localhost:5000/api/loyalty/bonus/${this.selectedUserLoyaltyId}`, payload).subscribe({
      next: (res) => {
        alert('Bonus points awarded successfully!');
        this.viewLoyalty(this.selectedUserLoyaltyId!); // Reload loyalty account info
      },
      error: (err) => {
        alert('Failed to award bonus points: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }
}
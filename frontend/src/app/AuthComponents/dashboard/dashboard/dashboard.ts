import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services/auth';

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

  constructor(private authService: AuthService) {}

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
}
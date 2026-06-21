import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update this URL to match your running .NET backend port
  private apiUrl = 'http://localhost:5000/api/auth'; 

  constructor(private http: HttpClient) {}

  // Helper to construct authorization headers with the stored JWT token
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getAuthHeaders());
  }

  updateUser(id: number, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, updateData, this.getAuthHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getAuthHeaders());
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
}
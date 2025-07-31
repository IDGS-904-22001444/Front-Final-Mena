import { ChangePasswordRequest } from './../interfaces/change-password-request';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private tokenKey: string = 'token';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/Account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/Account/register`,
      data
    );
  }

  getDetail = (): Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.apiUrl}/Account/detail`);


  forgotPassword = (email: string): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/account/forgot-password`, { 
      email,
    });

  resetPassword = (data: ResetPasswordRequest): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/account/reset-password`, data);

  changePassword = (data: ChangePasswordRequest): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/account/change-password`, data);

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };
    return userDetail;
  };

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
      if (isTokenExpired) this.logout();
      return isTokenExpired;
    } catch (error) {
      this.logout();
      return true;
    }
  } 

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  };

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
    
  };
    

  getAll = (): Observable<UserDetail[]> =>
    this.http.get<UserDetail[]>(`${this.apiUrl}/account`);


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // NUEVOS MÉTODOS PARA GESTIÓN DE USUARIOS
  
  /**
   * Elimina un usuario por ID
   * @param userId - ID del usuario a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Account/${userId}`);
  }

  /**
   * Actualiza un usuario existente
   * @param userId - ID del usuario a actualizar
   * @param userData - Datos del usuario a actualizar
   * @returns Observable con la respuesta del servidor
   */
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Account/${userId}`, userData);
  }

  /**
   * Obtiene un usuario específico por ID
   * @param userId - ID del usuario
   * @returns Observable con los datos del usuario
   */
  getUserById(userId: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.apiUrl}/Account/${userId}`);
  }
}


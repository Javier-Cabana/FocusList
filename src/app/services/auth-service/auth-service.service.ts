// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../model/i-LoginRequest';
import { JwtResponse } from '../../model/i-JwtResponse';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioCreateDTO } from '../../model/i-UsuarioCreateDTO';
import { UsuarioResponseDTO } from 'src/app/model/i-Usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private userId: string = '';

  constructor(private http: HttpClient) {}

  login(creds: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.baseUrl}/autenticacion/login`, creds)
      .pipe(
        tap(res => {
          localStorage.setItem('jwt_token', res.token);
          localStorage.setItem('token_type', res.type);
        })
      );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token_type');
  }

  registrar(usuario: UsuarioCreateDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/autenticacion/registro`, usuario)
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  initUserId(username: string): void {
    if (!username) return;
    this.http
      .get<UsuarioResponseDTO>(
        `${this.baseUrl}/users/${encodeURIComponent(username)}`
      )
      .subscribe({
        next: user => {
          this.userId = user.id;
          localStorage.setItem('ID', this.userId)
        },
        error: err => {
          console.error('No se pudo cargar perfil de usuario', err);
        }
      });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioResponseDTO } from 'src/app/model/i-Usuario';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

getByUsername(username: string): Observable<UsuarioResponseDTO> {
  return this.http.get<UsuarioResponseDTO>(
    `${this.apiUrl}/users/${encodeURIComponent(username)}`
  );
}

}

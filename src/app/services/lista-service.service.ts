import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Page
} from 'src/app/model/i-Page';
import {
  ListaResponseDTO,
  ListaCreateDTO,
  ListaUpdateDTO,
  ListaGetDTO
} from 'src/app/model/i-Lista';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Obtiene todas las listas de un usuario con paginación */
  getListasByUsuario(
    username: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'nombre,asc'
  ): Observable<Page<ListaResponseDTO>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http
      .get<Page<ListaResponseDTO>>(
        `${this.apiUrl}/listas/all/${encodeURIComponent(username)}`,
        { params }
      )
      .pipe(catchError(this.handleError));
  }

  /** Busca una lista concreta por nombre y usuario */
  getListaByNameAndUsuario(
    dto: ListaGetDTO
  ): Observable<ListaResponseDTO> {
    return this.http
      .get<ListaResponseDTO>(
        `${this.apiUrl}/listas`,
        { params: { nombre: dto.nombre, idUsuario: dto.idUsuario } }
      )
      .pipe(catchError(this.handleError));
  }

  /** Crea una nueva lista */
  createLista(dto: ListaCreateDTO): Observable<ListaResponseDTO> {
    return this.http
      .post<ListaResponseDTO>(
        `${this.apiUrl}/listas`,
        dto
      )
      .pipe(catchError(this.handleError));
  }

  /** Actualiza una lista existente */
  updateLista(dto: ListaUpdateDTO): Observable<ListaResponseDTO> {
    return this.http
      .put<ListaResponseDTO>(
        `${this.apiUrl}/listas`,
        dto
      )
      .pipe(catchError(this.handleError));
  }

  /** Elimina una lista */
  deleteLista(id: string): Observable<{ message: string }> {
    return this.http
      .request<{ message: string }>(
        'delete',
        `${this.apiUrl}/listas`,
        { body: { id } }
      )
      .pipe(catchError(this.handleError));
  }

  /** Manejador de errores HTTP */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en ListaService:', error);
    return throwError(() => new Error(
      error.error?.message || 'Error de comunicación con el servidor'
    ));
  }
}

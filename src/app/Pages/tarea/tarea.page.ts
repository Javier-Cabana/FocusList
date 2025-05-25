import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton,IonIcon,
  IonList, IonItem, IonItemSliding, IonLabel, IonReorderGroup,
  IonReorder, IonItemOption, IonItemOptions, IonInfiniteScroll,
  IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast-service/toast-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TareaCreateDTO, TareaResponseDTO, TareaUpdateDTO } from 'src/app/model/i-Tarea';
import { Page } from 'src/app/model/i-Page';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonReorderGroup,
    IonList, IonItem, IonItemSliding, IonReorder, IonItemOption, IonItemOptions,
    IonInfiniteScroll, IonInfiniteScrollContent, IonLabel,
  ]
})
export class TareaPage implements OnInit {
  tareas : TareaResponseDTO[] = [];
  page = 0;
  size = 10;
  public lista: string = '';
  private listaId: string = '';
  isReorderDisabled = false;
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    addIcons({personCircle}); }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.listaId = params.get('idLista') || '';
      this.lista = this.route.snapshot.queryParamMap.get('nombre') || '';
      this.loadTarea();
    })
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  /** Reordena localmente las tareas */
  handleReorder(event: CustomEvent<{ from: number; to: number; complete: () => void }>): void {
    const moved = this.tareas.splice(event.detail.from, 1)[0];
    this.tareas.splice(event.detail.to, 0, moved);
    event.detail.complete();
  }

  loadTarea(): void {
    const params = new HttpParams()
      .set('page', this.page)
      .set('size', this.size)
      .set('sort', 'titulo,asc');

    // POST /tarea/all?page=…&size=…
    this.http
      .post<Page<TareaResponseDTO>>(
        `${environment.apiUrl}/tarea/all`,
        { id: '', idLista: this.listaId },
        { params }
      )
      .subscribe({
        next: res => {
          this.tareas = res.content;
        },
        error: err => {
          console.error('Error cargando tareas:', err);
          this.toast.error('Error cargando tareas');
        }
      });
  }

  addTarea() {
    const titulo = window.prompt('Título de la nueva tarea:');
  if (!titulo?.trim()) {
    this.toast.error('El título no puede estar vacío');
    return;
  }

  const descripcion = window.prompt('Descripción (opcional):') || '';

  // const fechaInput = window.prompt('Fecha de vencimiento (YYYY-MM-DD):');
  let fechaVenc = '';
  // if (fechaInput) {
  //   const d = new Date(fechaInput);
  //   if (isNaN(d.getTime())) {
  //     this.toast.error('Fecha inválida');
  //     return;
  //   }
  //   fechaVenc = d.toISOString();
  // }

  const dto: TareaCreateDTO = {
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    fechaVencimiento: fechaVenc,
    idLista: this.listaId,
    idEtiqueta: ''
  };

  this.http
    .post<TareaResponseDTO>(`${this.apiUrl}/tarea`, dto)
    .subscribe({
      next: nuevaTarea => {
        // Insertamos al principio del array para verla de inmediato
        this.tareas.unshift(nuevaTarea);
        this.toast.success('Tarea creada correctamente');
      },
      error: err => {
        console.error('Error creando tarea:', err);
        this.toast.error('No se pudo crear la tarea');
      }
    });
  }

  editTarea(tarea: TareaResponseDTO, slidingItem: IonItemSliding): void {
    slidingItem.close();

    const nuevoTitulo = window.prompt('Nuevo título:', tarea.titulo);
    if (!nuevoTitulo?.trim()) {
      this.toast.error('El título no puede estar vacío');
      return;
    }
    const nuevaDesc = window.prompt('Nueva descripción (opcional):', tarea.descripcion) || '';

    const dto: TareaUpdateDTO = {
      id: tarea.id,
      titulo: nuevoTitulo.trim(),
      descripcion: nuevaDesc.trim(),
      completada: tarea.completada,
      fechaVencimiento: tarea.fechaVencimiento,
      idLista: this.listaId,
      idEtiqueta: tarea.idEtiqueta
    };

    this.http
      .put<TareaResponseDTO>(`${this.apiUrl}/tarea`, dto)
      .subscribe({
        next: updated => {
          // Sustituimos la tarea en el array para refrescar la vista
          const idx = this.tareas.findIndex(t => t.id === updated.id);
          if (idx > -1) this.tareas[idx] = updated;
          this.toast.success('Tarea actualizada correctamente');
        },
        error: err => {
          console.error('Error actualizando tarea:', err);
          this.toast.error('No se pudo actualizar la tarea');
        }
      });
  }


  deleteTarea(id: string): void {
  this.http
    .delete(
      `${this.apiUrl}/tarea`,
      {
        body: { id },
        responseType: 'text'
      }
    )
    .subscribe({
      next: (mensaje: string) => {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.toast.success(mensaje);
      },
      error: err => {
        console.error('Error eliminando tarea:', err);
        this.toast.error('No se pudo eliminar la tarea');
      }
    });
  }

  loadMore(event: any): void {
  this.page++;
  const params = new HttpParams()
    .set('page', this.page)
    .set('size', this.size)
    .set('sort', 'titulo,asc');

  this.http.post<Page<TareaResponseDTO>>(
    `${this.apiUrl}/tarea/all`,
    { id: '', idLista: this.listaId },
    { params }
  ).subscribe({
    next: res => {
      if (res && Array.isArray(res.content)) {
        this.tareas.push(...res.content);
      } else {
        this.toast.error('No se recibieron más tareas');
      }

      event.target.complete();

      if (res && res.last) {
        event.target.disabled = true;
      }
    },
    error: err => {
      console.error('Error cargando más tareas:', err);
      this.toast.error('Error cargando más tareas');
      event.target.complete();
    }
  });
}
}

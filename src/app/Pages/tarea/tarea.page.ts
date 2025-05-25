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
import { TareaResponseDTO } from 'src/app/model/i-Tarea';
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

  }

  editTarea(tarea: TareaResponseDTO, slidingItem: IonItemSliding): void {

  }

  deleteTarea(id: string): void {

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
      this.tareas.push(...res.content);
      event.target.complete();
      if (res.last) {
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

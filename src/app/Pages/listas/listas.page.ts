import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton,IonIcon,
  IonList, IonItem, IonItemSliding, IonLabel, IonReorderGroup,
  IonReorder, IonItemOption, IonItemOptions, IonInfiniteScroll,
  IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast-service/toast-service.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { ListaService } from 'src/app/services/lista-service/lista-service.service';
import {
  ListaResponseDTO,
  ListaCreateDTO,
  ListaUpdateDTO
} from 'src/app/model/i-Lista';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCol, IonGrid, IonRow, IonInput, IonButton, IonIcon, IonList, IonItem, IonItemSliding,
    IonLabel, IonReorderGroup, IonReorder, IonItemOption, IonItemOptions, IonInfiniteScroll,
    IonInfiniteScrollContent]
})

export class ListasPage implements OnInit {
  listas: ListaResponseDTO[] = [];
  page = 0;
  size = 10;
  public username = '';
  userId = localStorage.getItem('ID') ?? '';
  isReorderDisabled = false;

  constructor(
    private router: Router,
    private toast: ToastService,
    private listaService: ListaService,
    private http: HttpClient
  ) {
    addIcons({personCircle});
  }

  ngOnInit():void {
    this.username = localStorage.getItem('username') || '';
    this.loadListas();
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  /** Carga la primera página de listas */
  loadListas(): void {
    this.listaService
      .getListasByUsuario(this.username, this.page, this.size)
      .subscribe({
        next: res => {
          this.listas = res.content;
        },
        error: err => {
          console.log('Error cargando listas: ' + err.message)
          this.toast.error('Error cargando listas');
        }
      });
  }

  /** Carga más páginas al hacer scroll */
  loadMore(event: any): void {
    this.page++;
    this.listaService
      .getListasByUsuario(this.username, this.page, this.size)
      .subscribe({
        next: res => {
          this.listas.push(...res.content);
          event.target.complete();
          if (res.last) {
            event.target.disabled = true;
          }
        },
        error: err => {
          console.log('Error cargando más listas: ' + err.message)
          this.toast.error('Error cargando más listas');
          event.target.complete();
        }
      });
  }

  /** Reordena localmente las listas */
  handleReorder(event: CustomEvent<{ from: number; to: number; complete: () => void }>): void {
    const moved = this.listas.splice(event.detail.from, 1)[0];
    this.listas.splice(event.detail.to, 0, moved);
    event.detail.complete();
  }

  /** Elimina una lista y actualiza la vista */
  deleteLista(id: string): void {
    this.listaService.deleteLista(id).subscribe({
      next: (mensaje: string) => {
        this.listas = this.listas.filter(l => l.id !== id);
        this.toast.success(mensaje);
      },
      error: err => {
        console.log('Error al eliminar lista: ' + err.message)
        this.toast.error('Error al eliminar lista: ' + (err.message || 'Error inesperado'));
      }
    });
  }

  /** Añade una nueva lista pidiendo el nombre por prompt */
  addLista(): void {
    const nombre = window.prompt('Nombre de la nueva lista:');
    if (!nombre?.trim()) {
      this.toast.error('El nombre no puede estar vacío');
      return;
    }

    const dto: ListaCreateDTO = {
      nombre: nombre.trim(),
      idUsuario: this.userId
    };

    this.listaService.createLista(dto).subscribe({
      next: nueva => {
        // Inserta la nueva lista al principio
        this.listas.unshift(nueva);
        this.toast.success('Lista creada correctamente');
      },
      error: err => {
        console.log('Error al crear lista: ' + err.message)
        this.toast.error('Error al crear lista');
      }
    });
  }

  editLista(lista: ListaResponseDTO, slidingItem: IonItemSliding): void {
    slidingItem.close();

    // Pedimos el nuevo nombre
    const nuevoNombre = window.prompt('Nuevo nombre de la lista:', lista.nombre);
    if (!nuevoNombre?.trim()) {
      this.toast.error('El nombre no puede estar vacío');
      return;
    }
    // Creamos el DTO de actualización
    const dto: ListaUpdateDTO = {
      id: lista.id,
      nombre: nuevoNombre.trim(),
      idUsuario: this.userId // tu userId en UUID
    };

    // Llamada al servicio
    this.listaService.updateLista(dto).subscribe({
      next: updated => {
        // Actualizamos en la vista
        lista.nombre = updated.nombre;
        this.toast.success('Lista actualizada correctamente');
      },
      error: err => {
        console.error('Error al actualizar lista:', err);
        this.toast.error('Error al actualizar lista');
      }
    });
  }

   /** Navegar a la página de tareas de la lista */
  openTareas(lista: ListaResponseDTO): void {
    this.router.navigate(
      ['/tarea', lista.id],
      { queryParams: { nombre: lista.nombre } }
    );
  }
}

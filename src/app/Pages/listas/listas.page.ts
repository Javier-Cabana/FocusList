import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton,IonIcon,
  IonList, IonItem, IonItemSliding, IonLabel, IonReorderGroup,
  IonReorder, IonItemOption, IonItemOptions, IonInfiniteScroll,
  IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast-service.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';

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
  listas: any[] = [];
  page = 0;
  size = 10;
  username = '';
  isReorderDisabled = false;

  constructor(
    private router: Router,
    private toast: ToastService,
    private listaService: ListaService,
    private http: HttpClient
  ) {
    addIcons({personCircle});
   }

  ngOnInit() {
    this.loadListas();
  }

  loadListas() {
    this.listaService.getListasByUsuario(this.username, this.page, this.size).subscribe((res) => {
      this.listas.push(...res.content); // asumiendo paginación estilo Spring
    });
  }

  goToPerfil() {
    this.router.navigate(['/perfil']);
  }

  addLista(){

  }
}

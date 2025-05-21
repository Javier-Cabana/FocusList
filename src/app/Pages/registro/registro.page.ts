import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCol, IonGrid, IonRow, IonInput, IonButton]
})
export class RegistroPage implements OnInit {
  username = '';
  email = '';
  password = '';
  passwordConfirm='';

  constructor(
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  onRegistro(){

  }

}

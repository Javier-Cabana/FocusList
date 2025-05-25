import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCol, IonGrid, IonRow, IonInput, IonButton]
})
export class PerfilPage implements OnInit {
  username = '';
  email = '';
  password = '';
  passwordConfirm='';

  constructor() { }

  ngOnInit() {
  }

}

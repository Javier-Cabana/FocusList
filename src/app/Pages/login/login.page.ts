import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service.service';
import { ToastService } from 'src/app/services/toast-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCol, IonGrid, IonRow, IonInput, IonButton]
})

export class LoginPage implements OnInit {
  username = '';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  onLogin(){
    this.auth.login({ username: this.username, email:this.email, password: this.password})
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/listas', {replaceUrl: true});
        },
        error: err => {
          console.error('Error al autenticar', err);
          this.toast.error('Usuario o contraseña incorrectos');
        }
      })
  }

  onRegistro(){
    this.router.navigateByUrl('/registro', {replaceUrl: true});
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast-service.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

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
    private toast: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  onRegistro() {
    if (this.password !== this.passwordConfirm) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    const nuevoUsuario = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.registrar(nuevoUsuario).subscribe({
      next: () => {
        this.toast.success('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al registrarse';
        this.toast.error(msg);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCol, IonGrid, IonRow, IonInput, IonButton, AlertController } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast-service/toast-service.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { headset } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCol, IonGrid, IonRow, IonInput, IonButton]
})
export class PerfilPage implements OnInit {
  id = '';
  username = '';
  email = '';
  password = '';
  passwordConfirm='';
  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.id = localStorage.getItem('ID') || '';
    this.username = localStorage.getItem('username') || '';
  }

  onSubmit(){
    if (this.password && this.password !== this.passwordConfirm) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    const body: any = {
      id: this.id
    };

    if (this.username) body.username = this.username;
    if (this.email) body.email = this.email;
    if (this.password) body.password = this.password;

    const token = localStorage.getItem('token');

    this.http.put(`${this.baseUrl}/users`, body, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.toast.success('Perfil actualizado correctamente. Cerrando sesión...');
        this.onLogout();
      },
      error: (err) => {
        this.toast.error('Error al actualizar perfil');
        console.error(err);
      }
    });
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async onDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar borrado',
      message: '¿Estás seguro de que quieres borrar tu perfil? Esta acción es irreversible.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Borrar',
          handler: () => this.deleteUser()
        }
      ]
    });
    await alert.present();
  }

  deleteUser(){
    const token = localStorage.getItem('jwt_token');

    this.http.delete(
      `${this.baseUrl}/users`,
      {
        body: { id: this.id },
        responseType: 'text'
      }
    ).subscribe({
      next: (mensaje: string) => {
        this.toast.success(mensaje);
        this.onLogout();
      },
      error: err => {
        this.toast.error('Error al eliminar perfil');
        console.error('DELETE /users error:', err);
      }
    });
  }
}

// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  /**
   * Muestra un toast con opciones genéricas.
   * @param message Texto a mostrar
   * @param color 'success' | 'warning' | 'danger'
   * @param duration Duración en ms (default: 2000)
   * @param position 'top' | 'bottom' | 'middle'
   */
  public async show(
    message: string,
    color: 'success' | 'warning' | 'danger' = 'success',
    duration = 2000,
    position: 'top' | 'bottom' | 'middle' = 'bottom'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position,
      color,
    });
    await toast.present();
  }

  public error(message: string, duration = 3000) {
    return this.show(message, 'danger', duration);
  }

  public success(message: string, duration = 2000) {
    return this.show(message, 'success', duration);
  }

  public warning(message: string, duration = 2500) {
    return this.show(message, 'warning', duration);
  }
}

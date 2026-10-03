import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

const LONGITUD_MINIMA_MENSAJE = 20;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulario de contacto (F08) con Reactive Forms.
 * Validaciones: campos obligatorios, formato de correo, longitud mínima del mensaje y
 * aceptación de la política. El botón de envío permanece inactivo mientras el formulario sea inválido.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html'
})
export class Contacto {
  readonly minimoMensaje = LONGITUD_MINIMA_MENSAJE;
  readonly enviado = signal(false);

  readonly formulario = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(PATRON_CORREO)] }),
    motivo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    asunto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    mensaje: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(LONGITUD_MINIMA_MENSAJE)] }),
    politica: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] })
  });

  get longitudMensaje(): number {
    return this.formulario.controls.mensaje.value.trim().length;
  }

  /** Un campo muestra su error solo después de que el usuario lo tocó. */
  invalido(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  enviar(): void {
    this.enviado.set(false);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviado.set(true);
    this.formulario.reset();
  }
}

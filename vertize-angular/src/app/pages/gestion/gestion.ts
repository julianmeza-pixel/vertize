import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { CATEGORIAS } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';

/**
 * Mini CRUD de noticias (F05, F06): alta con formulario validado y baja con confirmación.
 * Los cambios se reflejan de inmediato en el catálogo porque el servicio expone signals.
 */
@Component({
  selector: 'app-gestion',
  imports: [ReactiveFormsModule],
  templateUrl: './gestion.html'
})
export class Gestion {
  protected readonly servicio = inject(NoticiasService);

  readonly categorias = CATEGORIAS;
  readonly publicada = signal(false);

  readonly catalogo = computed(() =>
    [...this.servicio.noticias()].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)
  );

  readonly formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    autor: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    tiempoLectura: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1), Validators.max(30)] }),
    imagen: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^(https?:\/\/\S+)?$/)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20)] }),
    contenido: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(40)] })
  });

  invalido(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  publicar(): void {
    this.publicada.set(false);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valores = this.formulario.getRawValue();
    this.servicio.crear({
      titulo: valores.titulo.trim(),
      categoria: valores.categoria,
      autor: valores.autor.trim(),
      tiempoLectura: Number(valores.tiempoLectura),
      imagen: valores.imagen.trim(),
      descripcion: valores.descripcion.trim(),
      contenido: valores.contenido.trim()
    });
    this.formulario.reset();
    this.publicada.set(true);
  }

  limpiar(): void {
    this.formulario.reset();
    this.publicada.set(false);
  }

  eliminar(id: number): void {
    if (!window.confirm('¿Eliminar esta noticia del catálogo? Esta acción no se puede deshacer.')) return;
    this.servicio.eliminar(id);
  }
}

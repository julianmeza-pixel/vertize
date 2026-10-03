import { Routes } from '@angular/router';

/** Cada vista se carga de forma diferida (lazy loading) para reducir el peso inicial. */
export const routes: Routes = [
  {
    path: '',
    title: 'Vertize — La frontera de la Inteligencia Artificial',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home)
  },
  {
    path: 'noticias',
    title: 'Noticias, Ensayos y Crónicas de IA — Vertize',
    loadComponent: () => import('./pages/noticias/noticias').then((m) => m.Noticias)
  },
  {
    path: 'noticias/:id',
    loadComponent: () => import('./pages/detalle/detalle').then((m) => m.Detalle)
  },
  {
    path: 'favoritas',
    title: 'Tus Noticias Favoritas — Vertize',
    loadComponent: () => import('./pages/favoritas/favoritas').then((m) => m.Favoritas)
  },
  {
    path: 'contacto',
    title: 'Ponte en Contacto con Vertize',
    loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto)
  },
  {
    path: 'gestion',
    title: 'Gestión de Noticias y Publicación Rápida — Vertize',
    loadComponent: () => import('./pages/gestion/gestion').then((m) => m.Gestion)
  },
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Juguetón — Inicio',
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
    title: 'Juguetón — Catálogo',
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./pages/producto/producto.component').then((m) => m.ProductoComponent),
    title: 'Juguetón — Producto',
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito.component').then((m) => m.CarritoComponent),
    title: 'Juguetón — Carrito',
  },
  { path: '**', redirectTo: '' },
];

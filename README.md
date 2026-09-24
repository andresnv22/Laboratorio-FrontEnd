# Juguetón — Tienda de juguetes (Angular)

Proyecto Angular (standalone components, Angular 18) con el mismo diseño del mockup: **Inicio**, **Catálogo**, **Producto** y **Carrito**.

## Cómo correrlo

```bash
npm install
npm start
```

Abre http://localhost:4200

## Estructura

```
src/app/
  components/header/        Encabezado con navegación y contador del carrito
  components/footer/        Pie de página
  pages/home/                Página de inicio (hero, categorías, destacados)
  pages/catalogo/             Catálogo con filtros por categoría
  pages/producto/              Detalle de producto (galería, variantes, relacionados)
  pages/carrito/               Carrito con resumen de pedido
  services/product.service.ts  Datos de productos (mock)
  services/cart.service.ts     Estado del carrito con Angular Signals
  models/product.model.ts      Tipo Product
```

## Notas

- El carrito usa `signal()`/`computed()` de Angular para el estado reactivo, sin librerías externas.
- Las rutas usan `loadComponent` (lazy) y `:id` de producto se pasa como `input()` gracias a `withComponentInputBinding()`.
- Los "productos" usan íconos SVG como placeholder de imagen — sustitúyelos por fotos reales en `product.service.ts` y en las plantillas.
- Paleta y tipografía (Baloo 2 + Nunito) coinciden con el mockup visual entregado en el artifact de diseño.

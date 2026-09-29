# Juguetón — Tienda de juguetes (Angular)

Frontend Angular 18 (standalone components) de la tienda: **Inicio**, **Catálogo**, **Producto** y **Carrito**. Está conectado al backend de la carpeta [`../backend`](../backend) (Node + Express + MongoDB), así que el catálogo, el carrito y los pedidos se leen y se guardan en MongoDB.

## Cómo correrlo

Mira el [README de la raíz](../README.md): desde la raíz del repo, `npm run backend` en una terminal y `npm run frontend` en otra. Luego abre http://localhost:4200

Si el backend no está corriendo, las páginas muestran el aviso *"No se pudo conectar con el servidor"*.

## Cómo se conecta con el backend

- `src/app/config/api.config.ts`: las llamadas van a `/api/...`.
- `proxy.conf.json`: en desarrollo, `ng serve` reenvía `/api` al backend en `http://localhost:3000`. El navegador solo ve `localhost:4200`, así que no hay problemas de CORS. Si el backend corre en otro puerto, cámbialo aquí.
- `src/app/interceptors/cart-id.interceptor.ts`: agrega el header `x-cart-id` a cada llamada. El id se genera una sola vez por navegador y se guarda en `localStorage` (`services/cart-id.ts`), así el carrito sobrevive a recargas sin login.
- `models/product.model.ts`: MongoDB devuelve el identificador como `_id`; `toProduct()` lo convierte al `id` que usa el frontend.

## Estructura

```
src/app/
  config/api.config.ts          Prefijo de la API (/api)
  interceptors/                  Header x-cart-id en cada petición
  components/header/             Navegación y contador del carrito
  components/footer/             Pie de página
  pages/home/                    Inicio (hero, categorías, destacados desde la API)
  pages/catalogo/                Catálogo con filtros por categoría y precio
  pages/producto/                Detalle de producto y relacionados
  pages/carrito/                 Carrito + formulario de checkout (crea el pedido)
  services/product.service.ts    GET /api/products, /:id, /:id/related
  services/cart.service.ts       /api/cart (estado en un signal)
  services/order.service.ts      POST /api/orders/checkout
  models/                        Tipos Product y Order
```

## Notas

- El estado del carrito se guarda en un `signal()` con la última respuesta del backend; el header, el carrito y la página de producto se actualizan solos.
- Precios en formato colombiano (`$ 89.900`) gracias al locale `es-CO`.
- Los productos usan íconos SVG como imagen de ejemplo; se pueden reemplazar por fotos reales agregando un campo de imagen en el backend.

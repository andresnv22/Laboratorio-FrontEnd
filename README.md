# Juguetón — Tienda de juguetes

Aplicación completa de una tienda de juguetes:

| Carpeta | Qué es | Tecnología |
|---|---|---|
| [`frontend/`](frontend) | La tienda (Inicio, Catálogo, Producto, Carrito) | Angular 18 |
| [`backend/`](backend) | API REST con CRUD de productos, carrito y pedidos | Node.js + Express + TypeScript + MongoDB (Mongoose) |

## Requisitos

- Node.js 18 o superior
- Una base de datos MongoDB (Atlas o local)

## Primera vez

```bash
npm run install:all                       # instala backend y frontend
cp backend/.env.example backend/.env      # luego pon tu MONGODB_URI en backend/.env
npm run seed                              # carga los 6 productos de ejemplo
```

El archivo `backend/.env` tiene tu contraseña de MongoDB, así que **no se sube** a GitHub (está en `.gitignore`). Cada persona que clone el repo crea el suyo desde `.env.example`.

## Correr la aplicación

Se necesitan **dos terminales**, ambas en la raíz del repositorio:

```bash
# Terminal 1
npm run backend     # API en http://localhost:3000

# Terminal 2
npm run frontend    # Tienda en http://localhost:4200
```

Abre **http://localhost:4200**.

## Cómo se comunican

El frontend llama a rutas `/api/...`. En desarrollo, `ng serve` las reenvía al backend en `http://localhost:3000` (ver `frontend/proxy.conf.json`), así el navegador ve un solo origen y no hay problemas de CORS.

El carrito no requiere login: el frontend genera un id por navegador, lo guarda en `localStorage` y lo envía en el header `x-cart-id`.

Los endpoints de la API están documentados en [`backend/README.md`](backend/README.md).

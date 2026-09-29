# Juguetón — Backend (Node.js + Express + TypeScript + MongoDB/Mongoose)

API REST para la tienda de juguetes. Cubre **productos**, **carrito** y **pedidos** (CRUD completo), pensada para conectarse directamente al frontend Angular ya entregado. Vive en la carpeta `backend/` del monorepo; el frontend está en `frontend/`.

## Requisitos

- Node.js 18+
- Una base de datos MongoDB: Atlas (nube) o local (Docker)

## Puesta en marcha

```bash
npm install
cp .env.example .env      # pega tu connection string de MongoDB en MONGODB_URI
npm run seed                # carga los 6 productos de ejemplo
npm run dev                  # http://localhost:3000
```

### Opción A: MongoDB Atlas (nube)

En Atlas, crea un cluster gratuito, un usuario de base de datos, y agrega tu IP a la lista blanca (o `0.0.0.0/0` para pruebas). Copia el connection string ("Connect" → "Drivers") y pégalo en `.env`:

```
MONGODB_URI="mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/juguetondb?retryWrites=true&w=majority"
```

### Opción B: MongoDB local con Docker

```bash
docker run --name juguetondb-mongo -p 27017:27017 -d mongo:7
```

Y en `.env`:

```
MONGODB_URI="mongodb://localhost:27017/juguetondb"
```

## Cómo identifica el carrito de cada visitante

No hay login. El frontend genera un UUID una sola vez (por ejemplo con `crypto.randomUUID()`), lo guarda en `localStorage`, y lo envía en **todas** las llamadas al carrito y al checkout con el header:

```
x-cart-id: <uuid-del-visitante>
```

## Endpoints

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista productos. Filtros por query: `category`, `minPrice`, `maxPrice`, `search` |
| GET | `/api/products/:id` | Detalle de un producto |
| GET | `/api/products/:id/related` | Productos relacionados (misma categoría) |
| POST | `/api/products` | Crea un producto (requiere `_id` como slug, p. ej. `"nuevo-juguete"`) |
| PUT | `/api/products/:id` | Actualiza un producto |
| DELETE | `/api/products/:id` | Elimina un producto |

Categorías válidas: `Bloques`, `Peluches`, `Vehículos`, `Juegos de mesa` (las mismas que usa el frontend Angular).

### Carrito (requiere header `x-cart-id`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/cart` | Devuelve items, subtotal, envío y total |
| POST | `/api/cart/items` | Agrega un producto `{ productId, quantity }` |
| PATCH | `/api/cart/items/:productId` | Cambia la cantidad `{ quantity }` (0 elimina el item) |
| DELETE | `/api/cart/items/:productId` | Elimina un producto del carrito |
| DELETE | `/api/cart` | Vacía el carrito |

Envío gratis desde $150.000; si no llega, se cobra $12.900 (igual que en el mockup y el frontend).

### Pedidos

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/orders/checkout` | Convierte el carrito (header `x-cart-id`) en un pedido `{ customerName, customerEmail, customerAddress }`. Vacía el carrito al terminar |
| GET | `/api/orders/:id` | Detalle de un pedido |
| GET | `/api/orders?email=...` | Pedidos de un cliente por email |
| PATCH | `/api/orders/:id/status` | Cambia el estado: `pending`, `paid`, `shipped`, `delivered`, `cancelled` |

## Ejemplo rápido con curl

```bash
CART_ID=$(uuidgen)

# Ver catálogo
curl http://localhost:3000/api/products

# Agregar al carrito
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" -H "x-cart-id: $CART_ID" \
  -d '{"productId":"mega-torre-bloques","quantity":2}'

# Ver carrito
curl http://localhost:3000/api/cart -H "x-cart-id: $CART_ID"

# Hacer checkout
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" -H "x-cart-id: $CART_ID" \
  -d '{"customerName":"Andrés","customerEmail":"andres@example.com","customerAddress":"Calle 10 #5-20, Bucaramanga"}'
```

## Estructura

```
src/models/                  Esquemas de Mongoose: Product, CartItem, Order
src/seed.ts                   Carga los 6 productos de ejemplo
src/app.ts                    Configuración de Express (CORS, helmet, rutas)
src/index.ts                  Punto de entrada (conecta a Mongo y levanta el servidor)
src/routes/                    Definición de rutas por recurso
src/controllers/               Validación de entrada (zod) + respuesta HTTP
src/services/                  Lógica de negocio + acceso a datos (Mongoose)
src/middleware/                requireCartId, manejo de errores
```

## Notas de diseño

- Los productos usan un **id de texto (slug)** en vez de un ObjectId autogenerado (p. ej. `"osito-suave"`), para que coincidan exactamente con las rutas del frontend Angular (`/producto/osito-suave`).
- El checkout no usa transacciones multi-documento de MongoDB (requieren replica set). Para producción sobre Atlas (que sí soporta transacciones) se podría envolver la creación del pedido y el vaciado del carrito en una sesión (`session.withTransaction`) si se necesita atomicidad estricta.

## Conectar con el frontend Angular

En el proyecto Angular, crea un `environment.ts` con `apiUrl: 'http://localhost:3000/api'`, genera/guarda un `cartId` en `localStorage` la primera vez, y reemplaza `ProductService`/`CartService` (los mocks en memoria) por llamadas `HttpClient` a estos endpoints, enviando siempre el header `x-cart-id`.

import 'dotenv/config';
import { createApp } from './app';
import { connectDB } from './lib/db';

const port = Number(process.env.PORT ?? 3000);

async function main() {
  await connectDB();

  const app = createApp();
  app.listen(port, () => {
    console.log(`Juguetón API (MongoDB) escuchando en http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('No se pudo iniciar el servidor:', err);
  process.exit(1);
});

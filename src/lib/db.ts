import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta la variable de entorno MONGODB_URI (revisa tu .env)');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('Conectado a MongoDB');

  mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
  });
}

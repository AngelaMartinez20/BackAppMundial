import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './logs/logger';
import morganMiddleware from './logs/morganMiddleware';

// ✅ Importar rutas existentes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin';
import cajeroRoutes from './routes/cajero';
import productosRoutes from './routes/productos.routes';
import carritoRoutes from './routes/carrito.routes';
import inventoryRoutes from './routes/inventory.routes'; // <-- ¡AÑADE ESTA LÍNEA!





// 📌 Cargar variables de entorno
dotenv.config();
logger.info("🔑 JWT_SECRET cargado:", { JWT_SECRET: process.env.JWT_SECRET ? "CARGADO" : "NO CONFIGURADO" });

// 📌 Verificar si JWT_SECRET está configurado
if (!process.env.JWT_SECRET) {
  throw new Error('❌ Falta configurar JWT_SECRET en el archivo .env');
}

// 📌 Crear la aplicación de Express
const app = express();
app.set('trust proxy', 1);

// ✅ Configuración de CORS (compatible con Android)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://frontend-1w8y.vercel.app',
  undefined // ← permite peticiones con Origin: null (apps Android o Postman)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido para este origen'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 📌 Middleware de Morgan
app.use(morganMiddleware);

// 📂 Servir archivos estáticos
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));
logger.info(`📂 Sirviendo archivos estáticos en: ${uploadsPath}`);

// 📦 Servir archivos de producción (si usas build de React)
app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'public')));

// 📄 Configurar vistas (si usas EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ✅ Registrar rutas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', cajeroRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/inventory', inventoryRoutes); // <-- ¡AÑADE ESTA LÍNEA!



// ✅ Nueva ruta del catálogo de productos

// 📌 Middleware global de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('❌ Error en el servidor:', err);
  res.status(500).send('⚠️ Algo salió mal. Por favor, intenta más tarde.');
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  logger.info(`🚀 Servidor corriendo en: ${serverUrl}`);
  logger.info(`📂 Archivos disponibles en: ${serverUrl}/uploads/`);
});
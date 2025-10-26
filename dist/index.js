"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./logs/logger"));
const morganMiddleware_1 = __importDefault(require("./logs/morganMiddleware"));
// ✅ Importar rutas existentes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_1 = __importDefault(require("./routes/admin"));
const reportesRoutes_1 = __importDefault(require("./routes/reportesRoutes"));
const cajero_1 = __importDefault(require("./routes/cajero"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const carrito_routes_1 = __importDefault(require("./routes/carrito.routes"));
// 📌 Cargar variables de entorno
dotenv_1.default.config();
logger_1.default.info("🔑 JWT_SECRET cargado:", { JWT_SECRET: process.env.JWT_SECRET ? "CARGADO" : "NO CONFIGURADO" });
// 📌 Verificar si JWT_SECRET está configurado
if (!process.env.JWT_SECRET) {
    throw new Error('❌ Falta configurar JWT_SECRET en el archivo .env');
}
// 📌 Crear la aplicación de Express
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// 📌 Configuración de CORS
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://frontend-1w8y.vercel.app'
    ],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 📌 Middleware de Morgan
app.use(morganMiddleware_1.default);
// 📂 Servir archivos estáticos
const uploadsPath = path_1.default.resolve(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
logger_1.default.info(`📂 Sirviendo archivos estáticos en: ${uploadsPath}`);
// 📦 Servir archivos de producción (si usas build de React)
app.use(express_1.default.static('dist'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// 📄 Configurar vistas (si usas EJS)
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// ✅ Registrar rutas
app.use('/auth', auth_routes_1.default);
app.use('/admin', admin_1.default);
app.use('/api', reportesRoutes_1.default);
app.use('/api', cajero_1.default);
app.use('/api/productos', productos_routes_1.default);
app.use('/api/carrito', carrito_routes_1.default);
// ✅ Nueva ruta del catálogo de productos
// 📌 Middleware global de errores
app.use((err, req, res, next) => {
    logger_1.default.error('❌ Error en el servidor:', err);
    res.status(500).send('⚠️ Algo salió mal. Por favor, intenta más tarde.');
});
// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    logger_1.default.info(`🚀 Servidor corriendo en: ${serverUrl}`);
    logger_1.default.info(`📂 Archivos disponibles en: ${serverUrl}/uploads/`);
});

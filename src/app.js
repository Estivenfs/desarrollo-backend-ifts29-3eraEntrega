import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import session from 'express-session';


// Importar middleware personalizado
import { requestLogger, errorHandler, notFound } from './middleware/index.js';

// Importar rutas
import routes from './routes/index.js';

// Obtener __dirname en ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear aplicación Express
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Configurar Pug como motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware básico
app.use(express.json()); // Parser para JSON
app.use(express.urlencoded({ extended: true })); // Parser para formularios
app.use(express.static(path.join(__dirname, 'public'))); // Archivos estáticos
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Cambiar a true si se usa HTTPS
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Middleware personalizado
app.use(requestLogger); // Logging de requests

// Rutas principales
app.use('/', routes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor después de conectar a la base de datos
(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📁 Estructura MVC configurada correctamente`);
            console.log(`🎨 Motor de vistas: Pug`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor debido a un error de conexión a la DB');
        process.exit(1);
    }
})();

export default app;
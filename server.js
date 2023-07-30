// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 3000;
const createDefaultAdmin = require('./utils/createDefaultAdmin');
require('dotenv').config();

// Conexión a MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

// Middleware para permitir solicitudes CORS desde http://localhost:3001
app.use(express.json());
app.use(cors());

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Algo salió mal' });
  console.log(err)
});
// Configuración del atributo SameSite para las cookies por que me daba error 
// Configuración del atributo SameSite para las cookies
app.use(cookieParser('NuevoMundo', {
  sameSite: 'None',
  secure: true,
}));
// Configuración del atributo SameSite para las cookies
app.use(cookieSession({
  name: 'session',
  secret: 'secret',
  sameSite: 'none',
  secure: true,
}));

// Rutas para usuarios
const userRoutes = require('./routes/rutaUsers');
const pendingUserRoutes = require('./routes/rutaPendingUser');
const openAIRoutes = require('./routes/rutaOpenAI');

app.use('/users', userRoutes);
app.use('/pending', pendingUserRoutes);
app.use('/openai', openAIRoutes);

// Método administrador predeterminado
createDefaultAdmin();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

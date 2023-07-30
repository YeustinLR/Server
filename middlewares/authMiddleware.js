// Middleware para verificar la validez del token de autorización
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autorización no proporcionado' });
  }

  try {
    const decodedToken = jwt.verify(token, 'mi_clave_secreta');
    req.userId = decodedToken.userId; 
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token de autorización inválido' });
  }
};

// Middleware para verificar si el usuario es un administrador
const isAdminMiddleware = async (req, res, next) => {
  try {
    // Buscar el usuario en la base de datos por su ID (req.userId)
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario es un administrador
    if (!user.esAdministrador) {
      return res.status(403).json({ error: 'Acceso denegado. No eres un administrador.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });

  }
};

module.exports = { authMiddleware, isAdminMiddleware };

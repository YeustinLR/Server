// routes/rutaUsers.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const {authMiddleware,isAdminMiddleware} = require('../middlewares/authMiddleware');

// Ruta para crear un nuevo usuario
router.post('/create',  authMiddleware,isAdminMiddleware,usersController.createUser);

// Ruta para eliminar usuario
router.delete('/delete/:UserId', authMiddleware,isAdminMiddleware,usersController.deleteUser);

// Ruta para obtener todos los usuarios
router.get('/', authMiddleware,isAdminMiddleware,usersController.getUsers);

// Ruta para actualizar un usuario
router.patch('/update/:userId', authMiddleware, isAdminMiddleware, usersController.updateUser);

/////////////////////////////////
/////////////////////////////////

// Ruta para obtener el perfil de usuario (protegida con middleware de autenticación)
router.get('/profile', authMiddleware, usersController.getUserProfile);

// Ruta para verificar la validez del token
router.get('/validateToken', authMiddleware, (req, res) => {
    res.json({ valid: true });
  });

// Ruta para el inicio de sesión
router.post('/login', usersController.loginUser);

module.exports = router;

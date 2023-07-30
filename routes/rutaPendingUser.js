// routes/rutaPendingUser.js
const express = require('express');
const router = express.Router();
const pendingUserController = require('../controllers/pendingUserController');
const { authMiddleware, isAdminMiddleware } = require('../middlewares/authMiddleware');

// Ruta para registrar un nuevo usuario pendiente
router.post('/register', pendingUserController.registerPendingUser);

// Ruta para que el administrador apruebe o rechace un usuario pendiente
router.post('/approve/:pendingUserId', authMiddleware,isAdminMiddleware, pendingUserController.approveUserRegistration);

// Ruta para que el administrador rechace un usuario pendiente
router.delete('/reject/:pendingUserId', authMiddleware,isAdminMiddleware, pendingUserController.rejectUserRegistration);

// Ruta para obtener usuarios pendiente
router.get('/pending',authMiddleware,isAdminMiddleware,pendingUserController.getPendingUsers);


module.exports = router;

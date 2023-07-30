// controllers/pendingUserController.js
const bcrypt = require('bcrypt');
const PendingUser = require('../models/PendingUser');
const User = require('../models/User');

exports.registerPendingUser = async (req, res) => {
  const { nombre, nombreUsuario, correoElectronico, contrasena } = req.body;

  try {
    // Verificar si el correo electrónico ya está registrado en la colección de usuarios aprobados
    const existingUser = await User.findOne({ correoElectronico });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Verificar si el correo electrónico ya está registrado en la colección de usuarios pendientes
    const existingPendingUser = await PendingUser.findOne({ correoElectronico });
    if (existingPendingUser) {
      return res.status(409).json({ error: 'El correo electrónico ya está pendiente de aprobación' });
    }

    // Encriptar la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear un nuevo usuario pendiente con la contraseña encriptada
    const newPendingUser = await PendingUser.create({
      nombre,
      nombreUsuario,
      correoElectronico,
      contrasena: hashedPassword,
      esAdministrador: false, // Establecer esAdministrador como false automáticamente
    });

    res.status(201).json({ user: newPendingUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveUserRegistration = async (req, res) => {
  const { pendingUserId } = req.params;

  try {
    // Verificar si el usuario pendiente existe en la base de datos
    const pendingUser = await PendingUser.findById(pendingUserId);
    if (!pendingUser) {
      return res.status(404).json({ error: 'Usuario pendiente no encontrado' });
    }

    // Verificar si el usuario ya ha sido aprobado previamente
    const existingUser = await User.findOne({ correoElectronico: pendingUser.correoElectronico });
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya ha sido aprobado previamente' });
    }

    // Crear un nuevo usuario aprobado en el modelo principal de usuarios
    await User.create({
      nombre: pendingUser.nombre,
      nombreUsuario: pendingUser.nombreUsuario,
      correoElectronico: pendingUser.correoElectronico,
      contrasena: pendingUser.contrasena,
      esAdministrador: pendingUser.esAdministrador,
    });
    // Eliminar el usuario pendiente de la colección de usuarios pendientes
    await pendingUser.deleteOne();

    res.json({ message: 'Registro aprobado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.rejectUserRegistration = async (req, res) => {
  const { pendingUserId } = req.params;

  try {
    // Verificar si el usuario pendiente existe en la base de datos
    const pendingUser = await PendingUser.findById(pendingUserId);
    if (!pendingUser) {
      return res.status(404).json({ error: 'Usuario pendiente no encontrado' });
    }

    // Eliminar el usuario pendiente de la colección de usuarios pendientes
    await pendingUser.deleteOne();

    res.json({ message: 'Usuario pendiente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await PendingUser.find();
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//imports
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const PendingUser = require('../models/PendingUser');

//                                                                           //
//--------------------------------------------------------------------------//
// Controlador para obtener todos los usuarios

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//                                                                           //
//--------------------------------------------------------------------------//
// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { nombre,nombreUsuario, correoElectronico, contrasena, esAdministrador } = req.body;

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

    // Crear un nuevo usuario con la contraseña encriptada
    const newUser = await User.create({
      nombre,
      nombreUsuario,
      correoElectronico,
      contrasena: hashedPassword,
      esAdministrador,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//                                                                           //
//--------------------------------------------------------------------------//
// Controlador para iniciar sesión
exports.loginUser = async (req, res) => {
  const { correoElectronico, contrasena } = req.body;

  try {
    // Buscar el usuario en la base de datos por correoElectronico
    const user = await User.findOne({ correoElectronico });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña encriptada almacenada en la base de datos con la contraseña proporcionada
    const isPasswordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Si las contraseñas coinciden, generar un token JWT y devolverlo al cliente
    const token = jwt.sign({ userId: user._id }, 'mi_clave_secreta', { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//                                                                           //
//--------------------------------------------------------------------------//
// Controlador para obtener datos del usuario registrado y mostrarlos en el dashboard
exports.getUserProfile = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado desde el token en el encabezado de autorización
    const userId = req.userId; // El valor `userId` se define en el middleware de autenticación

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver todos los datos del perfil del usuario
    res.json({
      nombre: user.nombre,
      nombreUsuario: user.nombreUsuario,
      esAdministrador: user.esAdministrador,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//                                                                           //
//--------------------------------------------------------------------------//
// Controlador para eliminar datos del usuario registrado y mostrarlos en el dashboard
exports.deleteUser = async (req, res) => {
  try {
    const { UserId } = req.params; // Corrección del acceso al parámetro

    // Verificar si el usuario existe en la base de datos
    const user = await User.findById(UserId); // Corrección del uso del parámetro
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la base de datos
    await user.deleteOne();

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar un usuario
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { nombre, nombreUsuario, correoElectronico, esAdministrador } = req.body;

  try {
    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el correo electrónico ya está registrado en la colección de usuarios aprobados
    const existingUser = await User.findOne({ correoElectronico });
    // Verificar si el correo electrónico ya está registrado en la colección de usuarios pendientes
    const existingPendingUser = await PendingUser.findOne({ correoElectronico });

    // Permitir actualizar el usuario con el mismo correo electrónico siempre que el ID sea igual
    if (
      (existingUser && existingUser._id.toString() !== userId) ||
      (existingPendingUser && existingPendingUser._id.toString() !== userId)
    ) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Actualizar los campos del usuario
    user.nombre = nombre;
    user.nombreUsuario = nombreUsuario;
    user.correoElectronico = correoElectronico;
    user.esAdministrador = esAdministrador;

    // Guardar los cambios en la base de datos
    await user.save();

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
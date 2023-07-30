const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  nombre: String,
  nombreUsuario: String,
  correoElectronico: String,
  contrasena: String,
  esAdministrador: Boolean,
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  nombreUsuario: String,
  correoElectronico: String,
  contrasena: String,
  esAdministrador: Boolean,
});

module.exports = mongoose.model('User', userSchema);

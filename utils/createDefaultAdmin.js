const bcrypt = require('bcrypt');
const User = require('../models/User');
//////////////////////////////////////////////////////////////////////////////////////////////
// Función para crear el usuario administrador predeterminado si no existe
async function createDefaultAdmin() {
    try {
      const adminData = {
        nombre: 'Yeustin_LR',
        nombreUsuario: 'ISW',
        correoElectronico: 'admin@gmail.com',
        contrasena: 'admin', 
        esAdministrador: true,
      };
  
      const existingAdmin = await User.findOne({ correoElectronico: adminData.correoElectronico });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminData.contrasena, 10);
        await User.create({
          ...adminData,
          contrasena: hashedPassword,
        });
      } 
    } catch (error) {
      console.error('Error al crear el usuario administrador predeterminado:', error);
    }
  }

module.exports = createDefaultAdmin;
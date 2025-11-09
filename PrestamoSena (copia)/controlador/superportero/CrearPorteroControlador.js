import CrearPorteroModelo from '../../modelo/superportero/CrearPorteroModelo.js';

class CrearPorteroControlador {
  // Método para crear un nuevo portero
  async crearPortero(req, res) {
    const { documento, nombres, telefono, correopersonal, contrasena } = req.body;

    // Validación básica (puedes mejorarla)
    if (!documento || !nombres || !correopersonal || !contrasena) {
      return res.status(400).json({
        error: 'Los campos documento, nombres, correo y contraseña son obligatorios.'
      });
    }

    try {
      // Llama al método estático del modelo para crear el portero (con bcrypt)
      const porteroCreado = await CrearPorteroModelo.crear(
        documento,
        nombres,
        telefono,
        correopersonal,
        contrasena
      );

      // Eliminamos la contraseña del objeto antes de enviarlo (buena práctica)
      const { contrasena: _, ...porteroSeguro } = porteroCreado;

      return res.status(201).json({
        mensaje: 'Portero creado exitosamente',
        portero: porteroSeguro
      });

    } catch (error) {
      // Detectar errores comunes (ej. violación de unicidad)
      if (error.message.includes('duplicate key') || error.message.includes('llave duplicada')) {
        return res.status(409).json({
          error: 'El documento o correo ya están registrados.'
        });
      }

      console.error('Error en crearPortero:', error);
      return res.status(500).json({
        error: 'Error interno al crear el portero.'
      });
    }
  }
}

// Exportamos una instancia única del controlador (opcional, pero común en POO + Express)
export default new CrearPorteroControlador();
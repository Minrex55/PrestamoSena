import ActualizarInvitadoModelo from "../../modelo/Invitado/ActualizarInvitadoModelo.js"
import bcrypt from "bcrypt"

class ActualizarInvitadoControlador {
    constructor() {
        if (ActualizarInvitadoControlador.instance) {
            return ActualizarInvitadoControlador.instance
        }

        ActualizarInvitadoControlador.instance = this;
    }

    async actualizarInvitado(req, res) {
        const { idinvitado } = req.params;
        const { t1: documento, t2: nombres, t3: telefono, t4: correo, t5:contrasena } = req.body;
    
        if (!documento?.trim() || !nombres?.trim() || !telefono?.trim() || !correo?.trim() || !contrasena) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }       
    
        if (!/^\d{8,10}$/.test(documento.trim())) {
            return res.status(400).json({ mensaje: 'El documento debe contener entre 8 y 10 números' });
        }

        const validacionNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!validacionNombre.test(nombres.trim())) {
            return res.status(400).json({ mensaje: 'Los nombres solo deben contener letras y espacios' });
        }

        if (!/^\d{7,15}$/.test(telefono.trim())) {
            return res.status(400).json({ mensaje: 'El teléfono debe contener entre 7 y 15 números' });
        }

        const validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validacionCorreo.test(correo.trim())) {
            return res.status(400).json({ mensaje: 'El correo es inválido' });
        }

        const validacionContrasena = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
        if (!validacionContrasena.test(contrasena)) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un carácter especial' });
        }

        const validacionInvitado = await ActualizarInvitadoModelo.validacionInvitado(documento, correo, telefono)
        if (validacionInvitado) {
            return res.status(400).json({mensaje: "El invitado con ese documento, correo o telefono ya existe"})
        }
        
        try {

            const saltRounds = 10;
            const hash = await bcrypt.hash(contrasena, saltRounds)
            
            const invitado = {
                documento,
                nombres,
                telefono,
                correo,
                contrasena: hash
            }
            
            const invitadoActualizado = await ActualizarInvitadoModelo.actualizarInvitado(idinvitado, invitado);
    
            if (!invitadoActualizado) {
                return res.status(404).json({ mensaje: 'Invitado no encontrado' });
            }
                res.status(200).json({
                    mensaje: "Invitado actualizado correctamente",
                    invitadoActualizado
                });
            } catch (error) {
                console.error('Error al actualizar el invitado', error);
                res.status(500).json({ mensaje: 'Error al actualizar el invitado' });
        }
    }
}

export default new ActualizarInvitadoControlador();
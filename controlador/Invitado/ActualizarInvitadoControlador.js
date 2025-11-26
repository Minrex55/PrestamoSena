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
    
        if (!documento || !nombres || !telefono || !correo || !contrasena) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }
    
        if (documento.length !== 10) {
            return res.status(400).json({ mensaje: 'El documento es inválido, debe contener 10 números' });
        }

        if (!/^\d+$/.test(documento)) {
            return res.status(400).json({ mensaje: 'El documento solo debe contener números' });
        }

        const validacionNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!validacionNombre.test(nombres)) {
            return res.status(400).json({ mensaje: 'Los nombres no deben contener numeros ni caracteres especiales' });
        }

        if (!/^\d{7,15}$/.test(telefono)) {
            return res.status(400).json({ mensaje: 'El teléfono debe contener solo números' });
        }

        if (!correo.includes('@')) {
            return res.status(400).json({ mensaje: 'El correo es inválido' });
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
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
                res.status(200).json({
                    mensaje: "Invitado actualizado correctamente",
                    invitadoActualizado
                });
            } catch (error) {
                console.error('Error al editar el invitado', error);
                res.status(500).json({ mensaje: 'Error al editar el invitado' });
        }
    }
}

export default new ActualizarInvitadoControlador();
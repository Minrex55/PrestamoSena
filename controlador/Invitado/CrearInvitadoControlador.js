import CrearInvitadoModelo from "../../modelo/Invitado/CrearInvitadoModelo.js";
import bcrypt from "bcrypt"

class CrearInvitadoControlador {
    constructor() {
        if (CrearInvitadoControlador.instance) {
            return CrearInvitadoControlador.instance;
        }

        CrearInvitadoControlador.instance = this;
    }

    async crearInvitado(req, res) {
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
            return res.status(400).json({ mensaje: 'Los nombres no deben contener números ni caracteres especiales' });
        }

        if (!/^\d{7,15}$/.test(telefono)) {
            return res.status(400).json({ mensaje: 'El teléfono debe contener solo números' });
        }

        if (!correo.includes('@')) {
            return res.status(400).json({ mensaje: 'El correo es inválido' });
        }

        const validacionInvitado = await CrearInvitadoModelo.validacionInvitado(documento, correo, telefono);
        if (validacionInvitado) {
            return res.status(409).json({mensaje: 'El usuario con ese documento, correo o telefono ya existe'})
        }

        try {

            const saltRounds = 10;
            const hash = await bcrypt.hash(contrasena, saltRounds);

            const invitado = { 
                documento, 
                nombres, 
                telefono, 
                correo, 
                contrasena: hash 
            };

            const invitadoCreado = await CrearInvitadoModelo.crearInvitado(invitado);
            res.status(201).json({
                mensaje: "Invitado creado correctamente",
                invitadoCreado
            });
        } catch (error) {
            console.error('Error al crear el invitado', error);
            res.status(500).json({ mensaje: 'Error al crear el invitado' });
        }
    }
}

export default new CrearInvitadoControlador();
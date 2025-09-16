const Invitado = require('../modelo/InvitadoModelo');

const InvitadoControlador = {
    async buscarId(req, res) {
        const {id} = req.params;
        try {
            const invitadoModelo = new Invitado();
            const invitado = await invitadoModelo.buscarId(id);

            if (!invitado || invitado.length === 0) {
                return res.status(404).json({mensaje: 'Usuario no encontrado'});
            }
            res.status(209).json(invitado[0]);
        }catch(error){
            console.error('Error al obtener el usuario por ID', error);
            res.status(500).json({mensaje: 'Error al obtener el usuario'});
        }
    }
}

module.exports = InvitadoControlador;
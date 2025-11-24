import LoginInvitadoModelo from "../../modelo/Invitado/LoginInvitadoModelo.js";

class LoginInvitadoControlador {
    async login(req, res) {
        const {correopersonal, contrasena} = req.body;

        try {
            const invitado = await LoginInvitadoModelo.login(correopersonal, contrasena);
            return res.status(200).json({
                mensaje: 'Iniciio de sesión exitoso',
                invitado
            });
        }catch(error) {
            return res.status(401).json({error: error.message});
        }
    }
}

export default new LoginInvitadoControlador();
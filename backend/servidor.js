import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import InvitadoRutas from "./vista/Invitado/InvitadoRutas.js";
import LoginInvitadoRutas from "./vista/Invitado/LoginInvitadoRutas.js";
import PorteroRutas from  "./vista/Portero/PorteroRutas.js"
import LoginPorteroRutas from "./vista/Portero/LoginPorteroRutas.js";
import AdministradorRutas from "./vista/Administrador/AdministradorRutas.js";
import LoginAdministradorRutas from "./vista/Administrador/LoginAdministradorRutas.js";

configDotenv();

class Servidor {
    constructor() {
        if (Servidor.instance) {
            return Servidor.instance;
        }

        this.app = express();
        this.configurarMiddlewares();
        this.configurarRutas();

        Servidor.instance = this;
    }

    configurarMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true}));
    }

    configurarRutas() {
        this.app.use('/invitado', InvitadoRutas);
        this.app.use('/logininvitado', LoginInvitadoRutas);
        this.app.use('/portero', PorteroRutas);
        this.app.use('/loginportero', LoginPorteroRutas);
        this.app.use('/admin', AdministradorRutas);
        this.app.use('/loginadmin', LoginAdministradorRutas);
    }

    iniciar() {
        const PORT = process.env.PORT;
        this.app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    }
}

const servidor = new Servidor();
servidor.iniciar();
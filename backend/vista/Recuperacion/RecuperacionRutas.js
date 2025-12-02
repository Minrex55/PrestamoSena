import { Router } from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"; // <--- Importamos bcrypt
import pool from "../../modelo/bd/Conexion.js"; 

const router = Router();

// Almacén temporal en memoria
const codigosTemporales = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. ENVIAR CÓDIGO
router.post('/enviar-codigo', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email requerido" });

    try {
        // Verificamos si existe en la tabla 'invitado' columna 'correopersonal'
        const existe = await pool.query('SELECT correopersonal FROM invitado WHERE correopersonal = $1', [email]);
        
        if (existe.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Este correo no está registrado como Invitado." });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        codigosTemporales[email] = codigo;

        await transporter.sendMail({
            from: '"Soporte IngreSENA" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: "Código de Recuperación - IngreSENA",
            html: `
                <div style="font-family: Arial; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <h2 style="color: #333;">Recuperación de Contraseña</h2>
                        <p>Tu código de verificación es:</p>
                        <h1 style="color: #39a900; letter-spacing: 5px; font-size: 32px;">${codigo}</h1>
                        <small>Este código es válido mientras el servidor esté activo.</small>
                    </div>
                </div>
            `
        });
        res.json({ success: true, message: "Código enviado" });

    } catch (error) {
        console.error("Error al enviar código:", error);
        res.status(500).json({ success: false, message: "Error interno al enviar correo" });
    }
});

// 2. VERIFICAR CÓDIGO
router.post('/verificar-codigo', (req, res) => {
    const { email, codigo } = req.body;
    
    // Verificamos que exista el código y coincida
    if (codigosTemporales[email] && codigosTemporales[email] === codigo) {
        res.json({ success: true, message: "Código correcto" });
    } else {
        res.json({ success: false, message: "Código incorrecto" });
    }
});

// 3. CAMBIAR CONTRASEÑA (CON BCRYPT)
router.post('/cambiar-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    try {
        // --- AQUÍ APLICAMOS BCRYPT ---
        const saltRounds = 10; // Número de vueltas de encriptación (estándar es 10)
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizamos la base de datos usando la contraseña ENCRIPTADA
        const query = `
            UPDATE invitado 
            SET contrasena = $1 
            WHERE correopersonal = $2
        `;
        
        // Pasamos 'hashedPassword' en lugar de 'newPassword'
        const values = [hashedPassword, email];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            delete codigosTemporales[email]; // Borramos el código usado por seguridad
            res.json({ success: true, message: "Contraseña actualizada con éxito" });
        } else {
            res.status(404).json({ success: false, message: "No se encontró el usuario para actualizar" });
        }

    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

export default router;
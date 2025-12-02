document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SEGURIDAD: Verificar que sea Portero
    const token = localStorage.getItem('token');
    const rolLogueado = localStorage.getItem('rol');

    if (!token || rolLogueado !== 'Portero') {
        // Si no es portero, lo mandamos al inicio o a su panel correspondiente
        window.location.href = 'login.html'; 
        return;
    }

    // 2. OBTENER PARAMETROS DE URL (ID DEL EQUIPO)
    const params = new URLSearchParams(window.location.search);
    const idEquipo = params.get('id'); 

    if (!idEquipo) {
        alert("Error: No se ha seleccionado un equipo.");
        window.location.href = 'portero.html';
        return;
    }

    // 3. REFERENCIAS AL DOM
    const modeloInput = document.getElementById('modelo');
    const serialInput = document.getElementById('serial');
    const idInvitadoInput = document.getElementById('idinvitado');
    const estadoSelect = document.getElementById('estado');
    const form = document.getElementById('editEquipoForm');

    // Sidebar Toggle (Mismo comportamiento)
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // 4. CARGAR DATOS DEL EQUIPO (GET)
    const BASE_URL = "http://localhost:3333"; 

    try {
        // Asegúrate que esta ruta apunte a tu 'ObtenerEquipoControlador.obtenerEquipoPorId'
        const urlFetch = `${BASE_URL}/portero/equipo/buscar/${idEquipo}`;

        const respuesta = await fetch(urlFetch, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!respuesta.ok) {
            if (respuesta.status === 404) throw new Error("Equipo no encontrado.");
            throw new Error("Error obteniendo datos del equipo.");
        }

        // 1. Obtenemos la respuesta completa del backend
        const respuestaJson = await respuesta.json(); 

        // 2. Extraemos el objeto real del equipo
        // Tu controlador devuelve: { mensaje: '...', equipoObtenidoPorId: { ... } }
        const equipo = respuestaJson.equipoObtenidoPorId;

        console.log("Datos del equipo:", equipo); // Verifica en consola que aquí están los datos

        if (equipo) {
            // 3. Rellenamos los inputs (Mapeo BD -> Input ID)
            
            modeloInput.value = equipo.modelo || '';
            
            // OJO: En tu HTML el ID es 'serial', pero en la BD es 'numerodeserie'
            serialInput.value = equipo.numerodeserie || ''; 
            
            idInvitadoInput.value = equipo.idinvitado || '';
            
            // Asegúrate que la BD devuelva 'Activo' o 'Inactivo' tal cual está en el <option>
            estadoSelect.value = equipo.estado || ''; 
        }

    } catch (error) {
        console.error("Error cargando equipo:", error);
        alert(error.message);
        window.location.href = 'portero.html';
    }

    // 5. ENVIAR CAMBIOS (PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Preparar objeto para el controlador de ACTUALIZAR
        // IMPORTANTE: Ajusta las claves (modelo, serial, etc) 
        // si tu backend espera t1, t2, t3 como en el ejemplo anterior.
        
           // Si tu backend sigue la lógica de t1, t2, etc., descomenta esto y comenta lo anterior:
           const datosBackend = {
               t1: modeloInput.value,
               t2: serialInput.value,
               t3: idInvitadoInput.value,
               t4: estadoSelect.value
           };
        

        try {
            // ASUNCIÓN: Tu backend tiene una ruta para actualizar equipos
            const urlUpdate = `${BASE_URL}/portero/equipo/actualizar/${idEquipo}`;

            const response = await fetch(urlUpdate, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datosBackend)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Equipo actualizado exitosamente.");
                window.location.href = 'portero.html';
            } else {
                alert(`Error: ${result.mensaje || "No se pudo actualizar el equipo"}`);
            }

        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error de conexión con el servidor.");
        }
    });
});
const apiURL = 'http://localhost:3000/porteros';
  const tabla = document.getElementById('tabla-porteros');
  const modal = document.getElementById('modal');
  const tituloModal = document.getElementById('modal-titulo');

  let modo = 'crear';
  let porteroEditando = null;
  async function cargarPorteros() {
    tabla.innerHTML = '';
    const res = await fetch(apiURL);
    const porteros = await res.json();

    porteros.forEach(portero => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${portero.idportero}</td>
        <td>${portero.documento}</td>
        <td>${portero.nombres}</td>
        <td>${portero.telefono}</td>
        <td>${portero.correopersonal}</td>
        <td>${portero.contrasena}</td>
        <td>${portero.rol}</td>
        <td>
          <button class="btn-editar" onclick="abrirModalEditar(${portero.idportero})">✏️</button>
          <button class="btn-eliminar" onclick="eliminarPortero(${portero.idportero})">🗑️</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  function abrirModalCrear() {
    modo = 'crear';
    porteroEditando = null;
    tituloModal.textContent = 'Crear Portero';
    limpiarFormulario();
    modal.style.display = 'flex';
  }

  async function abrirModalEditar(id) {
    modo = 'editar';
    const res = await fetch(`${apiURL}/${id}`);
    const portero = await res.json();
    porteroEditando = id;

    tituloModal.textContent = 'Editar Portero';
    document.getElementById('documento').value = portero.documento;
    document.getElementById('nombres').value = portero.nombres;
    document.getElementById('telefono').value = portero.telefono;
    document.getElementById('correopersonal').value = portero.correopersonal;
    document.getElementById('contrasena').value = portero.contrasena;
    document.getElementById('rol').value = portero.rol;

    modal.style.display = 'flex';
  }

  function cerrarModal() {
    modal.style.display = 'none';
  }

  function limpiarFormulario() {
    document.getElementById('documento').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correopersonal').value = '';
    document.getElementById('contrasena').value = '';
    document.getElementById('rol').value = '';
  }

  async function guardarPortero() {
  const documento = document.getElementById('documento').value;
  const nombres = document.getElementById('nombres').value;
  const telefono = document.getElementById('telefono').value;
  const correopersonal = document.getElementById('correopersonal').value;
  const contrasena = document.getElementById('contrasena').value;
  const rol = document.getElementById('rol').value;

  const datos = {
    t1: documento,
    t2: nombres,
    t3: telefono,
    t4: correopersonal,
    t5: contrasena,
    t6: rol
  };

  if (modo === 'crear') {
    await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  } else if (modo === 'editar') {
    await fetch(`${apiURL}/${porteroEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)  // <== USAMOS MISMA ESTRUCTURA
    });
  }

  cerrarModal();
  cargarPorteros();
}

async function eliminarPortero(id) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este portero?');
    if (!confirmar) return;

    await fetch(`${apiURL}/${id}`, {
      method: 'DELETE'
    });

    cargarPorteros();
  }

  // Inicializa
  cargarPorteros();
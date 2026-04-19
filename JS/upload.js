// -------------------- USA SPRING BOOT PARA EL BACKEND --------------------
// const apiBase = 'http://localhost:8080';
// const propertyForm = document.getElementById('propertyForm');
// const successMessage = document.getElementById('successMessage');
// const errorMessage = document.getElementById('errorMessage');
// const logoutButton = document.getElementById('logoutButton');

// function parseServicios(value) {
//   const trimmed = value.trim();
//   if (!trimmed) {
//     return null;
//   }

//   try {
//     const parsed = JSON.parse(trimmed);
//     return parsed;
//   } catch (e) {
//     return trimmed.split(',').map(item => item.trim()).filter(Boolean);
//   }
// }

// function requireAuth() {
//   const token = localStorage.getItem('supabaseToken');
//   if (!token) {
//     window.location.href = 'register.html';
//     return null;
//   }
//   return token;
// }

// logoutButton.addEventListener('click', () => {
//   localStorage.removeItem('supabaseToken');
//   window.location.href = 'register.html';
// });

// propertyForm.addEventListener('submit', async event => {
//   event.preventDefault();
//   successMessage.style.display = 'none';
//   errorMessage.style.display = 'none';

//   const token = requireAuth();
//   if (!token) {
//     return;
//   }

//   const payload = {
//     titulo: document.getElementById('titulo').value.trim(),
//     subtitulo: document.getElementById('subtitulo').value.trim(),
//     transaccion: document.getElementById('transaccion').value,
//     precio: Number(document.getElementById('precio').value),
//     tipoPropiedad: document.getElementById('tipoPropiedad').value.trim(),
//     terreno: Number(document.getElementById('terreno').value) || null,
//     construccion: Number(document.getElementById('construccion').value) || null,
//     ocupacion: document.getElementById('ocupacion').value.trim() || null,
//     pago: document.getElementById('pago').value.trim() || null,
//     descripcion: document.getElementById('descripcion').value.trim() || null,
//     maps_url: document.getElementById('maps_url').value.trim() || null,
//     video: document.getElementById('video').value.trim() || null,
//     servicios: parseServicios(document.getElementById('servicios').value),
//     recamaras: Number(document.getElementById('recamaras').value) || null,
//     banos: Number(document.getElementById('banos').value) || null,
//     carros: Number(document.getElementById('carros').value) || null
//   };

//   try {
//     const response = await fetch(`${apiBase}/api/propiedades`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(payload)
//     });

//     const result = await response.json();
//     if (!response.ok) {
//       errorMessage.textContent = result.error || 'No se pudo enviar la propiedad. Revisa tu sesión.';
//       errorMessage.style.display = 'block';
//       return;
//     }

//     successMessage.textContent = 'Propiedad enviada correctamente a Supabase. Puedes subir más.';
//     successMessage.style.display = 'block';
//     propertyForm.reset();
//   } catch (error) {
//     errorMessage.textContent = 'Error al comunicarse con el backend. Intenta más tarde.';
//     errorMessage.style.display = 'block';
//     console.error(error);
//   }
// });


// -------------------- USA SUPABASE PARA EL BACKEND --------------------
const propertyForm = document.getElementById('propertyForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const logoutButton = document.getElementById('logoutButton');

function parseServicios(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed.split(',').map(item => item.trim()).filter(Boolean);
  }
}

// 🔐 Verificar sesión con Supabase
async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = 'register.html';
    return null;
  }
  return user;
}

// 🚪 Logout correcto
logoutButton.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'register.html';
});

propertyForm.addEventListener('submit', async event => {
  event.preventDefault();

  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  // Verificar autenticación antes de enviar
const user = await requireAuth();
  if (!user) return;

  const imageInput = document.getElementById('imagenes');
  const files = imageInput.files;

  let imageUrls = [];

for (let file of files) {
  const fileName = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('propiedades')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error subiendo imagen:', uploadError);
    continue;
  }

  const { data } = supabase.storage
    .from('propiedades')
    .getPublicUrl(fileName);

  imageUrls.push(data.publicUrl);
}

function toFloat(value) {
  if (value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

  const payload = {
    titulo: document.getElementById('titulo').value.trim(),
    subtitulo: document.getElementById('subtitulo').value.trim(),
    transaccion: document.getElementById('transaccion').value,
    precio: Number(document.getElementById('precio').value),
    tipoPropiedad: document.getElementById('tipoPropiedad').value.trim(),
    // terreno: parseFloat(document.getElementById('terreno').value) || null,
    // construccion: parseFloat(document.getElementById('construccion').value) || null,
    terreno: toFloat(document.getElementById('terreno').value),
    construccion: toFloat(document.getElementById('construccion').value),
    ocupacion: document.getElementById('ocupacion').value.trim() || null,
    pago: document.getElementById('pago').value.trim() || null,
    descripcion: document.getElementById('descripcion').value.trim() || null,
    maps_url: document.getElementById('maps_url').value.trim() || null,
    video: document.getElementById('video').value.trim() || null,
    servicios: parseServicios(document.getElementById('servicios').value),
    recamaras: Number(document.getElementById('recamaras').value) || null,
    banos: Number(document.getElementById('banos').value) || null,
    carros: Number(document.getElementById('carros').value) || null,
    images: imageUrls
  };

  try {
    const { data, error } = await supabase
      .from('propiedades')
      .insert([payload]);

    if (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
      return;
    }

    successMessage.textContent = 'Propiedad enviada correctamente 🚀';
    successMessage.style.display = 'block';
    propertyForm.reset();

  } catch (error) {
    errorMessage.textContent = 'Error inesperado.';
    errorMessage.style.display = 'block';
    console.error(error);
  }
});


// -------------------- LÓGICA DE TABS PARA CAMBIAR ENTRE ELLOS --------------------
const tabs = document.querySelectorAll("#menuTabs button");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {

        // quitar active de botones
        tabs.forEach(t => t.classList.remove("active"));

        // ocultar contenido
        contents.forEach(c => c.classList.add("d-none"));

        // activar el seleccionado
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.remove("d-none");
      });
    });


// -------------------- LÓGICA PARA CARGAR PROPIEDADES DESDE BACKEND O JSON LOCAL --------------------
async function loadProperties() {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById('propertyList');
  container.innerHTML = '';

  data.forEach(prop => {
    const card = document.createElement('div');
    card.className = 'col-md-4';

    card.innerHTML = `
      <div class="card shadow-sm h-100" style="cursor:pointer;">
        <div class="card-body">
          <h5>${prop.titulo}</h5>
          <p>$${prop.precio}</p>
          <small>${prop.tipoPropiedad}</small>
        </div>
      </div>
    `;

    // CLICK → cargar datos para editar
    card.addEventListener('click', () => loadPropertyToEdit(prop));

    container.appendChild(card);
  });
}

  // -------------------- LÓGICA PARA CARGAR DATOS DE PROPIEDADES DESDE BACKEND O JSON LOCAL (CON FALLO CONTROLADO) --------------------
function loadPropertyToEdit(prop) {
  document.getElementById('editSection').classList.remove('d-none');

  document.getElementById('editId').value = prop.id;
  document.getElementById('editTitulo').value = prop.titulo;
  document.getElementById('editSubtitulo').value = prop.subtitulo;
  document.getElementById('editTransaccion').value = prop.transaccion;
  document.getElementById('editPrecio').value = prop.precio;
  document.getElementById('editTipoPropiedad').value = prop.tipoPropiedad;
  document.getElementById('editTerreno').value = prop.terreno;
  document.getElementById('editConstruccion').value = prop.construccion;
  document.getElementById('editOcupacion').value = prop.ocupacion;
  document.getElementById('editPago').value = prop.pago;
  document.getElementById('editDescripcion').value = prop.descripcion;
  document.getElementById('editGoogleMaps').value = prop.maps_url;
  document.getElementById('editVideos').value = prop.video;
  document.getElementById('editServicios').value = prop.servicios;
  document.getElementById('editRecamaras').value = prop.recamaras;
  document.getElementById('editBanos').value = prop.banos;
  document.getElementById('editCarros').value = prop.carros;
}

  // -------------------- ACTUALIZAR PROPIEDAD --------------------
  document.getElementById('updateBtn').addEventListener('click', async () => {
  const id = document.getElementById('editId').value;

  const updates = {
    titulo: document.getElementById('editTitulo').value,
    subtitulo: document.getElementById('editSubtitulo').value,
    transaccion: document.getElementById('editTransaccion').value,
    precio: Number(document.getElementById('editPrecio').value),
    tipoPropiedad: document.getElementById('editTipoPropiedad').value,
    terreno: Number(document.getElementById('editTerreno').value),
    construccion: Number(document.getElementById('editConstruccion').value),
    ocupacion: document.getElementById('editOcupacion').value,
    pago: document.getElementById('editPago').value,
    descripcion: document.getElementById('editDescripcion').value,
    maps_url: document.getElementById('editGoogleMaps').value,
    video: document.getElementById('editVideos').value,
    servicios: document.getElementById('editServicios').value,
    recamaras: Number(document.getElementById('editRecamaras').value),
    banos: Number(document.getElementById('editBanos').value),
    carros: Number(document.getElementById('editCarros').value)
  };

  const { error } = await supabase
    .from('propiedades')
    .update(updates)
    .eq('id', id);

  if (error) {
    alert('Error al actualizar');
    console.error(error);
    return;
  }

    alert('Propiedad actualizada ✅');
    loadProperties();
  });

   // ---------- BORRAR PROPIEDAD ----------
   document.getElementById('deleteBtn').addEventListener('click', async () => {
  const id = document.getElementById('editId').value;

  const confirmDelete = confirm('¿Seguro que quieres borrar esta propiedad?');
  if (!confirmDelete) return;

  const { error } = await supabase
    .from('propiedades')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error al borrar');
    console.error(error);
    return;
  }

    alert('Propiedad eliminada 🗑️');

    document.getElementById('editSection').classList.add('d-none');
    loadProperties();
  });


   // ------------ CARGAR PROPIEDADES AL ENTRAR AL TAB ------------
   tabs.forEach(tab => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.add("d-none"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.remove("d-none");

      // 👇 IMPORTANTE
      if (tab.dataset.tab === "editar") {
        loadProperties();
      }
    });
  });

  const id = document.getElementById('editId').value;
  console.log("ID a actualizar:", id);
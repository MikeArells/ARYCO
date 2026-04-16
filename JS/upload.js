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

  const payload = {
    titulo: document.getElementById('titulo').value.trim(),
    subtitulo: document.getElementById('subtitulo').value.trim(),
    transaccion: document.getElementById('transaccion').value,
    precio: Number(document.getElementById('precio').value),
    tipoPropiedad: document.getElementById('tipoPropiedad').value.trim(),
    terreno: parseFloat(document.getElementById('terreno').value) || null,
    construccion: parseFloat(document.getElementById('construccion').value) || null,
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
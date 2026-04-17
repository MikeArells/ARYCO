
//-------------------------AUTH CON SPRINGBOOT----------------------------
// const apiBase = 'http://localhost:8080';
// const loginForm = document.getElementById('loginForm');
// const loginError = document.getElementById('loginError');

// loginForm.addEventListener('submit', async event => {
//   event.preventDefault();
//   loginError.style.display = 'none';

//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;

//   try {
//     const response = await fetch(`${apiBase}/api/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ email, password })
//     });

//     const result = await response.json();
//     if (!response.ok) {
//       loginError.textContent = result.error || 'Error de autenticación. Verifica tus credenciales.';
//       loginError.style.display = 'block';
//       return;
//     }

//     if (result.access_token) {
//       localStorage.setItem('supabaseToken', result.access_token);
//       window.location.href = 'upload.html';
//       return;
//     }

//     loginError.textContent = 'No se recibió token de autenticación. Intenta de nuevo.';
//     loginError.style.display = 'block';
//   } catch (error) {
//     loginError.textContent = 'Error en el servidor. Verifica que el backend esté activo en http://localhost:8080 y vuelve a intentarlo.';
//     loginError.style.display = 'block';
//     console.error('Login failed:', error);
//   }
// });


//----------------------------------------------------------
// const apiBase = 'http://localhost:8080';
// const loginForm = document.getElementById('loginForm');
// const loginError = document.getElementById('loginError');

// loginForm.addEventListener('submit', async event => {
//   event.preventDefault();
//   loginError.style.display = 'none';

//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;



//--------------------- ULTIMO ----------------------
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginError.style.display = 'none';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginError.textContent = error.message;
    loginError.style.display = 'block';
    return;
  }

  
  window.location.href = 'upload.html';
});



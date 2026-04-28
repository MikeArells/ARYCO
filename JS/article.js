
// const params = new URLSearchParams(window.location.search);
// const articleId = params.get("id");

// fetch("../JSON/news.json")
// .then(response => response.json())
// .then(data => {

//     const article = data.news.find(n => n.id == articleId);

//     if(!article){
//         console.error("Artículo no encontrado");
//         return;
//     }

//     document.getElementById("title").textContent = article.title;
//     document.getElementById("category").textContent = article.category;
//     document.getElementById("image").src = "../" + article.image;
//     document.getElementById("content").textContent = article.content;

//     //----------- HACE QUE CADA RENGLON SEA UN SALTO EN EL CONTENT -------------

// const container = document.querySelector(".articleContent");
//     container.innerHTML = "";

//     article.content.forEach(parrafo => {
//         const p = document.createElement("p");
//         p.textContent = parrafo;
//         container.appendChild(p);
//     });

// });

//     //-------------  CALCULAR LA FECHA -------------

// const nombreDia = new Intl.DateTimeFormat('es-MX', { weekday: 'long' });
// const nombreMes = new Intl.DateTimeFormat('es-MX', { month: 'long' });

// function capitalizar(str) {
// return str.charAt(0).toUpperCase() + str.slice(1);
// }

// function actualizarFecha() {
// const d = new Date();
// const diaSemana = capitalizar(nombreDia.format(d)); // Lunes
// const mes = capitalizar(nombreMes.format(d));       // Marzo
// const dia = d.getDate();                            // 9
// const anio = d.getFullYear();                       // 2026

// document.getElementById('fecha').textContent = `${diaSemana}, ${mes} ${dia}, ${anio}`;
// }

// actualizarFecha();
// // Si solo es fecha, no necesitas intervalos; si la página estará mucho tiempo abierta, podrías
// // re-evaluarla a medianoche con un setTimeout calculado, pero para la mayoría de casos no hace falta.


// // NAV HAMBURGER

// const hamburger = document.getElementById("hamburger");  //buscamos en HTML elemento hamburges
// const navWrapper = document.getElementById("nav-wrapper");

// hamburger.addEventListener("click", () => {  //“Cuando el usuario haga click en el botón hamburguesa…”
//     navWrapper.classList.toggle("active");     //Si nav-wrapper NO tiene la clase active → la agrega, Si SÍ la tiene → la quita
// });


// ------------------ OBTENER ID DE LA URL ------------------
const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

// ------------------ CARGAR DESDE SUPABASE ------------------
async function cargarArticulo() {

    const supabase = window.supabase;

    const { data: article, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', articleId)
        .single();

    if (error || !article) {
        console.error("Artículo no encontrado", error);
        return;
    }

    // console.log(article); // 👈 DEBUG

    // ------------------ RENDER ------------------

    document.getElementById("title").textContent = article.title;
    document.getElementById("category").textContent = article.category;
    document.getElementById("author").textContent = article.author;
    document.getElementById("date").textContent = new Date(article.created_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const authorElement = document.getElementById("author");
    // const authorName = article.author; // o lo que venga de tu backend

    if (article.author) {
        authorElement.textContent = "Por " + article.author;
    }

    // 🔥 Manejo de imagen (string o jsonb)
    let imageUrl = "";

    if (Array.isArray(article.newsImage)) {
        imageUrl = article.newsImage[0];
    } else if (typeof article.newsImage === "string") {
        imageUrl = article.newsImage;
    }

document.getElementById("image").src = imageUrl;

    // ------------------ CONTENIDO ------------------

    const container = document.querySelector(".articleContent");
    container.innerHTML = "";

    // 👇 soporta string o array (por si cambias estructura)
    if (Array.isArray(article.content)) {
        article.content.forEach(parrafo => {
            const p = document.createElement("p");
            p.textContent = parrafo;
            container.appendChild(p);
        });
    } else {
        container.innerHTML = `<p>${article.content}</p>`;
    }
}

cargarArticulo();


// ------------------ DATE TOP ------------------
const nombreDia = new Intl.DateTimeFormat('es-MX', { weekday: 'long' });
const nombreMes = new Intl.DateTimeFormat('es-MX', { month: 'long' });

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function actualizarFecha() {
    const d = new Date();
    const diaSemana = capitalizar(nombreDia.format(d));
    const mes = capitalizar(nombreMes.format(d));
    const dia = d.getDate();
    const anio = d.getFullYear();

    document.getElementById('fecha').textContent =
        `${diaSemana}, ${mes} ${dia}, ${anio}`;
}

actualizarFecha();

// ------------------ LOAD POPULAR ARTICLES IN SIDEBAR ------------------
async function cargarPopulares() {
    const supabase = window.supabase;

    const { data: populares, error } = await supabase
        .from('news')
        .select('*')
        // .order('views', { ascending: false }) // 👈 los más vistos
        .order('created_at', { ascending: false })
        .limit(4);

    const container = document.getElementById("popularContainer");

    container.innerHTML = "";

    populares.forEach(item => {
        container.innerHTML += `
            <a class="editorItem" href='/Blog/article.html?id=${item.id}' >
                <img src="${item.newsImage}">
                <h4>${item.title}</h4>
            </a>
        `;
    });
}

cargarPopulares();

// Si quieres que cada artículo popular sea clickeable y lleve a su detalle:
// populares.forEach(item => {
//     container.innerHTML += `
//         <a class="editorItem" onclick="window.location.href='detalle.html?id=${item.id}'">
//             <img src="${item.newsImage}">
//             <h4>${item.title}</h4>
//         </a>
//     `;
// });


// ------------------ NAV HAMBURGER ------------------
const hamburger = document.getElementById("hamburger");
const navWrapper = document.getElementById("nav-wrapper");

hamburger.addEventListener("click", () => {
    navWrapper.classList.toggle("active");
});
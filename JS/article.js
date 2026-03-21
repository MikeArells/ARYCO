
const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

fetch("../JSON/news.json")
.then(response => response.json())
.then(data => {

    const article = data.news.find(n => n.id == articleId);

    if(!article){
        console.error("Artículo no encontrado");
        return;
    }

    document.getElementById("title").textContent = article.title;
    document.getElementById("category").textContent = article.category;
    document.getElementById("image").src = "../" + article.image;
    document.getElementById("content").textContent = article.content;

    //----------- HACE QUE CADA RENGLON SEA UN SALTO EN EL CONTENT -------------

const container = document.querySelector(".articleContent");
    container.innerHTML = "";

    article.content.forEach(parrafo => {
        const p = document.createElement("p");
        p.textContent = parrafo;
        container.appendChild(p);
    });

});

    //-------------  CALCULAR LA FECHA -------------

const nombreDia = new Intl.DateTimeFormat('es-MX', { weekday: 'long' });
const nombreMes = new Intl.DateTimeFormat('es-MX', { month: 'long' });

function capitalizar(str) {
return str.charAt(0).toUpperCase() + str.slice(1);
}

function actualizarFecha() {
const d = new Date();
const diaSemana = capitalizar(nombreDia.format(d)); // Lunes
const mes = capitalizar(nombreMes.format(d));       // Marzo
const dia = d.getDate();                            // 9
const anio = d.getFullYear();                       // 2026

document.getElementById('fecha').textContent = `${diaSemana}, ${mes} ${dia}, ${anio}`;
}

actualizarFecha();
// Si solo es fecha, no necesitas intervalos; si la página estará mucho tiempo abierta, podrías
// re-evaluarla a medianoche con un setTimeout calculado, pero para la mayoría de casos no hace falta.


// NAV HAMBURGER

const hamburger = document.getElementById("hamburger");  //buscamos en HTML elemento hamburges
const navWrapper = document.getElementById("nav-wrapper");

hamburger.addEventListener("click", () => {  //“Cuando el usuario haga click en el botón hamburguesa…”
    navWrapper.classList.toggle("active");     //Si nav-wrapper NO tiene la clase active → la agrega, Si SÍ la tiene → la quita
});

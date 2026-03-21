fetch("../JSON/news.json")
.then(response => response.json())
.then(data => {

    const recentContainer = document.querySelector(".recentNews");
    const featuredContainer = document.querySelector(".featuredNews");
    const trendsContainer = document.querySelector(".trends");

    // con esto recorremos todas las noticias
    data.news.forEach(article => {

        // -------------------------
        // NOTICIA DESTACADA
        // -------------------------
        if(article.featured){

            featuredContainer.innerHTML = `
                <a href="article.html?id=${article.id}" class="newsLink">
                    <img class="featPhoto" src="${article.image}" alt="${article.title}">
                    <span class="category">${article.category}</span>
                    <h4>${article.title}</h4>
                    <p>${article.summary}</p>
                </a>
            `;

        }

        // -------------------------
        // NOTICIAS RECIENTES
        // -------------------------
        const newsLink = document.createElement("a");

        newsLink.href = `article.html?id=${article.id}`;
        newsLink.classList.add("newsLink");

        newsLink.innerHTML = `
            <div class="newsItem">
                <span class="category">${article.category}</span>
                <h5 class="title">${article.title}</h5>
                <span class="author">${article.readTime}</span>
            </div>
        `;

        recentContainer.appendChild(newsLink);


        // -------------------------
        // TENDENCIAS
        // -------------------------
        if(article.trending){

            const trendItem = document.createElement("a");

            trendItem.href = `article.html?id=${article.id}`;
            trendItem.classList.add("newsLink");

            trendItem.innerHTML = `
                <div class="newsItem">
                    <span class="category">${article.category}</span>
                    <h5>${article.title}</h5>
                    <span class="author">${article.readTime}</span>
                </div>
            `;

            trendsContainer.appendChild(trendItem);
        }

    });

})
.catch(err => console.error("Error cargando noticias:", err));


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



// fetch("../JSON/news.json")
// .then(response => response.json())
// .then(data => {

//     const recentContainer = document.querySelector(".recentNews");
//     const featuredContainer = document.querySelector(".featuredNews");
//     const trendsContainer = document.querySelector(".trends");

//     // con esto recorremos todas las noticias
//     data.news.forEach(article => {

//         // -------------------------
//         // NOTICIA DESTACADA
//         // -------------------------
//         if(article.featured){

//             featuredContainer.innerHTML = `
//                 <a href="article.html?id=${article.id}" class="newsLink">
//                     <img class="featPhoto" src="${article.image}" alt="${article.title}">
//                     <span class="category">${article.category}</span>
//                     <h4>${article.title}</h4>
//                     <p>${article.summary}</p>
//                 </a>
//             `;
//             featuredRendered = true;
//         }

//         // -------------------------
//         // NOTICIAS RECIENTES
//         // -------------------------
//         if(article.recent){
            
//             const newsLink = document.createElement("a");

//             newsLink.href = `article.html?id=${article.id}`;
//             newsLink.classList.add("newsLink");

//             newsLink.innerHTML = `
//                 <div class="newsItem">
//                     <span class="category">${article.category}</span>
//                     <h6 class="title">${article.title}</h6>
//                     <span class="author">${article.readTime}</span>
//                 </div>
//             `;

//             recentContainer.appendChild(newsLink);
//         }

//         // -------------------------
//         // TENDENCIAS
//         // -------------------------
//         if(article.trending){

//             const trendItem = document.createElement("a");

//             trendItem.href = `article.html?id=${article.id}`;
//             trendItem.classList.add("newsLink");

//             trendItem.innerHTML = `
//                 <div class="newsItem">
//                     <span class="category">${article.category}</span>
//                     <h6>${article.title}</h6>
//                     <span class="author">${article.readTime}</span>
//                 </div>
//             `;

//             trendsContainer.appendChild(trendItem);
//         }

//     });

//         // -------------------------
//         // 4 CARDS DEBAJO DE FEATURED
//         // -------------------------
//     const featuredCards = data.news
//     .filter(a => !a.featured) // que no sea la grande
//     .slice(0, 4); // solo 4

//     const cardsContainer = document.createElement("div");
//     cardsContainer.classList.add("cards-container");

//     featuredCards.forEach(article => {

//         const card = document.createElement("a");
//         card.href = `article.html?id=${article.id}`;
//         card.classList.add("card", "newsLink");

//         card.innerHTML = `
//             <img src="${article.image}" alt="${article.title}">
//             <div class="card-content">
//                 <span class="category">${article.category}</span>
//                 <h5>${article.title}</h5>
//             </div>
//         `;

//         cardsContainer.appendChild(card);
//     });

//     // 👇 IMPORTANTE: se agrega debajo, no reemplaza
//     featuredContainer.appendChild(cardsContainer);

// })
// .catch(err => console.error("Error cargando noticias:", err));



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


  //----------------- NAV HAMBURGER -------------------
const hamburger = document.getElementById("hamburger");  //buscamos en HTML elemento hamburges
const navWrapper = document.getElementById("nav-wrapper");

hamburger.addEventListener("click", () => {  //“Cuando el usuario haga click en el botón hamburguesa…”
    navWrapper.classList.toggle("active");     //Si nav-wrapper NO tiene la clase active → la agrega, Si SÍ la tiene → la quita
});

//----------------- GENERAR DATOS DESDE SUPABASE -------------------
async function cargarNoticias() {

    const supabase = window.supabase;

    const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    
    const recentContainer = document.querySelector(".recentNews");
    const featuredContainer = document.querySelector(".featuredNews");
    const trendsContainer = document.querySelector(".trends");
    const moreContainer = document.querySelector(".moreNews");

    console.log({
        recentContainer,
        featuredContainer,
        trendsContainer,
        moreContainer
    });

    // 🔥 separar por categoría
    const noticias = news.filter(n => n.category?.toLowerCase() === "noticias");
    const tendencias = news.filter(n => n.category?.toLowerCase() === "tendencias");

    // 🔥 límites
    const topNoticias = noticias.slice(0, 6);
    const topTendencias = tendencias.slice(0, 6);

    const moreNews = [
        ...noticias.slice(6),
        ...tendencias.slice(6)
    ];

    // -------------------------
    // 🥇 FEATURED
    // -------------------------
    const featured = news[0];

    if (featured) {
        let imageUrl = Array.isArray(featured.newsImage)
            ? featured.newsImage[0]
            : featured.newsImage;

        featuredContainer.innerHTML = `
            <a href="/blog/${featured.id}" class="newsLink">
                <img class="featPhoto" src="${imageUrl}" alt="${featured.title}">
                <span class="category">${featured.category}</span>
                <h4>${featured.title}</h4>
                <p>${featured.summary}</p>
            </a>
        `;
    }

    // -------------------------
    // 🟦 4 CARDS
    // -------------------------
    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cards-container");

    news.slice(1, 5).forEach(article => {

        let imageUrl = Array.isArray(article.newsImage)
            ? article.newsImage[0]
            : article.newsImage;

        const card = document.createElement("a");
        card.href = `/blog/${article.id}`;
        card.classList.add("card", "newsLink");

        card.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}">
            <div class="card-content">
                <span class="category">${article.category}</span>
                <h5>${article.title}</h5>
            </div>
        `;

        cardsContainer.appendChild(card);
    });

    featuredContainer.appendChild(cardsContainer);

    // -------------------------
    // 📰 NOTICIAS (máx 6)
    // -------------------------
    topNoticias.forEach(article => {
        const el = document.createElement("a");

        el.href = `/blog/${article.id}`;
        el.classList.add("newsLink");

        el.innerHTML = `
            <div class="newsItem">
                <span class="category">${article.category}</span>
                <h6>${article.title}</h6>
                <span>${article.readTime} min${article.readTime == 1 ? '' : 's'} lectura</span>
            </div>
        `;

        recentContainer.appendChild(el);
    });

    // -------------------------
    // 📈 TENDENCIAS (máx 6)
    // -------------------------
    topTendencias.forEach(article => {
        const el = document.createElement("a");

        el.href = `/blog/${article.id}`;
        el.classList.add("newsLink");

        el.innerHTML = `
            <div class="newsItem">
                <span class="category">${article.category}</span>
                <h6>${article.title}</h6>
                <span>${article.readTime} min${article.readTime == 1 ? '' : 's'} lectura</span>
            </div>
        `;

        trendsContainer.appendChild(el);
    });

    // -------------------------
    // 🧾 MORE NEWS
    // -------------------------
    moreNews.forEach(article => {

        let imageUrl = Array.isArray(article.newsImage)
            ? article.newsImage[0]
            : article.newsImage;

        const item = document.createElement("a");
        item.href = `/blog/${article.id}`;
        item.classList.add("newsLink");

        item.innerHTML = `
            <div class="moreItem">
                <img src="${imageUrl}">
                <div>
                    <span class="category">${article.category}</span>
                    <h5>${article.title}</h5>
                </div>
            </div>
        `;

        moreContainer.appendChild(item);
        
    });
}

document.addEventListener("DOMContentLoaded", cargarNoticias);



app.get('/article/:id', async (req, res) => {
  const article = await getArticle(req.params.id);

  res.send(`
    <html>
            <head>
                <meta property="og:title" content="${article.title}">
                <meta property="og:description" content="${article.content.substring(0, 150)}...">
                <meta property="og:image" content="${article.newsImage}">
                <meta property="og:url" content="https://aryco-eta.vercel.app/blog/${article.id}">
            </head>
            <body>
                <script>window.location="/blog/${article.id}"</script>
            </body>
    </html>
  `);
});

    

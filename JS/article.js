// obtener el id desde la URL
// const params = new URLSearchParams(window.location.search);
// const articleId = params.get("id");

// fetch("../JSON/news.json")
// .then(response => response.json())
// .then(data => {

//     const article = data.news.find(n => n.id == articleId);

//     document.getElementById("title").textContent = article.title;
//     document.getElementById("summary").textContent = article.summary;
//     document.getElementById("category").textContent = article.category;
//     document.getElementById("image").src = "../" + article.image;

// });

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
    document.getElementById("summary").textContent = article.summary;
    document.getElementById("category").textContent = article.category;
    document.getElementById("image").src = "../" + article.image;

});
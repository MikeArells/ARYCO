// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_PUBLISHABLE_KEY
// );

// export default async function handler(req, res) {

//   const { id } = req.query;

//   const { data: article, error } = await supabase
//     .from('news')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (error || !article) {
//     return res.status(404).send('Artículo no encontrado');
//   }

//   // Si newsImage es array, toma la primera
//   const imageUrl = Array.isArray(article.newsImage)
//     ? article.newsImage[0]
//     : article.newsImage;

//   res.setHeader('Content-Type', 'text/html');

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="es">
//     <head>

//       <title>${article.title}</title>

//       <meta property="og:title" content="${article.title}">
//       <meta property="og:description" content="${article.summary || ''}">
//       <meta property="og:image" content="${imageUrl}">
//       <meta property="og:url" content="https://aryco-eta.vercel.app/api/article?id=${article.id}">
//       <meta property="og:type" content="article">

//       <meta name="twitter:card" content="summary_large_image">

         
//     </head>

//     <body>
//       Redireccionando...

//         <script>
//             window.location.href="/Blog/article.html?id=${article.id}";
//         </script>  
//     </body>
//     </html>
//   `);
// }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  const { data: article, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !article) {
    return res.status(404).send('Artículo no encontrado');
  }

  // Si newsImage es array, toma la primera
  const imageUrl = Array.isArray(article.newsImage)
    ? article.newsImage[0]
    : article.newsImage;

  // Renderizar contenido
  let contentHtml = '';
  if (Array.isArray(article.content)) {
    contentHtml = article.content.map(parrafo => `<p>${parrafo}</p>`).join('');
  } else {
    contentHtml = `<p>${article.content}</p>`;
  }

  res.setHeader('Content-Type', 'text/html; charset=UTF-8');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${article.title}</title>
      <meta name="description" content="${article.summary || ''}" />
      <link rel="canonical" href="https://aryco-eta.vercel.app/Blog/article.html?id=${article.id}" />
      <meta property="og:title" content="${article.title}">
      <meta property="og:description" content="${article.summary || ''}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:url" content="https://aryco-eta.vercel.app/Blog/article.html?id=${article.id}">
      <meta property="og:type" content="article">
      <meta property="og:site_name" content="ARYCO">
      <meta name="twitter:card" content="summary_large_image">
    </head>
    <body>
      <h1>${article.title}</h1>
      ${contentHtml}
      <img src="${imageUrl}" alt="${article.title}">
    </body>
    </html>
  `);
}
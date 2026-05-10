import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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

  res.setHeader('Content-Type', 'text/html');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>

      <title>${article.title}</title>

      <meta property="og:title" content="${article.title}">
      <meta property="og:description" content="${article.summary || ''}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:url" content="https://aryco-eta.vercel.app/api/article?id=${article.id}">
      <meta property="og:type" content="article">

      <meta name="twitter:card" content="summary_large_image">

      <meta http-equiv="refresh" content="0; url=/Blog/article.html?id=${article.id}" />

    </head>

    <body>
      Redireccionando...
    </body>
    </html>
  `);
}
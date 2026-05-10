// import { createClient } from '@supabase/supabase-js'
// import fs from 'fs'

// // 🔐 Tus credenciales
// const supabaseUrl = 'https://qsnvxoqvmrjvbhxmatmn.supabase.co'
// const supabaseKey = 'sb_publishable_mGnB9Dpli9e1t4VADpXutQ_jTOUuyOl'

// const supabase = createClient(supabaseUrl, supabaseKey)

// async function generate() {

//   const { data: articles, error } = await supabase
//     .from('news')
//     .select('*')

//   if (error) {
//     console.error(error)
//     return
//   }

//   articles.forEach(article => {

//     const fileName = `blog/${article.slug}.html`

//     const html = `
//         <!DOCTYPE html>
//         <html lang="es">
//         <head>
//         <meta charset="UTF-8">

//         <!-- 🔥 OPEN GRAPH (CLAVE PARA FACEBOOK) -->
//         <meta property="og:title" content="${article.title}">
//         <meta property="og:description" content="${article.content.substring(0, 150)}...">
//         <meta property="og:image" content="${article.newsImage}">
//         <meta property="og:url" content="https://arycobr.com/blog/${article.slug}.html">
//         <meta property="og:type" content="article">

//         <title>${article.title}</title>
//         </head>

//         <body>

//         <h1>${article.title}</h1>
//         <img src="${article.image}" style="max-width:600px;">
//         <p>${article.content}</p>

//         </body>
//         </html>
//             `

//     fs.writeFileSync(fileName, html)
//     console.log(`✅ Generado: ${fileName}`)
//   })
// }

// generate()
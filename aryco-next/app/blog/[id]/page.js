// import { supabase } from '../../../lib/supabase'

// export async function generateMetadata({ params }) {

//   const resolvedParams = await params

//   const { data: article } = await supabase
//     .from('news')
//     .select('*')
//     .eq('id', Number(resolvedParams.id))
//     .single()

//   if (!article) {
//     return {
//       title: 'Artículo no encontrado',
//     }
//   }

//   return {
//     title: article.title,

//     description:
//       article.summary ||
//       article.content?.slice(0, 120),

//     openGraph: {
//       title: article.title,

//       description:
//         article.summary || '',

//       images: [article.newsImage],

//       type: 'article',
//     },
//   }
// }

// export default async function ArticlePage({ params }) {

//   const resolvedParams = await params

//   console.log(resolvedParams.id)

//   const { data: article, error } = await supabase
//     .from('news')
//     .select('*')
//     .eq('id', Number(resolvedParams.id))
//     .single()

//   console.log(article)
//   console.log(error)

//   if (error || !article) {
//     return (
//       <main className="p-10">
//         <h1>Artículo no encontrado</h1>
//       </main>
//     )
//   }

// //   return (
//     // <main className="max-w-4xl mx-auto p-8">

//     //   <span className="text-blue-600 font-semibold">
//     //     {article.category}
//     //   </span>

//     //   <h1 className="text-5xl font-bold mt-4 mb-6">
//     //     {article.title}
//     //   </h1>

//     //   <p className="text-gray-500 mb-6">
//     //     Por {article.author}
//     //   </p>

//     //   <img
//     //     src={article.newsImage}
//     //     alt={article.title}
//     //     className="w-full rounded-2xl mb-8"
//     //   />

//     //   <div className="text-lg leading-8 whitespace-pre-line">
//     //     {article.content}
//     //   </div>

//     // </main>
//     return (
//         <>

//             {/* NAVBAR */}

//             <section id="navbar" className="gradient-background">
//             <div className="container">

//                 <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3">

//                 <ul className="nav col-6 col-md-auto mb-2 justify-content-center mb-md-0">

//                     <li>
//                     <a
//                         href="https://aryco-eta.vercel.app/comprar.html"
//                         className="nav-link px-5 text-white"
//                     >
//                         Comprar
//                     </a>
//                     </li>

//                     <li>
//                     <a
//                         href="https://aryco-eta.vercel.app/rentar.html"
//                         className="nav-link px-5 text-white"
//                     >
//                         Rentar
//                     </a>
//                     </li>

//                     <li>
//                     <a
//                         href="https://aryco-eta.vercel.app/vender.html"
//                         className="nav-link px-5 text-white"
//                     >
//                         Vender
//                     </a>
//                     </li>

//                 </ul>

//                 </header>

//             </div>
//             </section>

//             {/* ARTÍCULO */}

//             <main className="max-w-4xl mx-auto p-5">

//             <span className="text-primary fw-bold">
//                 {article.category}
//             </span>

//             <h1 className="display-4 fw-bold mt-3 mb-4">
//                 {article.title}
//             </h1>

//             <p className="text-secondary mb-4">
//                 Por {article.author}
//             </p>

//             <img
//                 src={article.newsImage}
//                 alt={article.title}
//                 className="img-fluid rounded mb-5"
//             />

//             <div
//                 style={{
//                 fontSize: '1.2rem',
//                 lineHeight: '2rem',
//                 whiteSpace: 'pre-line'
//                 }}
//             >
//                 {article.content}
//             </div>

//             {/* CTA */}

//             <div className="mt-5 p-5 border rounded text-center">

//                 <h2>
//                 ¿Buscas propiedades en Aguascalientes?
//                 </h2>

//                 <p>
//                 Explora nuestras mejores opciones disponibles.
//                 </p>

//                 <a
//                 href="https://aryco-eta.vercel.app/comprar.html"
//                 className="btn btn-primary btn-lg"
//                 >
//                 Ver propiedades
//                 </a>

//             </div>

//             </main>

//         </>
// )
// //   )
// }

import { createClient } from '@supabase/supabase-js'
import '../../blog.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata({ params }) {

  const resolvedParams = await params

  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('id', Number(resolvedParams.id))
    .single()

  if (!article) {
    return {
      title: 'Artículo no encontrado'
    }
  }

  return {
    title: article.title,
    description: article.summary,

    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.newsImage],
      url: `https://aryco-eta.vercel.app/blog/${article.id}`,
      type: 'article'
    }
  }
}

export default async function ArticlePage({ params }) {

  const resolvedParams = await params

  const { data: article, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', Number(resolvedParams.id))
    .single()

  if (error || !article) {
    return (
      <main>
        <h1>Artículo no encontrado</h1>
      </main>
    )
  }

  return (

    <>
    
      {/* NAVBAR */}

      <section id="navbar" className="gradient-background">
        <div className="container">

          <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3">

            <ul className="nav col-6 col-md-auto mb-2 justify-content-center mb-md-0">

              <li>
                <a href="https://aryco-eta.vercel.app/comprar.html" className="nav-link px-5 text-white">
                  Comprar
                </a>
              </li>

              <li>
                <a href="https://aryco-eta.vercel.app/rentar.html" className="nav-link px-5 text-white">
                  Rentar
                </a>
              </li>

              <li>
                <a href="https://aryco-eta.vercel.app/vender.html" className="nav-link px-5 text-white">
                  Vender
                </a>
              </li>

            </ul>

            <div className="logo">
              <a href="https://aryco-eta.vercel.app/index.html">
                <img
                  src="https://aryco-eta.vercel.app/Material/Arellano$cia.jpg"
                  alt="Logo"
                  className="logo"
                />
              </a>
            </div>

            <ul className="nav col-6 col-md-auto mb-2 justify-content-center mb-md-0">

              <li>
                <a href="/blog" className="nav-link px-5 text-white">
                  Blog
                </a>
              </li>

              <li>
                <a href="https://aryco-eta.vercel.app/nosotros.html" className="nav-link px-5 text-white">
                  Nosotros
                </a>
              </li>

            </ul>

          </header>
        </div>
      </section>

      {/* ARTÍCULO */}

      <div className="containerNews">

        <div className="ArticuloRow3">

          <div className="articleContainer">

            <article className="articleMain">

              <span className="articleCategory">
                {article.category}
              </span>

              <a
                target="_blank"
                className="shareBtn"
                href={`https://www.facebook.com/sharer/sharer.php?u=https://aryco-eta.vercel.app/blog/${article.id}`}
              >
                Facebook
              </a>

              <h1 className="articleTitle">
                {article.title}
              </h1>

              <div className="articleMeta">

                <span>
                  Por {article.author}
                </span>

                <br />

                <span>
                  {new Date(article.created_at).toLocaleDateString('es-MX')}
                </span>

              </div>

              <img
                src={article.newsImage}
                className="articleImage"
                alt={article.title}
              />

              <div className="articleContent">
                <p>{article.content}</p>
              </div>

            </article>

          </div>

        </div>

      </div>

    </>
  )
}
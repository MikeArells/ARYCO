// Detecta si estamos en index.html o property.html
const params = new URLSearchParams(window.location.search);
const propertyId = params.get('id');

//fetch sirve para conectar js con el archivo json
fetch('JSON/properties.json')
  .then(response => response.json())
  .then(properties => {
    if (propertyId) {
      // Página de 
        //title
      const property = properties.find(p => p.id == propertyId);
      if (property) {
        document.querySelector('.titleName').textContent = property.titleName;

        document.querySelector('.subtitle').textContent = property.subtitle;
        
        // Cambiar tipo de transacción
        document.querySelector('.tipoTransaction').textContent = property.tipoTransaction;

        // Cambiar precio
        document.querySelector('.price').textContent = property.price;

        // Cambiar tipo de propiedad
        document.querySelector('.TipoProperty').textContent = property.TipoProperty;

        // Cambiar el terreno
        document.querySelector('.ground').textContent = property.ground;

        // Cambiar el construcción
        document.querySelector('.construction').textContent = property.construction;

        // Cambiar Entrega
        document.querySelector('.ocupation').textContent = property.ocupation;

        // Cambiar Entrega
        document.querySelector('.payment').textContent = property.payment;

        // Cambiar servicios
        document.querySelector('.servicios').textContent = property.servicios;

        // Cambiar caracteristicas
        //document.querySelector('.features').textContent = property.features;

        
        document.querySelector('.recamaras').textContent = property.recamaras;
        document.querySelector('.banos').textContent = property.banos;
        document.querySelector('.carros').textContent = property.carros;

        
        // Cambiar description
        document.querySelector('.description').innerHTML = property.description;

        
        // Insertar mapa dinámicamente
          const mapContainer = document.querySelector('.map-container');
          mapContainer.innerHTML = `
            <iframe src="${property.map}" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            `;

          // Insertar video TikTok embebido
        const videoContainer = document.querySelector('.video-container');
        
        // Asegurarse de que el contenedor tenga un tamaño
        videoContainer.style.minHeight = "325px";  // Se establece un tamaño mínimo para asegurar que ocupe espacio

        // Limpiar el contenedor antes de insertar el nuevo contenido
        videoContainer.innerHTML = '';

        // Crear el bloque del video
        const blockquote = document.createElement('blockquote');
        blockquote.classList.add('tiktok-embed');
        blockquote.setAttribute('cite', property.video);
        blockquote.setAttribute('data-video-id', property.video.split('/').pop());
        blockquote.setAttribute('style', 'max-width: 605px; min-width: 325px;');

        // Agregar contenido dentro del blockquote (si lo deseas, puedes incluir más detalles)
        const section = document.createElement('section');
        section.innerHTML = `
            <a target="_blank" title="@mikearells" href="https://www.tiktok.com/@mikearells?refer=embed">@mikearells</a>
            Casa en venta en el Ojocaliente 1, en Aguascalientes. Tu próxima gran inversión está con nosotros, no esperes más.
        `;
        blockquote.appendChild(section);

        // Insertar el blockquote en el contenedor
        videoContainer.appendChild(blockquote);

        // Cargar el script de TikTok dinámicamente después de insertar el video
        const script = document.createElement('script');
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

          
       //--------  IMAGENES  --------- 
    // const gallery = document.querySelector('.galeria');
    // gallery.innerHTML = property.images
    //   .map((img, index) => `<a href="#image${index + 1}"><img src="Material/${img}" alt=""></a>`)
    //   .join('');

          //------------ IMAGES  -----------------

          // IMÁGENES (galería)
      const visor = document.querySelector('.visor');
      const miniaturas = document.querySelector('.miniaturas');

      // Limpiar contenido previo
      visor.innerHTML = '';
      miniaturas.innerHTML = '';

      // Generar imágenes grandes
      property.images.forEach((img, index) => {
        const figure = document.createElement('figure');
        figure.id = `image${index + 1}`;
        figure.innerHTML = `<img src="Material/${img}" alt="Foto ${index + 1}">`;
        visor.appendChild(figure);

        // Generar miniatura
        const a = document.createElement('a');
        a.href = `#image${index + 1}`;
        a.innerHTML = `<img src="Material/${img}" alt="Miniatura ${index + 1}">`;
        miniaturas.appendChild(a);
      });

      // Generar lightbox dinámico
const gridItem = document.querySelector('.grid-item:last-child'); // donde están los <article>
gridItem.innerHTML += property.images
  .map((img, index) => {
    const prevIndex = index === 0 ? property.images.length : index;
    const nextIndex = index + 2 > property.images.length ? 1 : index + 2;
    return `
      <article class="light-box" id="image${index + 1}">
        <a href="#image${prevIndex}" class="next">
          <i class="fa-solid fa-arrow-left"></i>
        </a>
        <img src="Material/${img}" alt="${property.title}">
        <a href="#image${nextIndex}" class="next">
          <i class="fa-solid fa-arrow-right"></i>
        </a>
        <a href="#" class="close">X</a>
      </article>
    `;
  })
  .join('');

    } else {
    document.querySelector('.titleName').textContent = 'Propiedad no encontrada';
      }
    }
  });


  // NAV HAMBURGER

    const hamburger = document.getElementById("hamburger");  //buscamos en HTML elemento hamburges
    const navWrapper = document.getElementById("nav-wrapper");

    hamburger.addEventListener("click", () => {  //“Cuando el usuario haga click en el botón hamburguesa…”
      navWrapper.classList.toggle("active");     //Si nav-wrapper NO tiene la clase active → la agrega, Si SÍ la tiene → la quita
    });

    
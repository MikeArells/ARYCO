// Detecta si estamos en index.html o property.html
const params = new URLSearchParams(window.location.search);
const propertyId = params.get('id');
// window.apiPropertiesUrl = 'http://localhost:8080/api/propiedades';

function normalizeProperty(property) {
  return {
    id: property.id || property.ID || 0,
    titleName: property.titulo || property.titleName || '',
    subtitle: property.subtitulo || property.subtitle || '',
    tipoTransaction: property.transaccion || property.tipoTransaction || '',
    price: property.precio !== undefined ? formatPrice(property.precio) : property.price || '',
    TipoProperty: property.tipoPropiedad || property.TipoProperty || '',
    ground: property.terreno || property.ground || '',
    construction: property.construccion || property.construction || '',
    ocupation: property.ocupacion || property.ocupation || '',
    payment: property.pago || property.payment || '',
    servicios: property.servicios || property.servicios || '',
    recamaras: property.recamaras || property.recamaras || 0,
    banos: property.banos || property.banos || 0,
    carros: property.carros || property.carros || 0,
    //images: property.images || ['imgHero1.jpeg'],
    images: Array.isArray(property.images) ? property.images : ['imgHero1.jpeg'],
    map: property.maps_url || property.map || '',
    video: property.video || '',
    descripcion: property.descripcion || ''
  };
}

function formatPrice(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number') {
    return '$' + value.toLocaleString('es-MX');
  }
  return value;
}

// async function fetchProperties() {
//   try {
//     const response = await fetch(apiPropertiesUrl);
//     if (!response.ok) {
//       throw new Error('Backend no disponible');
//     }
//     const data = await response.json();
//     return data.map(normalizeProperty);
//   } catch (error) {
//     return fetch('JSON/properties.json')
//       .then(response => response.json())
//       .then(properties => properties.map(normalizeProperty));
//   }
// }

async function fetchProperties() {
  try {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*');

    if (error) {
      throw error;
    }

    return data.map(normalizeProperty);

  } catch (error) {
    console.warn("Usando JSON local como fallback");

    return fetch('JSON/properties.json')
      .then(response => response.json())
      .then(properties => properties.map(normalizeProperty));
  }
}

fetchProperties()
  .then(properties => {
    if (propertyId) {

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
        document.querySelector('.ground').textContent = property.ground
        ? property.ground + ' m²' 
        : '';

        // Cambiar el construcción
        document.querySelector('.construction').textContent = property.construction
        ? property.construction + ' m²' 
        : '';

        // Cambiar Entrega
        document.querySelector('.ocupation').textContent = property.ocupation;

        // Cambiar Entrega
        document.querySelector('.payment').textContent = property.payment;
        document.querySelector('.servicios').textContent = Array.isArray(property.servicios)
          ? property.servicios.join(', ')
          : property.servicios;
        document.querySelector('.recamaras').textContent = property.recamaras;
        document.querySelector('.banos').textContent = property.banos;
        document.querySelector('.carros').textContent = property.carros;

        
        // Cambiar description
        document.querySelector('.descripcion').innerHTML = property.descripcion;

        // Insertar mapa
        const mapContainer = document.querySelector('.map-container');
        if (property.map && mapContainer) {
          mapContainer.innerHTML = `
            <iframe src="${property.map}" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          `;
        }

          // Insertar video TikTok embebido
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer && property.video) {
          videoContainer.style.minHeight = '325px'; //Se establece un tamaño mínimo para evitar que el contenedor colapse antes de cargar el video
          videoContainer.innerHTML = ''; // Limpiar cualquier contenido previo
          const blockquote = document.createElement('blockquote'); // Crear el bloque necesario para TikTok
          blockquote.classList.add('tiktok-embed');
          blockquote.setAttribute('cite', property.video);
          blockquote.setAttribute('data-video-id', property.video.split('/').pop());
          blockquote.setAttribute('style', 'max-width: 605px; min-width: 325px;');
          const section = document.createElement('section'); // Crear sección para el contenido del video
          section.innerHTML = `
            <a target="_blank" title="@mikearells" href="https://www.tiktok.com/@mikearells?refer=embed">@mikearells</a>
            Casa en venta en el Ojocaliente 1, en Aguascalientes. Tu próxima gran inversión está con nosotros, no esperes más.
          `;
          blockquote.appendChild(section);
          videoContainer.appendChild(blockquote); // Agregar el bloque al contenedor
          const script = document.createElement('script');
          script.src = 'https://www.tiktok.com/embed.js';
          script.async = true;
          document.body.appendChild(script);
        }

        const visor = document.querySelector('.visor');
        const miniaturas = document.querySelector('.miniaturas');
        if (visor && miniaturas) {
          visor.innerHTML = '';
          miniaturas.innerHTML = '';
          property.images.forEach((img, index) => {
            const figure = document.createElement('figure');
            figure.id = `image${index + 1}`;
            // figure.innerHTML = `<img src="Material/${img}" alt="Foto ${index + 1}">`;
            const imageSrc = img.startsWith('http') ? img : `Material/${img}`;
            figure.innerHTML = `<img src="${imageSrc}" alt="Foto ${index + 1}">`;
            
            visor.appendChild(figure);
            const a = document.createElement('a');
            a.href = `#image${index + 1}`;
            // a.innerHTML = `<img src="Material/${img}" alt="Miniatura ${index + 1}">`;
            a.innerHTML = `<img src="${imageSrc}" alt="Miniatura ${index + 1}">`;

            miniaturas.appendChild(a);
          });
          const gridItem = document.querySelector('.grid-item:last-child');
          if (gridItem) {
            gridItem.innerHTML += property.images
  .map((img, index) => {
    const prevIndex = index === 0 ? property.images.length : index;
    const nextIndex = index + 2 > property.images.length ? 1 : index + 2;

    const imageSrc = img;

    return `
      <article class="light-box" id="image${index + 1}">
        <a href="#image${prevIndex}" class="next"><i class="fa-solid fa-arrow-left"></i></a>
        
        <img src="${imageSrc}" alt="${property.titleName}">
        
        <a href="#image${nextIndex}" class="next"><i class="fa-solid fa-arrow-right"></i></a>
        <a href="#" class="close">X</a>
      </article>
    `;
  })
  .join('');
          }
        }
      } else {
        document.querySelector('.titleName').textContent = 'Propiedad no encontrada';
      }
    }
  });


  // NAV HAMBURGER

const hamburger = document.getElementById("hamburger");  //buscamos en HTML elemento hamburges
const navWrapper = document.getElementById("nav-wrapper");

if (hamburger && navWrapper) {
  hamburger.addEventListener("click", () => {  //“Cuando el usuario haga click en el botón hamburguesa…”
    navWrapper.classList.toggle("active");     //Si nav-wrapper NO tiene la clase active → la agrega, Si SÍ la tiene → la quita
  });
}

    
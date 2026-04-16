
console.log('map.js ejecutándose');

mapboxgl.accessToken = window.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-102.2916, 21.8853],
  zoom: 11
});

map.on('load', () => {
  console.log('Mapa cargó correctamente');
});


let properties = [];
let markers = [];
let baseList = [];

  function normalizeProperty(property) {
    //   // Normalizar rutas de imágenes
    // let images = property.images || ['imgHero1.jpeg'];
    // images = images.map(img => {
    //   // Si la imagen ya incluye una ruta específica, úsala tal cual
    //   if (img.includes('/')) {
    //     return img;
    //   }
    //   // Si no, agrega la carpeta Material
    //   return 'Material/' + img;
    // });

    images = property.images || [];

    images = images.map(img => {
      if (img.startsWith('http')) {
        return img; // imagen de Supabase ✅
      }
      return 'Material/' + img; // fallback local
    });

    return {
      id: property.id || property.ID || 0,
      titleName: property.Titulo || property.titleName || '',
      subtitle: property.Subtitulo || property.subtitle || '',
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
      images: images,
      map: property.map || '',
      video: property.video || '',
      descripcion: property.descripcion ||''
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

  // -------- FETCH, PIN Instance en cluster para agregar desde backend o JSON --------
  // apiPropertiesUrl ya está declarado en main.js

  // async function loadProperties() {
  //   try {
  //     const response = await fetch(apiPropertiesUrl);
  //     if (!response.ok) {
  //       throw new Error('Error backend');
  //     }
  //     const data = await response.json();
  //     return data.map(normalizeProperty);
  //   } catch (error) {
  //     console.warn('Falling back to JSON due to backend error:', error);
  //     const response = await fetch('JSON/properties.json');
  //     const data = await response.json();
  //     return data.map(normalizeProperty);
  //   }
  // }

  async function loadProperties() {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*');

  if (error) {
    console.error('Error cargando propiedades:', error);

    // fallback opcional a JSON
    const response = await fetch('JSON/properties.json');
    const dataJson = await response.json();
    return dataJson.map(normalizeProperty);
  }

  return data.map(normalizeProperty);
}

 // otra cosa
  loadProperties()
    .then(data => {
      properties = data;

      const currentUrl = window.location.href.toLowerCase();
      baseList = properties;

      if (currentUrl.includes('comprar')) {
        baseList = properties.filter(p => p.tipoTransaction.toUpperCase().includes('EN VENTA'));
      }

      if (currentUrl.includes('rentar')) {
        baseList = properties.filter(p => p.tipoTransaction.toUpperCase().includes('EN RENTA'));
      }

      console.log('Propiedades cargadas:', baseList.length, 'en', currentUrl.includes('comprar') ? 'comprar' : currentUrl.includes('rentar') ? 'rentar' : 'otros');
      renderMarkers(baseList);
      renderCards(baseList);
    })
    .catch(err => {
      console.error('Error cargando propiedades:', err);
      const container = document.getElementById('properties-list');
      if (container) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No se pudieron cargar las propiedades. Verifica que el backend esté funcionando.</p></div>';
      }
    });

  //---------- FILTERS ----------
  function applyFilters(){

    const location = document.getElementById("searchLocation").value.toLowerCase();
    const price = document.getElementById("priceFilter").value;
    const beds = document.getElementById("bedsFilter").value;
    const type = document.getElementById("typeFilter").value;
  
    let filtered = baseList.filter(prop => {
  
      let matchLocation = location === "" ||
        prop.subtitle.toLowerCase().includes(location);
  
      let matchPrice = price === "" ||
        parseInt(prop.price.replace(/[^0-9]/g,'')) <= price;
  
      let matchBeds = beds === "" ||
        prop.recamaras >= beds;
  
      let matchType = type === "" ||
        prop.TipoProperty.toLowerCase() === type;
  
      return matchLocation && matchPrice && matchBeds && matchType;
  
    });
  
    renderMarkers(filtered); // Mapa
    renderCards(filtered);   // tarjetas
  
  }

   //----------- REMARKERS ----------
  function renderMarkers(list){

    // eliminar markers anteriores
    markers.forEach(marker => marker.remove());
    markers = [];
  
    list.forEach(prop => {

    const coords = getCoordinatesFromEmbed(prop.map);

    if(!coords) return; // si no encuentra coordenadas no crea marker
  
      const popupContent = `
        <div style="width:180px;">
          <a href="property1.html?id=${prop.id}" style="text-decoration:none;color:black;">
            <img src="${prop.images[0]}"
                 style="width:100%; height:100px; object-fit:cover; border-radius:6px;">
            <h6>${prop.subtitle}</h6>
            <p>${prop.price}</p>
          </a>
        </div>
      `;
  
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);
  
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map);
  
      markers.push(marker);
  
    });
  
  }

  //---------- RenderCards ----------
  function renderCards(list){

  const container = document.getElementById("properties-list");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = '<div class="col-12"><p class="text-muted">No se encontraron propiedades para esta categoría.</p></div>';
    return;
  }

  list.forEach(prop => {

    const card = `
      <div class="col">
        <a href="property1.html?id=${prop.id}" class="text-decoration-none">
          <div class="card shadow-sm">
            <img src="${prop.images[0]}" alt="${prop.titleName}" class="propiedad1">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center px-3 pt-2">
                <p class="fw-bold fs-6 mb-0">${prop.price}</p>
                <div class="badge bg-success text-white fs-7 px-3 py-2">${prop.tipoTransaction.toUpperCase()}</div>
              </div>
              <p class="subtitle mb-1">${prop.recamaras} recamaras · ${prop.banos} baño</p>
              <p class="mb-0">${prop.subtitle}</p>
            </div>
          </div>
        </a>
      </div>
    `;

    container.innerHTML += card;

  });

}

    //------------- COORDINATES EXTRACTION ------------
    function getCoordinatesFromEmbed(url) {

    const latMatch = url.match(/!3d(-?\d+\.\d+)/);
    const lngMatch = url.match(/!2d(-?\d+\.\d+)/);

    if(latMatch && lngMatch){
      return {
        lat: parseFloat(latMatch[1]),
        lng: parseFloat(lngMatch[1])
      };
    }

    return null;
  }

  //---------- Geocoder (buscador) ----------
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: "Buscar dirección..."
  });
  map.addControl(geocoder);

  //---------- Insertar buscador ----------
  // document.getElementById("geocoder").appendChild(geocoder.onAdd(map));


  //---------- Controles opcionales ----------
  map.addControl(new mapboxgl.NavigationControl());


  

  

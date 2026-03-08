
console.log('map.js ejecutándose');

mapboxgl.accessToken = window.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-102.2916, 21.8853],
  zoom: 11
});

map.on('error', (e) => {
  console.error('Mapbox error:', e.error);
});

map.on('load', () => {
  console.log('Mapa cargó correctamente');
});


let properties = [];
let markers = [];
let baseList = [];

  // -------- FETCH, PIN Instance en cluster para agregar desde JSON --------
  fetch("JSON/properties.json")
    .then(response => response.json())
    .then(data => {

      properties = data;

        // Detectar en qué página estamos
    const page = window.location.pathname.toLowerCase();

    baseList = properties;

    if(page.includes("comprar")){
      baseList = properties.filter(p => p.tipoTransaction.includes("venta"));
    }

    if(page.includes("rentar")){
      baseList = properties.filter(p => p.tipoTransaction.includes("renta"));
    }

      //Render
      renderMarkers(baseList); // mostrar los markers
      renderCards(baseList);   // cards
    })
    .catch(err => console.error("Error cargando propiedades:", err));

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
            <img src="Material/${prop.images[0]}"
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

  list.forEach(prop => {

    const card = `
      <div class="col">
        <a href="property1.html?id=${prop.id}" class="text-decoration-none">
          <div class="card shadow-sm">
            <img src="Material/${prop.images[0]}" alt="${prop.titleName}" class="propiedad1">
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

  //---------- Insertar buscador ----------
  // document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
  map.addControl(geocoder, "top-center");


  //---------- Controles opcionales ----------
  map.addControl(new mapboxgl.NavigationControl());


  

  

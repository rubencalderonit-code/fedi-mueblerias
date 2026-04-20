let productosData = [];

const URL_SHEET = "https://docs.google.com/spreadsheets/d/1RcwR8oVro3CNzNEPyypCuQH-k2e4keWl3JTl9AswlNg/export?format=csv&gid=0";

const URL_TRACKING = "https://script.google.com/macros/s/AKfycby8Oj1-E7YRGE-8zeCr2ZWPhUdohXzJBDtI5bi415YI-usABJlVpQ9--v0JivIVc5D1zA/exec";


/* =========================
   CARGA
========================= */
fetch(URL_SHEET)
  .then(res => res.text())
  .then(csv => {
    const data = csvToJSON(csv);

    productosData = ordenarProductos(data);
    mostrarProductos(productosData);
  })
  .catch(err => console.error("Error cargando Sheet:", err));


/* =========================
   TRACKING
========================= */
function track(productoId, accion) {
  fetch(URL_TRACKING, {
    method: "POST",
    body: JSON.stringify({
      producto: productoId,
      accion: accion
    })
  });
}


/* =========================
   CSV → JSON + VALIDACIÓN
========================= */
function csvToJSON(csv) {
  const lines = csv.split("\n").filter(l => l.trim() !== "");

  const separador = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(separador);

  return lines.slice(1).map(line => {
    const values = line.split(separador);
    let obj = {};

    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] ? values[i].trim() : "";
    });

    obj.nombre = obj.nombre?.trim();
    obj.categoria = obj.categoria?.toLowerCase().trim();
    obj.tag = obj.tag?.toLowerCase().trim();

    obj.precio = Number(obj.precio) || 0;
    obj.stock = Number(obj.stock) || 0;

    // VALIDACIÓN CLAVE (evita romper la web)
    if (!obj.nombre || !obj.categoria) return null;

    // colores
    if (obj.colores) {
      obj.colores = obj.colores.split(",").map(c => {
        const [nombre, imagen] = c.split(":");
        return {
          nombre: nombre,
          imagen: imagen,
          codigo: getColorHex(nombre)
        };
      });
    }

    return obj;
  }).filter(Boolean);
}


/* =========================
   COLORES
========================= */
function getColorHex(nombre) {
  const mapa = {
    chocolate: "#3b2a1f",
    roble: "#a67c52",
    gris: "#808080",
    blanco: "#ffffff",
    negro: "#000000"
  };

  return mapa[nombre?.toLowerCase()] || "#ccc";
}


/* =========================
   MENSAJE WHATSAPP (CON IMAGEN)
========================= */
function generarMensaje(producto) {
  return encodeURIComponent(
`Hola 👋

Me interesa este producto:
${producto.nombre}

Te dejo la imagen para referencia:
${producto.imagen}

¿Me das más información?`
  );
}


/* =========================
   RENDER
========================= */
function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  lista.forEach(p => {

    let imagen = p.imagen || p.colores?.[0]?.imagen;

    const disponible = p.stock > 0;

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${imagen}" alt="${p.nombre}">

      <div class="card-info">
        <span class="tag ${p.tag || ''} ${!disponible ? 'agotado' : ''}">
          ${disponible ? (p.tag || 'Disponible') : 'Agotado'}
        </span>

        <h3>${p.nombre}</h3>
        <p class="precio">$${p.precio.toLocaleString()}</p>

        <div class="botones-card">

          <a href="detalle.html?id=${p.id}" 
             class="btn-detalle"
             onclick="track('${p.id}','detalle')">
            Ver detalles
          </a>

          ${
            disponible
              ? `<a href="https://wa.me/528443435820?text=${generarMensaje(p)}"
                   target="_blank"
                   class="btn-wsp"
                   onclick="track('${p.id}','whatsapp')">
                   WhatsApp
                 </a>`
              : `<span class="agotado-text">No disponible</span>`
          }

        </div>
      </div>
    `;

    contenedor.appendChild(card);
  });
}


/* =========================
   FILTRO
========================= */
function filtrar(cat) {
  if (cat === 'todos') return mostrarProductos(productosData);

  mostrarProductos(productosData.filter(p => p.categoria === cat));
}


/* =========================
   BUSCADOR
========================= */
function buscar() {
  const texto = document.getElementById('busqueda').value.toLowerCase();

  mostrarProductos(
    productosData.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    )
  );
}


/* =========================
   ORDEN
========================= */
function ordenarProductos(lista) {
  const prioridad = {
    "oferta": 1,
    "top venta": 2,
    "nuevo": 3,
    "disponible": 4
  };

  return lista.sort((a, b) =>
    (prioridad[a.tag] || 5) - (prioridad[b.tag] || 5)
  );
}

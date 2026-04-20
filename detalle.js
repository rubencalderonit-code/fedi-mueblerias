const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let productoActual = null;
let colorSeleccionado = null;
let dataGlobal = [];

const URL_SHEET = "https://docs.google.com/spreadsheets/d/1RcwR8oVro3CNzNEPyypCuQH-k2e4keWl3JTl9AswlNg/export?format=csv&gid=0";

/* =========================
   CARGA DATA
========================= */
fetch(URL_SHEET)
  .then(res => res.text())
  .then(csv => {
    const data = csvToJSON(csv);
    dataGlobal = data;

    const producto = data.find(p => p.id === id);

    if (!producto) {
      document.getElementById("detalle").innerHTML = `
        <h2 style="text-align:center;margin-top:50px;">
          Producto no encontrado
        </h2>
      `;
      return;
    }

    productoActual = producto;
    renderProducto(producto);
    renderRelacionados(producto, data);
  });


/* =========================
   RENDER PRINCIPAL
========================= */
function renderProducto(p) {
  const cont = document.getElementById("detalle");

  let imagenInicial = p.imagen;

  if (!imagenInicial && p.colores?.length > 0) {
    imagenInicial = p.colores[0].imagen;
  }

  let coloresHTML = "";
  if (p.colores) {
    coloresHTML = p.colores.map(c => `
      <span class="color-circle"
        style="background:${c.codigo}"
        onclick="seleccionarColor('${c.nombre}', '${c.imagen}')">
      </span>
    `).join("");
  }

  /* =========================
     STOCK INTELIGENTE
  ========================= */
  let stockHTML = "";

  if (p.stock !== undefined) {
    const stock = Number(p.stock);

    if (stock <= 0) {
      stockHTML = `<span class="badge-stock agotado">Agotado</span>`;
    } else if (stock < 5) {
      stockHTML = `<span class="badge-stock pocas">🔥 Últimas piezas (${stock})</span>`;
    } else {
      stockHTML = `<span class="badge-stock disponible">En stock (${stock})</span>`;
    }
  }

  /* =========================
     BADGE TAG
  ========================= */
  let tagHTML = "";
  if (p.tag) {
    tagHTML = `<span class="badge-tag">${p.tag}</span>`;
  }

  cont.innerHTML = `
    <div class="detalle-img">
      <img id="imgPrincipal" src="${imagenInicial}">
    </div>

    <div class="detalle-info">

      ${tagHTML}
      ${stockHTML}

      <h1>${p.nombre}</h1>

      ${p.colores ? `
        <p class="label">Colores disponibles:</p>
        <div>${coloresHTML}</div>
      ` : ""}

      <p class="extra"><b>Material:</b> ${p.material || "-"}</p>
      <p class="extra"><b>Medidas:</b> ${p.medidas || "-"}</p>

      <p class="precio">$${(p.precio || 0).toLocaleString()}</p>

      <p class="extra">Disponible a crédito y contado</p>

      <a id="btnWsp"
        class="btn-wsp"
        target="_blank">
        Comprar por WhatsApp
      </a>

      <a href="index.html" class="volver">← Volver</a>

    </div>

    <div id="relacionados" class="relacionados"></div>
  `;

  actualizarWhatsApp();
}


/* =========================
   CAMBIO DE COLOR
========================= */
function seleccionarColor(nombre, imagen) {
  document.getElementById("imgPrincipal").src = imagen;
  colorSeleccionado = nombre;

  actualizarWhatsApp();
}


/* =========================
   WHATSAPP PRO
========================= */
function actualizarWhatsApp() {
  const btn = document.getElementById("btnWsp");

  let mensaje = `Hola 👋

Me interesa este producto:
${productoActual.nombre}`;

  if (colorSeleccionado) {
    mensaje += `\nColor: ${colorSeleccionado}`;
  }

  let imagen = productoActual.imagen;

  if (colorSeleccionado && productoActual.colores) {
    const col = productoActual.colores.find(c => c.nombre === colorSeleccionado);
    if (col) imagen = col.imagen;
  }

  mensaje += `

Te dejo la imagen para referencia:
${imagen}

¿Me das más información?`;

  btn.href = `https://wa.me/528443435820?text=${encodeURIComponent(mensaje)}`;
}


/* =========================
   RELACIONADOS
========================= */
function renderRelacionados(actual, data) {
  const cont = document.getElementById("relacionados");

  const relacionados = data
    .filter(p => p.categoria === actual.categoria && p.id !== actual.id)
    .slice(0, 3);

  if (relacionados.length === 0) return;

  cont.innerHTML = `
    <h3 style="margin-top:40px;">También te puede interesar</h3>
    <div class="productos">
      ${relacionados.map(p => {
        let img = p.imagen || (p.colores?.[0]?.imagen || "");

        return `
          <div class="card">
            <a href="detalle.html?id=${p.id}">
              <img src="${img}">
            </a>
            <div class="card-info">
              <h4>${p.nombre}</h4>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}


/* =========================
   CSV → JSON
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

    obj.precio = Number(obj.precio);
    obj.stock = parseInt(obj.stock?.trim()) || 0;

    if (obj.colores) {
      obj.colores = obj.colores.split("|").map(c => {
        const [nombre, imagen] = c.split(":");
        return {
          nombre: nombre,
          imagen: imagen,
          codigo: getColorHex(nombre)
        };
      });
    }

    return obj;
  });
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

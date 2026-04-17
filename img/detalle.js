const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    const producto = data.find(p => p.id === id);
    renderProducto(producto);
  });

function renderProducto(p) {
  const cont = document.getElementById("detalle");

  let coloresHTML = "";
  if (p.colores) {
    coloresHTML = p.colores.map(c => `
      <span class="color-circle"
        style="background:${c.codigo}"
        onclick="cambiarImagen('${c.imagen}')">
      </span>
    `).join("");
  }

  const mensaje = encodeURIComponent(
`Hola 👋

Estoy interesado en "${p.nombre}"

¿Me puedes dar más información?`
  );

  cont.innerHTML = `
    <div class="detalle-img">
      <img id="imgPrincipal" src="${p.imagen}">
    </div>

    <div class="detalle-info">
      <h1>${p.nombre}</h1>

      ${p.colores ? `<p>Colores disponibles:</p>${coloresHTML}` : ""}

      <p class="extra"><b>Material:</b> ${p.material}</p>
      <p class="extra"><b>Medidas:</b> ${p.medidas}</p>

      <p class="precio">${p.precio}</p>

      <p class="extra">Disponible a crédito y contado</p>

      <a class="btn-wsp"
        href="https://wa.me/528443435820?text=${mensaje}"
        target="_blank">
        Comprar por WhatsApp
      </a>

      <a href="index.html" class="volver">← Volver</a>
    </div>
  `;
}

function cambiarImagen(src) {
  document.getElementById("imgPrincipal").src = src;
}

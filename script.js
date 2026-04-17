let productosData = [];

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productosData = ordenarProductos(data);
    mostrarProductos(productosData);
  });

function generarMensaje(producto) {
  return encodeURIComponent(
`Hola, me interesa este producto:

🛋️ ${producto.nombre}
💲 ${producto.precio}

¿Me puedes dar más información?`
  );
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  lista.forEach(p => {

    const imagen = p.imagen || (p.colores ? p.colores[0].imagen : '');

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${imagen}" alt="${p.nombre}" loading="lazy">
      <div class="card-info">
        <span class="tag">${p.tag || 'Disponible'}</span>
        <h3>${p.nombre}</h3>
        <p class="precio">${p.precio}</p>
        <a href="detalle.html?id=${p.id}">
          Ver detalles
        </a>
        <a href="https://wa.me/528443435820?text=${generarMensaje(p)}" target="_blank">
          WhatsApp
        </a>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

function filtrar(cat) {
  if (cat === 'todos') {
    mostrarProductos(productosData);
  } else {
    const filtrados = productosData.filter(p => p.categoria === cat);
    mostrarProductos(filtrados);
  }
}

function buscar() {
  const texto = document.getElementById('busqueda').value.toLowerCase();

  const filtrados = productosData.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );

  mostrarProductos(filtrados);
}

function ordenarProductos(lista) {
  const prioridad = {
    "OFERTA": 1,
    "Top venta": 2,
    "Nuevo": 3,
    "Disponible": 4
  };

  return lista.sort((a, b) => {
    return (prioridad[a.tag] || 5) - (prioridad[b.tag] || 5);
  });
}

/* MODAL */
const modal = document.getElementById("modal");
const imgModal = document.getElementById("imgModal");

document.addEventListener("click", function(e) {
  if (e.target.tagName === "IMG" && e.target.closest(".card")) {
    modal.style.display = "block";
    imgModal.src = e.target.src;
  }
});

document.querySelector(".cerrar").onclick = () => modal.style.display = "none";
modal.onclick = () => modal.style.display = "none";

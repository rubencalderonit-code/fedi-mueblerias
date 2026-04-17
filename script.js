let productosData = [];

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    console.log("Productos cargados:", data);

    productosData = ordenarProductos(data);
    mostrarProductos(productosData);
  })
  .catch(error => console.error("Error cargando productos:", error));

function generarMensaje(producto) {
  return encodeURIComponent(
`Hola, me interesa este producto:

🛋️ ${producto.nombre}

¿Me puedes dar más información?`
  );
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  lista.forEach(p => {

    let imagen = '';

    if (p.imagen) {
      imagen = p.imagen;
    } else if (p.colores && p.colores.length > 0) {
      imagen = p.colores[0].imagen;
    } else {
      imagen = 'img/productos/default.webp'; // respaldo
    }

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${imagen}" alt="${p.nombre}" loading="lazy">
      <div class="card-info">
        <span class="tag">${p.tag || 'Disponible'}</span>
        <h3>${p.nombre}</h3>
        <p class="precio">${p.precio}</p>

        <div class="botones-card">
          <a href="detalle.html?id=${p.id}" class="btn-detalle">
            Ver detalles
          </a>

          <a href="https://wa.me/528443435820?text=${generarMensaje(p)}" target="_blank" class="btn-wsp">
            WhatsApp
          </a>
        </div>
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

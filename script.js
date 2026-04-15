let productosData = [];

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productosData = data;
    mostrarProductos(data);
  });

function generarMensaje(producto) {
  return encodeURIComponent(
    `Hola, me interesa este producto:\n${producto.nombre}\n${producto.precio}`
  );
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  lista.forEach(p => {
    const mensaje = generarMensaje(p);

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${p.imagen}" loading="lazy" alt="${p.nombre}">
      <div class="card-info">
        <span class="tag">Nuevo</span>
        <h3>${p.nombre}</h3>
        <p class="precio">${p.precio}</p>
        <a href="https://wa.me/528443435820?text=${mensaje}" target="_blank">
  Preguntar por WhatsApp
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
<span class="tag">Disponible</span>

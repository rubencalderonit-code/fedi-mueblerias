const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const producto = data.find(p => p.id === id);

    document.getElementById('nombre').innerText = producto.nombre;
    document.getElementById('precio').innerText = producto.precio;
    document.getElementById('descripcion').innerText = producto.descripcion || '';
    document.getElementById('material').innerText = producto.material || '';
    document.getElementById('medidas').innerText = producto.medidas || '';

    const img = document.getElementById('imagenProducto');

    if (producto.imagen) {
      img.src = producto.imagen;
    }

    if (producto.colores) {
      img.src = producto.colores[0].imagen;

      const contenedorColores = document.getElementById('colores');

      producto.colores.forEach(c => {
        const btn = document.createElement('button');
        btn.innerText = c.nombre;

        btn.onclick = () => {
          img.src = c.imagen;
        };

        contenedorColores.appendChild(btn);
      });
    }

    document.getElementById('btnWhats').href =
      `https://wa.me/528443435820?text=${encodeURIComponent(
        `Hola, me interesa el producto ${producto.nombre}`
      )}`;
  });

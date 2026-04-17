const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const producto = data.find(p => p.id === id);

    document.getElementById('nombre').innerText = producto.nombre;
    document.getElementById('precio').innerText = producto.precio;
    document.getElementById('material').innerText = producto.material || 'No especificado';
    document.getElementById('medidas').innerText = producto.medidas || 'No especificado';

    const img = document.getElementById('imagenProducto');

    // IMAGEN INICIAL
    if (producto.imagen) {
      img.src = producto.imagen;
    }

    // COLORES
    if (producto.colores) {

      img.src = producto.colores[0].imagen;

      const contenedor = document.getElementById('colores');

      producto.colores.forEach(c => {
        const colorBtn = document.createElement('div');
        colorBtn.classList.add('color-circulo');

        // COLOR VISUAL (simulado)
        if (c.nombre.toLowerCase().includes('chocolate')) {
          colorBtn.style.background = '#4b2e2b';
        } else if (c.nombre.toLowerCase().includes('roble')) {
          colorBtn.style.background = '#b08968';
        } else {
          colorBtn.style.background = '#ccc';
        }

        colorBtn.title = c.nombre;

        colorBtn.onclick = () => {
          img.src = c.imagen;
        };

        contenedor.appendChild(colorBtn);
      });

    } else {
      document.getElementById('coloresContainer').style.display = 'none';
    }

    document.getElementById('btnWhats').href =
      `https://wa.me/528443435820?text=${encodeURIComponent(
        `Hola, me interesa el producto ${producto.nombre} ${producto.precio}`
      )}`;
  });

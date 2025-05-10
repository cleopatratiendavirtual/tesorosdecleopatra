document.addEventListener('DOMContentLoaded', function() {

    // ----- Actualizar año en el footer -----
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ----- Carrito de Compras Básico -----
    const botonesAgregar = document.querySelectorAll('.boton-agregar-carrito');
    const listaCarritoItems = document.getElementById('lista-carrito-items');
    const totalPrecioCarritoSpan = document.getElementById('total-precio-carrito');
    const itemsCarritoSpan = document.getElementById('items-carrito');
    const carritoLateral = document.getElementById('carrito-compras');
    const botonVerCarrito = document.getElementById('ver-carrito');
    const botonCerrarCarrito = document.getElementById('boton-cerrar-carrito');
    const overlayCarrito = document.getElementById('overlay-carrito');
    const botonFinalizarCompra = document.getElementById('boton-finalizar-compra');

    let carrito = JSON.parse(localStorage.getItem('carritoTesorosCleopatra')) || []; // Cargar carrito desde localStorage

    function actualizarCarritoVisual() {
        listaCarritoItems.innerHTML = ''; // Limpiar vista previa
        let totalGeneral = 0;
        let cantidadTotalItems = 0;

        if (carrito.length === 0) {
            listaCarritoItems.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            carrito.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item-carrito');
                // Para la imagen, necesitarías una forma de asociar el producto.id con su imagen.
                // Por ahora, omitimos la imagen en el resumen del carrito o usamos una genérica.
                itemDiv.innerHTML = `
                    <div class="info-item">
                        <p class="nombre-item-carrito">${item.nombre}</p>
                        <p>$${parseFloat(item.precio).toFixed(2)} x ${item.cantidad}</p>
                    </div>
                    <span class="cantidad-item-carrito">Cant: ${item.cantidad}</span>
                    <button class="boton-eliminar-item" data-id="${item.id}">&times;</button>
                `;
                listaCarritoItems.appendChild(itemDiv);
                totalGeneral += parseFloat(item.precio) * item.cantidad;
                cantidadTotalItems += item.cantidad;
            });
        }

        totalPrecioCarritoSpan.textContent = totalGeneral.toFixed(2);
        itemsCarritoSpan.textContent = cantidadTotalItems;

        // Guardar carrito en localStorage
        localStorage.setItem('carritoTesorosCleopatra', JSON.stringify(carrito));

        // Añadir event listeners a los nuevos botones de eliminar
        document.querySelectorAll('.boton-eliminar-item').forEach(boton => {
            boton.addEventListener('click', eliminarItemDelCarrito);
        });
    }

    function agregarAlCarrito(evento) {
        const boton = evento.target;
        const id = boton.dataset.id;
        const nombre = boton.dataset.nombre;
        const precio = parseFloat(boton.dataset.precio);

        const itemExistente = carrito.find(item => item.id === id);

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        console.log(carrito); // Para depuración
        actualizarCarritoVisual();
        mostrarMensajeProductoAgregado(nombre);

        // Opcional: Abrir carrito al agregar
        if (!carritoLateral.classList.contains('abierto')) {
             abrirCerrarCarrito();
        }
    }

    function eliminarItemDelCarrito(evento) {
        const idAEliminar = evento.target.dataset.id;
        carrito = carrito.filter(item => item.id !== idAEliminar);
        actualizarCarritoVisual();
    }

    function abrirCerrarCarrito() {
        carritoLateral.classList.toggle('abierto');
        overlayCarrito.classList.toggle('activo');
        // Si se abre el carrito, el scroll del body debe deshabilitarse
        document.body.style.overflow = carritoLateral.classList.contains('abierto') ? 'hidden' : 'auto';
    }

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });

    if (botonVerCarrito) {
        botonVerCarrito.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir que el enlace # navegue
            abrirCerrarCarrito();
        });
    }
    if (botonCerrarCarrito) {
        botonCerrarCarrito.addEventListener('click', abrirCerrarCarrito);
    }
    if (overlayCarrito) {
        overlayCarrito.addEventListener('click', abrirCerrarCarrito); // Cerrar al hacer clic fuera
    }

    if (botonFinalizarCompra) {
        botonFinalizarCompra.addEventListener('click', () => {
            if (carrito.length > 0) {
                alert('Gracias por tu compra! (Esta es una simulación, serás redirigido a la página de inicio).');
                carrito = []; // Vaciar carrito
                actualizarCarritoVisual();
                abrirCerrarCarrito(); // Cerrar carrito
                // window.location.href = 'pagina_de_gracias.html'; // O redirigir
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    // Función para mostrar un mensaje temporal cuando se agrega un producto
    function mostrarMensajeProductoAgregado(nombreProducto) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.textContent = `"${nombreProducto}" se agregó al carrito.`;
        mensajeDiv.style.position = 'fixed';
        mensajeDiv.style.bottom = '20px';
        mensajeDiv.style.left = '50%';
        mensajeDiv.style.transform = 'translateX(-50%)';
        mensajeDiv.style.backgroundColor = 'var(--color-acento)';
        mensajeDiv.style.color = 'var(--color-blanco)';
        mensajeDiv.style.padding = '10px 20px';
        mensajeDiv.style.borderRadius = '5px';
        mensajeDiv.style.zIndex = '2000';
        mensajeDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        document.body.appendChild(mensajeDiv);

        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 3000); // El mensaje desaparece después de 3 segundos
    }


    // ----- Smooth Scroll para anclas (opcional pero bueno para UX) -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // No aplicar a los controles del carrito que usan href="#" solo para JS
            if (this.id === 'ver-carrito') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cargar y mostrar el carrito al iniciar la página
    actualizarCarritoVisual();
});
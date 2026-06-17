// ==========================================================================
// ALTER-EGO | CONTROL DE INTERFAZ Y CARRITO DE COMPRAS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================================
    // 1. COMPONENTES DEL DOM
    // =====================================================================
    const botonMiCuenta       = document.getElementById('btn-mi-cuenta');
    const menuOpcionesCuenta = document.getElementById('menu-opciones-cuenta');
    const optionIngresar     = document.getElementById('opcion-ingresar');
    const modalLoginPantalla = document.getElementById('modal-login-pantalla');
    const botonCerrarModal   = document.getElementById('boton-cerrar-modal');
    const vistaIniciarSesion = document.getElementById('vista-iniciar-sesion');
    const vistaRegistrarse   = document.getElementById('vista-registrarse');
    const enlaceIrARegistro  = document.getElementById('enlace-ir-a-registro');
    const enlaceIrALogin     = document.getElementById('enlace-ir-a-login');

    // =====================================================================
    // 2. MENÚ MI CUENTA
    // =====================================================================
    if (botonMiCuenta && menuOpcionesCuenta) {
        botonMiCuenta.addEventListener('click', (e) => {
            e.stopPropagation();
            menuOpcionesCuenta.classList.toggle('mostrar-menu-cuenta');
        });
    }

    document.addEventListener('click', () => {
        if (menuOpcionesCuenta) menuOpcionesCuenta.classList.remove('mostrar-menu-cuenta');
    });

    // =====================================================================
    // 3. MODAL DE LOGIN
    // =====================================================================
    if (optionIngresar && menuOpcionesCuenta && vistaRegistrarse && vistaIniciarSesion && modalLoginPantalla) {
        optionIngresar.addEventListener('click', (e) => {
            e.preventDefault();
            menuOpcionesCuenta.classList.remove('mostrar-menu-cuenta');
            vistaRegistrarse.classList.add('vista-oculta');
            vistaIniciarSesion.classList.remove('vista-oculta');
            modalLoginPantalla.classList.add('abrir-modal-login');
        });
    }

    if (botonCerrarModal && modalLoginPantalla) {
        botonCerrarModal.addEventListener('click', () => {
            modalLoginPantalla.classList.remove('abrir-modal-login');
        });
    }

    if (modalLoginPantalla) {
        modalLoginPantalla.addEventListener('click', (e) => {
            if (e.target === modalLoginPantalla)
                modalLoginPantalla.classList.remove('abrir-modal-login');
        });
    }

    if (enlaceIrARegistro && vistaIniciarSesion && vistaRegistrarse) {
        enlaceIrARegistro.addEventListener('click', (e) => {
            e.preventDefault();
            vistaIniciarSesion.classList.add('vista-oculta');
            vistaRegistrarse.classList.remove('vista-oculta');
        });
    }

    if (enlaceIrALogin && vistaRegistrarse && vistaIniciarSesion) {
        enlaceIrALogin.addEventListener('click', (e) => {
            e.preventDefault();
            vistaRegistrarse.classList.add('vista-oculta');
            vistaIniciarSesion.classList.remove('vista-oculta');
        });
    }

    // =====================================================================
    // 4. CARRUSEL AUTOMÁTICO
    // =====================================================================
    const diapositivas = document.querySelectorAll(".diapositiva");
    const puntitos     = document.querySelectorAll("#carrusel-puntitos .punto");
    let indiceActual   = 0;

    function cambiarDiapositiva() {
        if (diapositivas.length === 0 || puntitos.length === 0) return;
        diapositivas[indiceActual].classList.remove("activa");
        puntitos[indiceActual].classList.remove("activo");
        indiceActual = (indiceActual + 1) % diapositivas.length;
        diapositivas[indiceActual].classList.add("activa");
        puntitos[indiceActual].classList.add("activo");
    }

    if (diapositivas.length > 0 && puntitos.length > 0) setInterval(cambiarDiapositiva, 4000);

    // =====================================================================
    // 5. SISTEMA DE CARRITO
    // =====================================================================
    let carrito = JSON.parse(localStorage.getItem("carrito_alterego")) || [];

    const botonCarritoEl   = document.querySelector('.boton-carrito');
    const panelCarrito     = document.getElementById('panel-carrito');
    const listaItems       = document.getElementById('lista-items-carrito');
    const totalMonto       = document.getElementById('carrito-total-monto');
    const contadorBadge    = document.querySelector('.contador-carrito');
    const btnLimpiar       = document.getElementById('btn-limpiar-carrito');
    const btnFinalizar     = document.getElementById('btn-finalizar-compra');

    if (botonCarritoEl && panelCarrito) {
        botonCarritoEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            panelCarrito.classList.toggle('abierto');
        });
    }

    document.addEventListener('click', (e) => {
        if (!panelCarrito) return;
        const contenedorCarrito = document.querySelector('.contenedor-carrito');
        if (contenedorCarrito && !contenedorCarrito.contains(e.target)) {
            panelCarrito.classList.remove('abierto');
        }
    });

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            carrito = [];
            guardarYRenderizar();
        });
    }

 if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        console.log("Botón finalizar pulsado");

        if (carrito.length === 0) {
            alert("Tu bolsa de compras está vacía.");
            return;
        }

        window.location.href = "../page/pago.html";
    });
}

    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', () => {
            const tarjeta = btn.closest('.tarjeta-producto');
            if (!tarjeta) return;

            const nombre = tarjeta.querySelector('.nombre-producto')?.textContent?.trim() || 'Producto';
            const marca  = tarjeta.querySelector('.ciudad-producto')?.textContent?.trim() || '';
            const fotoEl = tarjeta.querySelector('.contenedor-foto');

            let foto = '🛍️';
            if (fotoEl) {
                const clon = fotoEl.cloneNode(true);
                clon.querySelectorAll('span').forEach(s => s.remove());
                foto = clon.textContent.trim() || '🛍️';
            }

            const precioTexto = tarjeta.querySelector('.precio-producto')?.textContent || '0';
            const precioMatch = precioTexto.match(/S\/\s*([\d.,]+)(?!.*S\/)/);
            const precio = precioMatch ? parseFloat(precioMatch[1].replace(',', '.')) : 0;

            const existente = carrito.find(p => p.nombre === nombre);
            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({ nombre, marca, foto, precio, cantidad: 1 });
            }

            guardarYRenderizar();

            btn.classList.add('agregado');
            const textoOriginal = btn.textContent;
            btn.textContent = '✓ Añadido';
            setTimeout(() => {
                btn.classList.remove('agregado');
                btn.textContent = textoOriginal;
            }, 1200);

            if (panelCarrito) panelCarrito.classList.add('abierto');
        });
    });

    // =====================================================================
    // 6. RENDERIZAR PANEL DEL CARRITO
    // =====================================================================
    function renderizarCarrito() {
        if (!listaItems) return;

        if (carrito.length === 0) {
            listaItems.innerHTML = `
                <div class="carrito-vacio-msg">
                    <span class="icono-vacio">🛒</span>
                    Tu carrito está vacío
                </div>`;
            if (totalMonto) totalMonto.textContent = 'S/ 0.00';
            if (btnFinalizar) btnFinalizar.disabled = true;
            if (contadorBadge) contadorBadge.textContent = '0';
            return;
        }

        listaItems.innerHTML = '';
        let total = 0;
        let cantidadTotal = 0;

        carrito.forEach((prod, idx) => {
            total += prod.precio * prod.cantidad;
            cantidadTotal += prod.cantidad;

            const itemHTML = `
                <div class="item-carrito">
                    <div class="item-carrito-foto">${prod.foto}</div>
                    <div class="item-carrito-info">
                        <div class="item-carrito-nombre">${prod.nombre}</div>
                        <div class="item-carrito-marca">${prod.marca}</div>
                        <div class="item-carrito-precio">S/ ${(prod.precio * prod.cantidad).toFixed(2)}</div>
                    </div>
                    <div class="item-carrito-cantidad">
                        <button class="btn-cant" data-accion="restar" data-idx="${idx}">−</button>
                        <span class="num-cantidad">${prod.cantidad}</span>
                        <button class="btn-cant" data-accion="sumar" data-idx="${idx}">+</button>
                    </div>
                    <button class="btn-eliminar-item" data-idx="${idx}" title="Eliminar">×</button>
                </div>
            `;
            listaItems.insertAdjacentHTML('beforeend', itemHTML);
        });

        if (totalMonto) totalMonto.textContent = `S/ ${total.toFixed(2)}`;
        if (contadorBadge) contadorBadge.textContent = cantidadTotal;
        if (btnFinalizar) btnFinalizar.disabled = false;

        listaItems.querySelectorAll('.btn-cant').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx    = parseInt(btn.dataset.idx);
                const accion = btn.dataset.accion;
                if (accion === 'sumar') {
                    carrito[idx].cantidad++;
                } else {
                    carrito[idx].cantidad--;
                    if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
                }
                guardarYRenderizar();
            });
        });

        listaItems.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                carrito.splice(idx, 1);
                guardarYRenderizar();
            });
        });
    }

    function guardarYRenderizar() {
        localStorage.setItem("carrito_alterego", JSON.stringify(carrito));
        renderizarCarrito();
    }

    renderizarCarrito();

    // Historial de pedidos dentro del DOMContentLoaded
    const contenedor = document.getElementById("lista-pedidos");
    if (contenedor) {
        const historial = JSON.parse(localStorage.getItem("historial_pedidos")) || [];
        if (historial.length === 0) {
            contenedor.innerHTML = "<p>Aún no has realizado ninguna compra.</p>";
        } else {
            historial.forEach(pedido => {
                const divPedido = document.createElement("div");
                divPedido.className = "tarjeta-pedido";
                divPedido.innerHTML = `
                    <h3>Pedido del ${pedido.fecha}</h3>
                    <p>Total: ${pedido.total}</p>
                    <ul>
                        ${pedido.productos.map(p => `<li>${p.nombre} (x${p.cantidad})</li>`).join('')}
                    </ul>
                `;
                contenedor.appendChild(divPedido);
            });
        }
    }
});

// Función global (se mantiene fuera porque se llama desde elementos HTML)
function guardarPedidoEnHistorial() {
    const carrito = JSON.parse(localStorage.getItem("carrito_alterego")) || [];
    let historial = JSON.parse(localStorage.getItem("historial_pedidos")) || [];
    
    const totalEl = document.getElementById("chk-total-global");
    
    const nuevoPedido = {
        fecha: new Date().toLocaleDateString(),
        productos: carrito,
        total: totalEl ? totalEl.innerText : "S/ 0.00"
    };
    
    historial.push(nuevoPedido);
    localStorage.setItem("historial_pedidos", JSON.stringify(historial));
    localStorage.removeItem("carrito_alterego");
    
    alert("¡Pedido realizado con éxito!");
    window.location.href = "./index.html";
}
        document.addEventListener("DOMContentLoaded", () => {
 
            const btnCategorias = document.getElementById('btn-categorias');
            const menuCategorias = document.getElementById('menu-categorias-lista');
 
            if (btnCategorias && menuCategorias) {
                btnCategorias.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const abierto = menuCategorias.classList.toggle('mostrar-menu-cuenta');
                    btnCategorias.classList.toggle('activo', abierto);
                });
            }
 
            document.addEventListener('click', () => {
                if (menuCategorias) menuCategorias.classList.remove('mostrar-menu-cuenta');
                if (btnCategorias) btnCategorias.classList.remove('activo');
            });
 
        });
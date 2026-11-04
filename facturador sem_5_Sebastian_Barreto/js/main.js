import { estado, agregar, cambiarCantidad, quitar } from "./estado.js";
import { calcularTotales, formatoDinero } from "./calculos.js";
import { inputBuscar, selectCategoria, contCatalogo, mensaje, listaCarrito, selectEnvio, btnVaciar, btnConfirmar, modalCarrito, abrirCarrito, cerrarCarritoBtn, carritoVacio } from "./dom.js";
import { render, renderCatalogo, renderResumen } from "./render.js";

// 7. EVENTOS: cambian el estado y luego llaman a render()

inputBuscar.addEventListener("input", () => {
  estado.busqueda = inputBuscar.value.trim();
  renderCatalogo();
});

selectCategoria.addEventListener("change", () => {
  estado.categoria = selectCategoria.value;
  renderCatalogo();
});

// Delegación: un listener para todos los botones "Agregar"
contCatalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const id = Number(boton.closest(".producto").dataset.id);
  agregar(id);
  mensaje.hidden = true;
  render();
});

// Delegación: − , + y ✕ de cada línea del carrito
listaCarrito.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const id = Number(boton.closest(".item").dataset.id);
  const accion = boton.dataset.accion;
  if (accion === "mas") cambiarCantidad(id, 1);
  if (accion === "menos") cambiarCantidad(id, -1);
  if (accion === "quitar") quitar(id);
  render();
});

selectEnvio.addEventListener("change", () => {
  estado.envio = selectEnvio.value;
  renderResumen();
});

btnVaciar.addEventListener("click", () => {
  estado.carrito = [];
  render();
});

btnConfirmar.addEventListener("click", () => {
  const total = calcularTotales().total;
  estado.pedidos++;
  const numero = String(estado.pedidos).padStart(3, "0");
  mensaje.textContent = `✅ Pedido #${numero} confirmado por ${formatoDinero(total)}. ¡Gracias por tu compra!`;
  mensaje.hidden = false;
  estado.carrito = [];
  render();
});

// Modal del carrito


const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
let cerrandoCarrito = false;

abrirCarrito.addEventListener("click", (evento) => {
  evento.preventDefault();
  if (modalCarrito.open || cerrandoCarrito) return;
  modalCarrito.showModal();
  document.body.classList.add("cart-open");
  if (!reducirMovimiento.matches) {
    modalCarrito.animate([
      { opacity: 0, transform: "translateY(28px) scale(.96)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ], { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" });
  }
});

async function cerrarCarrito() {
  if (!modalCarrito.open || cerrandoCarrito) return;
  cerrandoCarrito = true;
  try {
    if (!reducirMovimiento.matches) {
      await modalCarrito.animate([
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(20px) scale(.97)" },
      ], { duration: 180, easing: "ease-in", fill: "forwards" }).finished;
    }
  } finally {
    modalCarrito.close();
    modalCarrito.getAnimations().forEach((animacion) => animacion.cancel());
    document.body.classList.remove("cart-open");
    cerrandoCarrito = false;
  }
}

cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
modalCarrito.addEventListener("cancel", (evento) => {
  evento.preventDefault();
  cerrarCarrito();
});
modalCarrito.addEventListener("click", (evento) => {
  const limites = modalCarrito.getBoundingClientRect();
  if (evento.target === modalCarrito && (
    evento.clientX < limites.left || evento.clientX > limites.right ||
    evento.clientY < limites.top || evento.clientY > limites.bottom
  )) cerrarCarrito();
});
carritoVacio.querySelector("a").addEventListener("click", cerrarCarrito);

// 8. PRIMER DIBUJO al cargar la página
render();

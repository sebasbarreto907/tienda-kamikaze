import { catalogo } from "./datos.js";
import { estado } from "./estado.js";
import { formatoDinero, calcularTotales, totalUnidades } from "./calculos.js";
import { contCatalogo, sinResultados, listaCarrito, carritoVacio, btnConfirmar, btnVaciar, resumen, badge } from "./dom.js";
import { crearTarjetaProducto, crearItemCarrito, lineaResumen } from "./componentes.js";

// Actualizacion de la pantalla a partir del estado.
export function renderCatalogo() {
  const texto = estado.busqueda.toLowerCase();
  const visibles = catalogo.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria = estado.categoria === "todas" || p.categoria === estado.categoria;
    return coincideTexto && coincideCategoria;
  });

  contCatalogo.replaceChildren(); // vacía el contenedor
  for (const producto of visibles) {
    contCatalogo.append(crearTarjetaProducto(producto));
  }
  sinResultados.hidden = visibles.length > 0;
}

export function renderCarrito() {
  listaCarrito.replaceChildren();
  for (const item of estado.carrito) {
    listaCarrito.append(crearItemCarrito(item));
  }
  const vacio = estado.carrito.length === 0;
  carritoVacio.hidden = !vacio;
  btnConfirmar.disabled = vacio;
  btnVaciar.disabled = vacio;
}

export function renderResumen() {
  const t = calcularTotales();
  const unidades = totalUnidades();
  resumen.replaceChildren(
    lineaResumen(`Subtotal (${unidades} u.)`, formatoDinero(t.subtotal)),
    lineaResumen("Descuento", t.descuento > 0 ? `- ${formatoDinero(t.descuento)}` : "No aplica", "descuento"),
    lineaResumen("Envío", formatoDinero(t.envio)),
    lineaResumen("IVA (15 %)", formatoDinero(t.iva)),
    lineaResumen("Total", formatoDinero(t.total), "total")
  );
}

export function renderBadge() {
  const anterior = badge.textContent;
  badge.textContent = totalUnidades();
  if (badge.textContent !== anterior) {
    badge.classList.remove("pulso");
    void badge.offsetWidth; // reinicia la animación
    badge.classList.add("pulso");
  }
}

// Dibuja TODO a partir del estado
export function render() {
  renderCatalogo();
  renderCarrito();
  renderResumen();
  renderBadge();
}

// Referencias al HTML y enlaces de las fotos antes del primer render.
const contCatalogo = document.querySelector("#catalogo");

const fotosProductos = new Map();
const plantillaFotos = document.querySelector("#fotosProductos");
for (const foto of [
  ...(plantillaFotos?.content.querySelectorAll("img[data-producto]") || []),
  ...contCatalogo.querySelectorAll("img[data-producto]"),
]) {
  const enlace = foto.getAttribute("src")?.trim();
  if (enlace) fotosProductos.set(Number(foto.dataset.producto), enlace);
}
const sinResultados = document.querySelector("#sinResultados");
const inputBuscar = document.querySelector("#buscar");
const selectCategoria = document.querySelector("#categoria");
const listaCarrito = document.querySelector("#listaCarrito");
const carritoVacio = document.querySelector("#carritoVacio");
const selectEnvio = document.querySelector("#envio");
const resumen = document.querySelector("#resumen");
const btnConfirmar = document.querySelector("#btnConfirmar");
const btnVaciar = document.querySelector("#btnVaciar");
const mensaje = document.querySelector("#mensaje");
const badge = document.querySelector("#badge");

const modalCarrito = document.querySelector("#carrito");
const abrirCarrito = document.querySelector("#abrirCarrito");
const cerrarCarritoBtn = document.querySelector("#cerrarCarrito");

export { contCatalogo, fotosProductos, sinResultados, inputBuscar, selectCategoria, listaCarrito, carritoVacio, selectEnvio, resumen, btnConfirmar, btnVaciar, mensaje, badge, modalCarrito, abrirCarrito, cerrarCarritoBtn };

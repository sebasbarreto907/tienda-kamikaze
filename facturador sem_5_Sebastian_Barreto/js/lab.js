// lab.js · Laboratorio HTTP
// El navegador (CLIENTE) envía una PETICIÓN y el servidor (Live Server) devuelve una RESPUESTA.
// fetch() hace la petición desde JavaScript; lo veremos a fondo en la semana 9.

import { crearElemento } from "./dom.js"; // reutilizamos el módulo de la semana 5

const registro = document.querySelector("#registro");
const resumenRegistro = document.querySelector("#resumenRegistro");
const sinRespuesta = document.querySelector("#sinRespuesta");
const detalle = document.querySelector("#detalle");
const lineaEstado = document.querySelector("#lineaEstado");
const significado = document.querySelector("#significado");
const listaCabeceras = document.querySelector("#cabeceras");
const cuerpo = document.querySelector("#cuerpo");

let historial = []; // cada petición registrada: { metodo, url, estado, tipo, bytes, ms }

// 1. Clasificar el código de estado por su primer dígito (familias 2xx, 3xx, 4xx, 5xx)
export function clasificar(estado) {
  if (estado >= 200 && estado < 300) return { clase: "exito", texto: "2xx · Éxito: el servidor entregó lo que se pidió" };
  if (estado >= 300 && estado < 400) return { clase: "redireccion", texto: "3xx · Redirección o caché: el recurso está en otro lugar o no cambió" };
  if (estado >= 400 && estado < 500) return { clase: "error-cliente", texto: "4xx · Error del cliente: la petición está mal (ruta, permiso, método)" };
  if (estado >= 500) return { clase: "error-servidor", texto: "5xx · Error del servidor: falló algo del lado del servidor" };
  return { clase: "sin-respuesta", texto: "Sin respuesta: no hubo comunicación con el servidor" };
}

// 2. Enviar la petición y medir el tiempo
async function pedir(metodo, url) {
  const inicio = performance.now();
  try {
    const respuesta = await fetch(url, { method: metodo, cache: "no-store" });
    const texto = metodo === "HEAD" ? "" : await respuesta.text();
    const ms = Math.round(performance.now() - inicio);
    const tipo = respuesta.headers.get("Content-Type") || "—";
    const bytes = new Blob([texto]).size;

    registrar({ metodo, url, estado: respuesta.status, tipo, bytes, ms });
    mostrarRespuesta(respuesta, texto);
  } catch (error) {
    // fetch solo "falla" cuando NO hay respuesta (servidor apagado, sin red, file://)
    registrar({ metodo, url, estado: 0, tipo: "—", bytes: 0, ms: Math.round(performance.now() - inicio) });
    mostrarSinRespuesta(error);
  }
}

// 3. Mostrar la respuesta: línea de estado, cabeceras y cuerpo
function mostrarRespuesta(respuesta, texto) {
  sinRespuesta.hidden = true;
  detalle.hidden = false;

  lineaEstado.textContent = `HTTP ${respuesta.status} ${respuesta.statusText}`;
  const familia = clasificar(respuesta.status);
  significado.className = `significado ${familia.clase}`;
  significado.textContent = familia.texto;

  listaCabeceras.replaceChildren();
  for (const [nombre, valor] of respuesta.headers) {
    const li = crearElemento("li");
    li.append(crearElemento("strong", { texto: `${nombre}: ` }), valor);
    listaCabeceras.append(li);
  }

  if (texto === "") {
    cuerpo.textContent = "(sin cuerpo: HEAD solo pide las cabeceras)";
  } else if ((respuesta.headers.get("Content-Type") || "").includes("json") && respuesta.ok) {
    const datos = JSON.parse(texto);
    cuerpo.textContent = `Se recibieron ${datos.length} productos en formato JSON.\n\n${texto.slice(0, 300)}`;
  } else {
    cuerpo.textContent = texto.slice(0, 300);
  }
}

function mostrarSinRespuesta(error) {
  sinRespuesta.hidden = true;
  detalle.hidden = false;
  lineaEstado.textContent = "Sin respuesta";
  significado.className = "significado sin-respuesta";
  significado.textContent = "No hubo comunicación: ¿Live Server está encendido? ¿Abriste la página con file://?";
  listaCabeceras.replaceChildren();
  cuerpo.textContent = String(error);
}

// 4. Agregar una fila al registro
function registrar(peticion) {
  historial.push(peticion);
  const familia = clasificar(peticion.estado);

  const fila = crearElemento("tr");
  const celdaEstado = crearElemento("td");
  celdaEstado.append(crearElemento("span", { clase: `estado ${familia.clase}`, texto: peticion.estado || "—" }));
  fila.append(
    crearElemento("td", { texto: historial.length }),
    crearElemento("td", { texto: peticion.metodo }),
    crearElemento("td", { texto: peticion.url }),
    celdaEstado,
    crearElemento("td", { texto: peticion.tipo }),
    crearElemento("td", { texto: `${peticion.bytes} B` }),
    crearElemento("td", { texto: `${peticion.ms} ms` })
  );
  registro.append(fila);
  actualizarResumen();
}

function actualizarResumen() {
  const exitos = historial.filter((p) => p.estado >= 200 && p.estado < 300).length;
  const errores = historial.length - exitos;
  resumenRegistro.textContent = historial.length === 0
    ? ""
    : `${historial.length} peticiones · ${exitos} con éxito (2xx) · ${errores} sin éxito`;
}

// 5. Eventos
document.querySelector(".rapidos").addEventListener("click", (evento) => {
  const boton = evento.target.closest(".rapido");
  if (!boton) return;
  pedir(boton.dataset.metodo, boton.dataset.url);
});

document.querySelector("#formPeticion").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const metodo = document.querySelector("#metodo").value;
  const url = document.querySelector("#url").value.trim();
  if (url) pedir(metodo, url);
});

document.querySelector("#btnLimpiar").addEventListener("click", () => {
  historial = [];
  registro.replaceChildren();
  actualizarResumen();
});
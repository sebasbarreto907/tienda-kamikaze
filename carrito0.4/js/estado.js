// Estado compartido y operaciones del carrito.
export const estado = {
  carrito: [],        
  busqueda: "",
  categoria: "todas",
  envio: "retiro",
  pedidos: 0,
};

export function agregar(id) {
  const item = estado.carrito.find((i) => i.id === id);
  if (item) {
    item.cantidad++;
  } else {
    estado.carrito.push({ id: id, cantidad: 1 });
  }
}

export function cambiarCantidad(id, cambio) {
  const item = estado.carrito.find((i) => i.id === id);
  item.cantidad += cambio;
  if (item.cantidad <= 0) quitar(id);
}

export function quitar(id) {
  estado.carrito = estado.carrito.filter((i) => i.id !== id);
}

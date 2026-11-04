// Catalogo y constantes de la tienda.
export const IVA = 0.15; // IVA: 15 %
export const catalogo = [
  {
    "id": 1,
    "nombre": "Bandera KAMIKAZE CUENCA",
    "precio": 50,
    "categoria": "Accesorios",
    "imagen": "bandera-cuenca",
    "color": "#252a28"
  },
  {
    "id": 2,
    "nombre": "Shorts Thai Dragon Ball Z",
    "precio": 45,
    "categoria": "Shorts",
    "imagen": "shorts-dragonball",
    "color": "#b83e2c"
  },
  {
    "id": 3,
    "nombre": "Shorts Thai Dragon",
    "precio": 40,
    "categoria": "Shorts",
    "imagen": "shorts-dragon",
    "color": "#272b28"
  },
  {
    "id": 4,
    "nombre": "Camiseta Nak Muay Prodigium",
    "precio": 45,
    "categoria": "Camisetas",
    "imagen": "camiseta-prodigium",
    "color": "#e8dfca"
  },
  {
    "id": 5,
    "nombre": "Guantes naga tahi UFC DRAGON DORADO",
    "precio": 80,
    "categoria": "Guantes",
    "imagen": "guantes-dragon",
    "color": "#bb432c"
  },
  {
    "id": 6,
    "nombre": "Guantes de Muay Yamantaka Fairtex",
    "precio": 175,
    "categoria": "Guantes",
    "imagen": "guantes-yamantaka",
    "color": "#676d4e"
  },
  {
    "id": 7,
    "nombre": "Guantes de Muay tahi Fairtex URFACE",
    "precio": 250,
    "categoria": "Guantes",
    "imagen": "guantes-urface",
    "color": "#62694c"
  },
  {
    "id": 8,
    "nombre": "Bolsa Fairtex Pro Fight Bag",
    "precio": 60,
    "categoria": "Accesorios",
    "imagen": "bolsa",
    "color": "#30342f"
  }
];

export const buscarProducto = (id) => catalogo.find((p) => p.id === id);

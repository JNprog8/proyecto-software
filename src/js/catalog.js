/**
 * Catálogo e-commerce local.
 * Renderiza productos, aplica búsqueda/categoría y permite compra directa.
 */

import { addToCart } from './state.js';
import { formatPrice } from './format.js';

const container = document.querySelector('[data-catalog]');
const emptyMessage = document.querySelector('[data-catalog-empty]');
const summary = document.querySelector('[data-catalog-summary]');
const searchInput = document.querySelector('[data-search-input]');
const filterButtons = document.querySelectorAll('[data-category-filter]');
const categoryLinks = document.querySelectorAll('[data-category-link]');

/** @typedef {'fisico' | 'digital'} ProductFormat */
/** @typedef {{ id: string, nombre: string, precio: number, categoria: string, formato: ProductFormat, stock: number, detalle: string, visual: string }} Producto */

/** @type {Producto[]} */
const PRODUCTOS = [
  {
    id: 'gpu-4060',
    nombre: 'Placa de Video RTX 4060 OC 8GB',
    precio: 489999,
    categoria: 'Componentes',
    formato: 'fisico',
    stock: 6,
    detalle: 'Ideal para 1080p alto y streaming.',
    visual: 'gpu',
  },
  {
    id: 'cpu-ryzen-5',
    nombre: 'Procesador Ryzen 5 7600 AM5',
    precio: 319999,
    categoria: 'Componentes',
    formato: 'fisico',
    stock: 9,
    detalle: '6 nucleos, gran base para PC gamer.',
    visual: 'cpu',
  },
  {
    id: 'ssd-nvme',
    nombre: 'SSD NVMe 1TB Gen4',
    precio: 114999,
    categoria: 'Almacenamiento',
    formato: 'fisico',
    stock: 14,
    detalle: 'Carga rapida para sistema, juegos y trabajo.',
    visual: 'ssd',
  },
  {
    id: 'console-next',
    nombre: 'Consola NextGen X 1TB',
    precio: 799999,
    categoria: 'Consolas',
    formato: 'fisico',
    stock: 4,
    detalle: 'Incluye control inalambrico y garantia.',
    visual: 'console',
  },
  {
    id: 'joy-pro',
    nombre: 'Joystick Pro Wireless',
    precio: 89999,
    categoria: 'Periféricos',
    formato: 'fisico',
    stock: 12,
    detalle: 'Compatible con PC y consolas principales.',
    visual: 'controller',
  },
  {
    id: 'game-racer-digital',
    nombre: 'Turbo Racer Deluxe',
    precio: 24999,
    categoria: 'Videojuegos',
    formato: 'digital',
    stock: 99,
    detalle: 'Codigo digital con entrega por email.',
    visual: 'game',
  },
  {
    id: 'game-rpg-physical',
    nombre: 'Nebula Quest Edicion Fisica',
    precio: 54999,
    categoria: 'Videojuegos',
    formato: 'fisico',
    stock: 7,
    detalle: 'Caja fisica para consola.',
    visual: 'case',
  },
  {
    id: 'headset-rgb',
    nombre: 'Auricular RGB 7.1',
    precio: 69999,
    categoria: 'Periféricos',
    formato: 'fisico',
    stock: 11,
    detalle: 'Microfono desmontable y sonido envolvente.',
    visual: 'headset',
  },
];

let selectedCategory = 'Todos';
let searchTerm = '';

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filteredProducts() {
  const normalizedSearch = normalize(searchTerm);

  return PRODUCTOS.filter((producto) => {
    const matchesCategory = selectedCategory === 'Todos' || producto.categoria === selectedCategory;
    const haystack = normalize(`${producto.nombre} ${producto.categoria} ${producto.formato} ${producto.detalle}`);
    return matchesCategory && haystack.includes(normalizedSearch);
  });
}

/** @param {Producto} producto */
function renderCard(producto) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const media = document.createElement('div');
  media.className = `product-card__media product-card__media--${producto.visual}`;

  const visual = document.createElement('span');
  visual.className = `product-visual product-visual--${producto.visual}`;
  visual.setAttribute('aria-hidden', 'true');
  media.appendChild(visual);

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const meta = document.createElement('div');
  meta.className = 'product-card__meta';

  const category = document.createElement('span');
  category.className = 'badge';
  category.textContent = producto.categoria;

  const format = document.createElement('span');
  format.className = `badge badge--${producto.formato}`;
  format.textContent = producto.formato === 'fisico' ? 'Físico' : 'Digital';

  meta.append(category, format);

  const name = document.createElement('h3');
  name.className = 'product-card__name';
  name.textContent = producto.nombre;

  const detail = document.createElement('p');
  detail.className = 'product-card__detail';
  detail.textContent = producto.detalle;

  const stock = document.createElement('p');
  stock.className = 'product-card__stock';
  stock.textContent = `${producto.stock} disponibles`;

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = formatPrice(producto.precio);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn--primary product-card__buy';
  button.dataset.addToCart = producto.id;
  button.textContent = 'Agregar al carrito';

  body.append(meta, name, detail, stock, price, button);
  card.append(media, body);
  return card;
}

function render() {
  if (!container) return;

  const products = filteredProducts();
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  products.forEach((producto) => fragment.appendChild(renderCard(producto)));
  container.appendChild(fragment);

  if (emptyMessage) emptyMessage.hidden = products.length > 0;
  if (summary) {
    const categoryLabel = selectedCategory === 'Todos' ? 'productos' : selectedCategory.toLowerCase();
    summary.textContent = `${products.length} ${categoryLabel} encontrados`;
  }
}

function setActiveCategory(category) {
  selectedCategory = category;
  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.categoryFilter === category);
  });
  render();
}

function handleCatalogClick(event) {
  const addButton = event.target.closest('[data-add-to-cart]');
  if (!addButton) return;

  const producto = PRODUCTOS.find((item) => item.id === addButton.dataset.addToCart);
  if (producto) {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      formato: producto.formato,
    });
  }
}

function handleFilterClick(event) {
  const button = event.target.closest('[data-category-filter]');
  if (!button) return;
  setActiveCategory(button.dataset.categoryFilter);
}

function handleCategoryLinkClick(event) {
  const link = event.target.closest('[data-category-link]');
  if (!link) return;
  setActiveCategory(link.dataset.categoryLink);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function initCatalog() {
  if (!container) return;

  render();
  container.addEventListener('click', handleCatalogClick);
  filterButtons.forEach((button) => button.addEventListener('click', handleFilterClick));
  categoryLinks.forEach((link) => link.addEventListener('click', handleCategoryLinkClick));
  searchInput?.form?.addEventListener('submit', handleSearchSubmit);
  searchInput?.addEventListener('input', (event) => {
    searchTerm = event.target.value;
    render();
  });
}

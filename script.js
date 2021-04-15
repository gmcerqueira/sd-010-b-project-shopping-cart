const olOfCartShopping = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function fetchProducts(query) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const products = await response.json();
  return products.results;
}

async function getProducts() {
  const productSpace = document.querySelector('.items');
  const productsResult = await fetchProducts('computador');
  productsResult.forEach((product) => productSpace.appendChild(createProductItemElement(product)));
  // console.log(productsResult);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  const cartElement = document.querySelector(olOfCartShopping);
  localStorage.setItem('cartShopping', JSON.stringify(cartElement.innerHTML));
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchItem(productID) {
  const itemInfo = await fetch(`https://api.mercadolibre.com/items/${productID}`);
  const item = await itemInfo.json();
  return item;
}

async function addItemToCart(productID) {
  const cartElement = document.querySelector(olOfCartShopping);
  const item = await fetchItem(productID);
  cartElement.appendChild(createCartItemElement(item));
  localStorage.setItem('cartShopping', JSON.stringify(cartElement.innerHTML));
}

function eventListenerToAllButtons() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((but) => but.addEventListener('click', (evt) => {
    const productID = evt.target.parentElement.firstChild.innerText;
    addItemToCart(productID);
  }));
}

function loadCartShopping() {
  const savedCart = localStorage.getItem('cartShopping');
  const cartElement = document.querySelector(olOfCartShopping);
  cartElement.innerHTML = JSON.parse(savedCart);
  cartElement.childNodes.forEach((item) => // childNodes return an array of child nodes
    item.addEventListener('click', cartItemClickListener));
}

window.onload = async function onload() {
  await getProducts();
  eventListenerToAllButtons();
  loadCartShopping();
};

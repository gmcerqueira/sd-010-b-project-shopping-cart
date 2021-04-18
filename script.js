async function getData(type) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${type}`);
  const data = await response.json();
  const computerList = await data.results;
  return computerList;
}

async function fetchIdItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await response.json();
  const itemReceived = await item;
  return itemReceived;
}

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

let cart = [];

const cartListItems = document.querySelector('.cart__items');

function saveCart({ id, title, price }) {
  cart.push({ id, title, price });
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function cartItemClickListener(event) {
  const removeItem = cart.find(({ id }) => id === event.target);
  cart.splice(removeItem, 1);
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  cartListItems.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  cartListItems.appendChild(li);
  return li;
}

function loadCart() {
  const savedCart = localStorage.getItem('shoppingCart');
  cart = savedCart === null ? [] : JSON.parse(savedCart);
  cart.forEach((item) => createCartItemElement(item));
}

const clearButton = document.querySelector('.empty-cart');

clearButton.addEventListener('click', () => {
  while (cartListItems.firstChild) {
    cartListItems.removeChild(cartListItems.firstElementChild);
  }
  cart = [];
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
});

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add',
   'Adicionar ao carrinho!')).addEventListener('click', async (event) => {
    const returnIdItem = getSkuFromProductItem(event.target.parentNode);
    const itemID = await fetchIdItem(returnIdItem);
    saveCart(itemID);
    createCartItemElement(itemID);
  });
  return section;
}

async function addSectionElements() {
  const list = await getData('Computador');
  const classItems = document.querySelector('.items');
  list.forEach((item) => {
    const computers = createProductItemElement(item);
     classItems.appendChild(computers);
  });
}

window.onload = async function onload() {
  await addSectionElements();
  loadCart();
};
// Referências

// Referência requisito 3

// https://www.youtube.com/watch?v=LEtLtRXBDms&t=390s&ab_channel=RogerMelo

// Referências requisito 4, 

// https://www.youtube.com/watch?v=WmBXh9ma138&ab_channel=MitchellHudson
// https://www.youtube.com/watch?v=H7gGkUNoKSM&t=344s&ab_channel=MitchellHudson
// também recebi ajuda do colega Misabel Bueno
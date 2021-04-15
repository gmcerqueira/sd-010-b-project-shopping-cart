const sectionItems = document.getElementsByClassName('items')[0];
const cartItems = document.getElementsByClassName('cart__items')[0];
const emptyCartButton = document.getElementsByClassName('empty-cart')[0];
let arrayStorage = [];

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function sendToLocalStorage(array) {
  const JSONArray = JSON.stringify(array);
  localStorage.setItem('arrayStorage', JSONArray);
  }

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  arrayStorage.push({ text: li.innerText });
  return li;
}

function requestById(event) {
  const getTargetId = event.target.parentNode.firstChild;
  fetch(`https://api.mercadolibre.com/items/${getTargetId.innerText}`)
  .then((response) => response.json())
  .then((obj) => createCartItemElement(obj)) 
  .then((cartElement) => cartItems.appendChild(cartElement))
  .then(() => sendToLocalStorage(arrayStorage));
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', requestById);
  return section;
}

function makeRequest() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((obj) => (obj.results))
  .then((results) => results.forEach((element) => 
    sectionItems.append(createProductItemElement(element))));
}

function getLocalStorage() {
if (localStorage) {
  arrayStorage = [];
  const getCartItems = document.querySelector('.cart__items');
  const getArray = localStorage.getItem('arrayStorage');
  const parsedArray = JSON.parse(getArray);
if (parsedArray) {
  parsedArray.forEach((obj) => {
    const cartItem = document.createElement('li');
    cartItem.innerText = obj.text;
    arrayStorage.push({ text: obj.text });
    getCartItems.appendChild(cartItem);
  });
}
}
}

window.onload = function onload() { 
  makeRequest();
  emptyCartButton.addEventListener('click', cartItemClickListener);
  getLocalStorage();
};

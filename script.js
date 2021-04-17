const sectionItemsContainer = document.querySelector('.items');
const getTotalPriceFatherElement = document.querySelector('.total-price');
const sumElement = document.createElement('span');
getTotalPriceFatherElement.appendChild(sumElement);
const cartContainer = document.querySelector('.cart');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function sendSum(paramSum) {
  let sum = paramSum;
  sum = String(sum);
  sumElement.innerText = sum;
}

function snapShotCart() {
  const cartSnapShot = window.document.querySelectorAll('.cart__item');
  const cartSnapShotArray = [];
  let cartItemSum = 0;
  cartSnapShot.forEach((cartItem) => {
    cartSnapShotArray.push(cartItem.innerText);
    cartItemSum += parseFloat(cartItem.innerText.split('$')[1]);
  });
  sendSum(cartItemSum);
  return cartSnapShotArray;
}

async function addToLocalStorage() {
  const returnedCartSnapShotArray = snapShotCart();
  const JSONreturnedCartSnapShotArray = JSON.stringify(
    returnedCartSnapShotArray,
  );
  localStorage.setItem('cart', JSONreturnedCartSnapShotArray);
}

function cartItemClickListener(event) {
  event.target.remove();
  addToLocalStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  addToLocalStorage();
  return li;
}

function showLoading() {
  const loadingMsg = document.createElement('div');
  loadingMsg.innerText = 'Carregando...';
  loadingMsg.className = 'loading';
  cartContainer.appendChild(loadingMsg);
}

function removeLoading() {
  if (cartContainer.lastChild.innerText === 'Carregando...') {
    cartContainer.lastChild.remove();
  }
}

async function addToCart(event) {
  const eventId = await getSkuFromProductItem(event.target.parentNode);
  showLoading();
  const obj = await fetch(`https://api.mercadolibre.com/items/${eventId}`);
  removeLoading();
  const objJSON = await obj.json();
  return createCartItemElement(objJSON);
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', addToCart);
  return section;
}

async function requestObj(param) {
  showLoading();
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${param}`)
    .then((response) => response.json())
    .then((obj) => obj.results);
}

async function createAllProducts() {
  const requestedArray = await requestObj('computador');
  removeLoading();
  requestedArray.forEach((obj) =>
    sectionItemsContainer.appendChild(createProductItemElement(obj)));
}

async function loadStorage() {
  const getStoredCartItems = localStorage.getItem('cart');
  const retrievedStoredArray = JSON.parse(getStoredCartItems);
  retrievedStoredArray.forEach((cartItem) => {
    const li = document.createElement('li');
    const cartItems = document.querySelector('.cart__items');
    li.className = 'cart__item';
    li.innerText = cartItem;
    li.addEventListener('click', cartItemClickListener);
    cartItems.appendChild(li);
  });
}

function emptyCart() {
  const cartSnapShot = window.document.querySelectorAll('.cart__item');
  cartSnapShot.forEach((cartItem) => cartItem.remove());
  addToLocalStorage();
}
const getEmptyCartButton = document.querySelector('.empty-cart');
getEmptyCartButton.addEventListener('click', emptyCart);

window.onload = function onload() {
  createAllProducts();
  loadStorage();
  snapShotCart();
};

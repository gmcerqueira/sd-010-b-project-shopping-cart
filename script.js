// const fetch = require('node-fetch');

const strCartItems = '.cart__items';

function hideAndShowLoading(action) {
  const container = document.querySelector('.container');
  console.log(container);
  if (action === 'show') {
    const loading = document.createElement('section');
    loading.className = 'loading';
    loading.innerText = 'loading...';
    container.appendChild(loading);
  } else {
    container.removeChild(container.lastChild);
  }
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function calculateTotalPrice() {
  const allItems = [...document.querySelector(strCartItems).children];
  const itemsIds = allItems.map((item) => item.innerText).map((string) => 
    string.split(' ')).map((arr) => arr[1]);
  const prices = [];
  hideAndShowLoading('show');
  itemsIds.forEach((id) => {
    const url = `https://api.mercadolibre.com/items/${id}`;
    fetch(url).then((response) => response.json()).then((response) => 
    prices.push(response.price)).then(() => {
      const priceCalculated = document.getElementById('calculated-price');
      const totalPrice = prices.reduce((acc, curr) => acc + curr);
      priceCalculated.innerText = totalPrice;
    });
  });
  if (itemsIds.length === 0) document.getElementById('calculated-price').innerText = '0,00';
  hideAndShowLoading('');
}

function cartItemClickListener(event) {
  const cartItems = event.target.parentElement;
  cartItems.removeChild(event.target);
  localStorage.setItem('shoppingCart', cartItems.innerHTML);
  calculateTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addToCart() {
  const addItems = document.getElementsByClassName('item__add');
  // console.log(addItems);
  for (let i = 0; i < addItems.length; i += 1) {
    addItems[i].addEventListener('click', (element) => {
      const product = element.target.parentElement;
      const url = `https://api.mercadolibre.com/items/${getSkuFromProductItem(product)}`;
      hideAndShowLoading('show');
      fetch(url).then((response) => response.json()).then((obj) => {
        const cartItems = document.querySelector(strCartItems);
        cartItems.appendChild(createCartItemElement(obj));
        localStorage.setItem('shoppingCart', cartItems.innerHTML);
        calculateTotalPrice();
      });
      hideAndShowLoading('');
    });
  }
}

function createElements() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';
  hideAndShowLoading('show');
  fetch(url).then((response) => response.json()).then((computers) => {
    computers.results.forEach((computer) => {
      const itemsContainer = document.querySelector('.items');
      const newComputer = createProductItemElement(computer);
      itemsContainer.appendChild(newComputer);
    });
    addToCart();
  });
  hideAndShowLoading('');
}

function setShoppingCart() {
  const cartItems = document.querySelector(strCartItems);
  const localCart = localStorage.getItem('shoppingCart');
  cartItems.innerHTML = localCart;
  const items = cartItems.children;
  for (let i = 0; i < items.length; i += 1) {
    items[i].addEventListener('click', cartItemClickListener);
  }
  calculateTotalPrice();
}

const clearCart = () => {
  const emptyCartBtn = document.getElementsByClassName('empty-cart')[0];
  emptyCartBtn.addEventListener('click', () => {
    const cartItems = document.querySelector(strCartItems);
    cartItems.innerHTML = '';
    calculateTotalPrice();
  });
};

window.onload = function onload() {
  createElements();
  setShoppingCart();
  clearCart();
  // hideAndShowLoading('');
};
// #VQV

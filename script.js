// const fetch = require('node-fetch');

// const { default: fetch } = require("node-fetch");

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

function cartItemClickListener(event) {
  const cart = event.target.parentElement;
  cart.removeChild(event.target);
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
      fetch(url).then((response) => response.json()).then((obj) => {
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(createCartItemElement(obj));
      });
    });
  }
}

function createElements() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';
  fetch(url).then((response) => response.json()).then((computers) => {
    computers.results.forEach((computer) => {
      const itemsContainer = document.querySelector('.items');
      const newComputer = createProductItemElement(computer);
      itemsContainer.appendChild(newComputer);
    });
    addToCart();
  });
}

window.onload = function onload() {
  createElements();
};
// #VQV

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

function sum() {
  const liPrice = document.querySelectorAll('.cart__item');
  const spanPrice = document.querySelector('.total-price');
  const arrayPrices = [];
  liPrice.forEach((price) => {
    const textLi = price.innerText;
    const prices = textLi.substring(textLi.indexOf('$') + 1, textLi.length);
    arrayPrices.push(Number(prices));
    const totalPrices = arrayPrices.reduce((acc, cur) => acc + cur);
    spanPrice.innerText = totalPrices;
  });
}

function cartItemClickListener(event) {
  event.target.remove();
  sum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector('.cart__items');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  cartItems.appendChild(li);
  sum();
}

const valueStorage = [];

async function productSelect(endpoint) {
  const response = await fetch(endpoint);
  const product = await response.json();
  valueStorage.push(product);
  localStorage.setItem('product', JSON.stringify(valueStorage));    
  
  createCartItemElement(product);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const sectionItems = document.querySelector('.items');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
    const endpoint = `https://api.mercadolibre.com/items/${sku}`;
    productSelect(endpoint);
  });

  return sectionItems.appendChild(section);
}

async function getProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  results.forEach((computers) => createProductItemElement(computers));
  document.querySelector('.loading').remove();
}

function backStorage(products) {
  products.forEach((product) => {
    createCartItemElement(product);
  });
}
function emptyCart() {
  const cart = document.querySelector('.empty-cart');
  cart.addEventListener('click', () => {
    const listCart = document.querySelectorAll('.cart__item');
    listCart.forEach((lista) => {
      lista.remove();
      const spanPrice = document.querySelector('.total-price');
      spanPrice.innerText = '';
    });
  });
}

window.onload = function onload() { 
  getProducts();
  const productString = localStorage.getItem('product');
  const productObject = JSON.parse(productString);
  if (productObject) backStorage(productObject);
  emptyCart();
  sum();
};
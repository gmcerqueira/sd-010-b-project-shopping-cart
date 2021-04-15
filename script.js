// const fetch = require('node-fetch');

// Get data from API
function getData() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json())
    .then((r) => (r.results))
    .catch((error) => error);
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProductId(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((r) => r.json())
    .then((r) => (r))
    .catch((error) => error);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function sumPrices() {
  const cartItems = document.getElementsByClassName('cart__item');
  let amount = 0;
  for (let i = 0; i < cartItems.length; i += 1) {
    const value = cartItems[i].innerText.substring(cartItems[i].innerText.indexOf('$') + 1);
    amount += parseFloat(value);
  }
  const amountEl = document.querySelector('.total-price');
  amountEl.innerText = Math.round(amount * 100) / 100;
}
// REFERENCE substring and indexOf: https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232

function cartItemClickListener(event) {
  event.target.remove();
  sumPrices();
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
}

// creates a eventListener for add buttons
async function cartBtnListener(event) {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const parent = event.target.parentElement;
  const prodID = getSkuFromProductItem(parent);
  const prod = await getProductId(prodID);

  const newEl = createCartItemElement({
    sku: prod.id,
    name: prod.title,
    salePrice: prod.price,
  });
  newEl.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(newEl);
  sumPrices();
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const cartBtn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  cartBtn.addEventListener('click', cartBtnListener); // add a listener for every button
  section.appendChild(cartBtn);

  return section;
}

// render products on window. 
async function renderProducts() {
  const allProducts = await getData();
  allProducts.forEach((el) => {
    const newItem = createProductItemElement({
      sku: el.id,
      name: el.title,
      image: el.thumbnail,
    });
    document.querySelector('.items').appendChild(newItem);
  });
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartItems');
}

window.onload = function onload() {
  renderProducts();
};

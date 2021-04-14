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

async function cartBtnListener(event) {
  const parent = event.target.parentElement;
  const prodID = getSkuFromProductItem(parent);
  const prod = await getProductId(prodID);
  const newEl = createCartItemElement({ sku: prod.id, name: prod.title, salePrice: prod.price });
  document.querySelector('.cart__items').appendChild(newEl);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const cartBtn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  cartBtn.addEventListener('click', cartBtnListener);
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
}

window.onload = function onload() {
  renderProducts();
};

// function cartItemClickListener(event) {
//   // codigo
// }
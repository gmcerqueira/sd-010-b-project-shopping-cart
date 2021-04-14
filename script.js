// const fetch = require('node-fetch');

const getItemsResults = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const responseObj = await response.json();
  const results = await responseObj.results;
  
  return results;
};

const getItemById = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responseObj = await response.json();
  
  return responseObj;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const cartItemClickListener = () => {};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const renderCardItem = (item) => {
  const cardItem = createCartItemElement(item);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(cardItem);
};

// Retorna o ID do elemento
const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const itemClickListener = async (event) => {
  // Retorna o pai do elemento clicado.
  const item = event.target.parentNode;
  const itemObj = await getItemById(getSkuFromProductItem(item));
  renderCardItem(itemObj);
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const cartAddButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  cartAddButton.addEventListener('click', (event) => { itemClickListener(event); });
  section.appendChild(cartAddButton);

  return section;
};

const renderItems = async () => {
  const results = await getItemsResults();
  const items = document.querySelector('.items');
  results.forEach((item) => {
    items.appendChild(createProductItemElement(item));
  });
};

window.onload = () => {
  renderItems();
};
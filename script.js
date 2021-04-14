// const { templateSettings } = require('cypress/types/lodash');

window.onload = function onload() { };

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criaDom(itens) {
  const shelf = document.getElementsByClassName('items');
  for (let index = 0; index < 6; index += 1) {
    const placeOfItem = document.createElement('div');
    shelf[0].appendChild(placeOfItem);
    const esse = shelf[0].lastChild;
    esse.id = itens.id;
    esse.className = 'itensInShelf';
    esse.appendChild(createProductItemElement(itens[index]));
  }
}

function getItensListFromApi() {
const query = 'computador';
const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};
fetch(API_URL, myObject)
    .then((response) => response.json())
    .then(({ results }) => {
      console.log(results);
      criaDom(results);
    });
}

getItensListFromApi();
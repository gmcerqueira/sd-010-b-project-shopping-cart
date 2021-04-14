// const fetch = require('node-fetch');

const siteFetch = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((response) => response.results)
    .catch(() => alert('Something went wrong.'));

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

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const addItems = async () => {
  const results = await siteFetch();
  const items = document.querySelector('.items');
  results.forEach((item) => {
    items.appendChild(createProductItemElement(item));
  });
};

// const getSkuFromProductItem = (item) => {
//   return item.querySelector('span.item__sku').innerText;
// }

// const cartItemClickListener = (event) => {
//   // coloque seu código aqui
// }

// const createCartItemElement = ({ sku, name, salePrice }) => {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = () => {
  addItems();
};
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
// const fetch = require('node-fetch');

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener({ target }) {
  // coloque seu código aqui
  target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sendItemToCart = async ({ target }) => {
  const idItem = getSkuFromProductItem(target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
      .then((product) => {
        const item = {
          sku: product.id,
          name: product.title,
          salePrice: product.price,
        };
        // console.log(item);
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
      });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', sendItemToCart);

  return section;
}

const fetchFunction = (QUERY) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((response) => response.json())
      .then((products) => {
        products.results.forEach((product) => {
          const item = {
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
          };
          document.querySelector('.items').appendChild(createProductItemElement(item));
        });
      });
};

window.onload = async function onload() {
  fetchFunction('computador');
 }; 

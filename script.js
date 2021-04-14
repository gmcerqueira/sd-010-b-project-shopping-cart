// const fetch = require('node-fetch');

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
   console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  2
const requisicao = (elementoEmQuestao) => {
  const itemEmQuestao = elementoEmQuestao.path[1].firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemEmQuestao}`)
  .then((response) => response.json())
  .then((objetoBruto) => {
    const objetoFino = {
      sku: objetoBruto.id,
      name: objetoBruto.title,
      salePrice: objetoBruto.price,
    };
    const cartItemLi = createCartItemElement(objetoFino);
    document.querySelector('.cart__items').appendChild(cartItemLi);
    // console.log(objetoBruto);
  });
};

//  1
const fetchProduct = (QUERY) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
  .then((response) => response.json())
  .then((products) => {
    products.results.forEach((produto) => {
      const cadaProduto = {
        sku: produto.id,
        name: produto.title,
        image: produto.thumbnail,
      };
      const elemento = createProductItemElement(cadaProduto);
      document.querySelector('.items').appendChild(elemento);
      elemento.querySelector('button').addEventListener('click', requisicao);
    });
  });
};

window.onload = function onload() { 
  fetchProduct('computador');
};

/* eslint-disable max-lines-per-function */
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

// Remover os itens com o clique
function cartItemClickListener(event) {
  event.target.remove();
}

// Estrututa dos itens na tela
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Estrutura dos itens no carrinho de compras
const addProductToCart = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((result) => {
    const product = { sku: result.id, name: result.title, salePrice: result.price };

    const selectItem = document.querySelector('.cart__items');
    selectItem.appendChild(createCartItemElement(product));
  });
};

// Captura o id de cada item
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Cria os elementos do carrinho e captura seus elementos, com ajuda da função getSkuFromProductItem
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', (event) => {
    const getItem = event.target;
    addProductToCart(getSkuFromProductItem(getItem.parentNode));
  });
  return section;
}

const getProduct = async () => {
  const product = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const result = await product.json();
  const { results } = result;
    const resultsApi = results.map(({ id, title, thumbnail }) => 
      createProductItemElement({ sku: id, name: title, image: thumbnail }));

    const selectItem = document.querySelector('.items');
    
    resultsApi.forEach((element) => {
      selectItem.appendChild(element);
    });
    console.log(result);
};

window.onload = () => getProduct();
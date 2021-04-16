/* eslint-disable max-lines-per-function */
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

let getPcInfos = [];

// Remover os itens com o clique
function cartItemClickListener(event) {
  event.target.remove();
  localStorage.removeItem('pcs');
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
const addProductToCart = async (itemId) => {
  const getCartItems = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const cartItem = await getCartItems.json();
  const { id, title, price } = cartItem;
  const product = { sku: id, name: title, salePrice: price };

  const selectItem = document.querySelector('.cart__items');
  selectItem.appendChild(createCartItemElement(product));

  getPcInfos.push(product);
  localStorage.setItem('pcs', JSON.stringify(getPcInfos));
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

// Busca os produtos desejados da API do MercadoLivre
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
};

// Armazena itens no localStorage
function localStorageCache() {
  const getPcInfosLocalStorage = localStorage.getItem('pcs');
  getPcInfos = getPcInfosLocalStorage ? JSON.parse(getPcInfosLocalStorage) : [];
  const selectItem = document.querySelector('.cart__items');

  getPcInfos.map(({ sku, name, salePrice }) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    selectItem.appendChild(li);
    return li;
  });
}

window.onload = () => {
  localStorageCache();

  getProduct();
};
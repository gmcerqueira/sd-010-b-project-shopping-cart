// Desenvolvendo Função para captura de dados da API - FETCH
async function fetchPC() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const response = await fetch(endpoint);
  const object = await response.json();
  const dataResults = object.results;
  return dataResults;
}

// -----------------------------------------------------------------------------------------------------

// REQUISITO 1

// Desenvolvendo Função para Criar Elementos HTML Dinamicamente
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Criando as Imagens dos Produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Criando os Elementos do Produto no HTML
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Desenvolvendo a Lista de Produtos
async function getMLProducts() {
  const answer = await fetchPC();
  const itemsElements = document.querySelector('.items');

  answer.forEach((result) => {
    const obj = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const element = createProductItemElement(obj);
    itemsElements.appendChild(element);
  });
}

// REQUISITO 3

function cartItemClickListener(event) {
  event.target.remove();
}

// REQUISITO 2

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Capturando o ID dos Produtos
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Desenvolvendo Função para Adicionar itens no Carrinho de Compras

function addToCart() {
  // Retorna todos os produtos com base na classe .item (seção onde estão todos os produtos)
  const allItems = document.querySelector('.items');
  allItems.addEventListener('click', async (event) => {
    // parentNode retorna o pai do elemento clicado, no caso o pai do botão, imagem ou ID do produto -> section com classe .itens
    const productID = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${productID}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    const item = {
      sku: productID,
      name: data.title,
      salePrice: data.price,
    };
    const itemsCart = document.querySelector('.cart__items');
    const itemCart = createCartItemElement(item);
    itemsCart.appendChild(itemCart); 
  });
}

// REQUISITO 4

// function saveCart(){

// }

window.onload = function onload() {
  getMLProducts();
  addToCart();
 };

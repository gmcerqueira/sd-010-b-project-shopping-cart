// Desenvolvendo Função para captura de dados da API - FETCH -------------------------------------------
async function fetchPC() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const response = await fetch(endpoint);
  const object = await response.json();
  const dataResults = object.results;
  return dataResults;
}

// Definição de constantes para o Projeto
const listCart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
// -----------------------------------------------------------------------------------------------------

// REQUISITO 7 -----------------------------------------------------------------------------------------
function createLoading() {
  // const container = document.querySelector('.container');
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.body.appendChild(loading);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

// REQUISITO 1 -----------------------------------------------------------------------------------------

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
  createLoading();
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
  removeLoading();
}

// REQUISITO 5 -----------------------------------------------------------------------------------------
async function cartTotalPrice() {
  const totalPrices = document.querySelector('.total-price');
  let totalValue = 0;
  const cartItems = document.querySelectorAll('.cart__item');
  for (let i = 0; i < cartItems.length; i += 1) {
    totalValue += parseFloat(cartItems[i].innerHTML.split('$')[1]);
    totalPrices.innerHTML = ((Math.round(totalValue * 100)) / 100);
  }
}

// REQUISITO 3 / REQUISITO 4 ----------------------------------------------------------------------------

// Desenvolvendo Função para Salvar a Lista de Produtos do Carrinho no LocalStorage
function saveCart() {
  localStorage.setItem('cart', listCart.innerHTML);
  localStorage.setItem('totalPrice', totalPrice.innerHTML);
}

// Função Remove os itens clicados / salva no Localstorage / ajusta soma total
function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  cartTotalPrice();
}

// Desenvolvendo Função para Retornar a Lista de Produtos do LocalStorage
function loadCart() {
  listCart.innerHTML = localStorage.getItem('cart');
  const itemsCarts = document.querySelectorAll('.cart__item');
  for (let i = 0; i < itemsCarts.length; i += 1) {
    itemsCarts[i].addEventListener('click', cartItemClickListener);
  }
  totalPrice.innerHTML = localStorage.getItem('totalPrice');
}

// REQUISITO 2 -----------------------------------------------------------------------------------------

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
    const itemCart = createCartItemElement(item);
    listCart.appendChild(itemCart);
    saveCart();
    cartTotalPrice();
  });
}

// REQUISITO 6 -----------------------------------------------------------------------------------------
function clearCart() {
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', () => {
  const listItems = document.querySelectorAll('li');
  if (listItems.length !== 0) {
      for (let i = 0; i < listItems.length; i += 1) {
      listItems[i].remove();
      }
      totalPrice.innerHTML = '0.00';
      saveCart();
  } else {
      alert('Não existe produto a ser removido do carrinho de compras'); 
  }
});
}

window.onload = function onload() {
  getMLProducts();
  addToCart();
  loadCart();
  clearCart();
 };
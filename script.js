const objeto = 'computador';
const url = `https://api.mercadolibre.com/sites/MLB/search?q=${objeto}`;
const itemUrl = 'https://api.mercadolibre.com/items/';
// const fetch = require("node-fetch");
let itemSelecionado;
const itens = document.querySelector('.items');
const loading = document.querySelector('.loading');
const ol = document.querySelector('.cart__items');
const elementoTotalPrice = document.querySelector('.total-price');
let total = 0;
const butonClear = document.querySelector('.empty-cart');

async function somaTotal(id) {
  const itemSelecionado = await funcFetch(`${itemUrl}${id}`);
  total += itemSelecionado.price;
  elementoTotalPrice.innerText = total;
}

// função salvar
function salvar() {
  const itensASalvar = [];
  const carrinho = document.querySelectorAll('.keys');
  total = 0;
  elementoTotalPrice.innerText = total;
  carrinho.forEach((item, key) => {
    itensASalvar[key] = item.innerText;
    somaTotal(item.innerText);
  });
  localStorage.setItem('Salvo', itensASalvar);
}

function clerCart() {
  ol.innerHTML = [];
  salvar();
}
butonClear.addEventListener('click', clerCart);

// Função fetch para por os elementos na tela
function funcFetch(urls) {
  return fetch(urls) 
  .then((fetchReturn) => fetchReturn.json())
  .catch((erro) => erro);
}

function cartItemClickListener(event) {
  const selecionado = event.target.parentNode;
  selecionado.removeChild(event.target);
  salvar();
}

// cria o produto selecionado no carrinho
function createCartItemElement({ sku, name, salePrice, keys }) {
  const li = document.createElement('li');
  const spam = document.createElement('spam');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  spam.className = 'keys';
  spam.id = keys;
  spam.innerText = sku;
  li.appendChild(spam);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adciona o produto selecionado ao carrinho
async function adcionar(este) {
  const section = este.target.id;
  const itemSelected = await funcFetch(`${itemUrl}${section}`);
    ol.appendChild(createCartItemElement({
      sku: itemSelected.id,
      name: itemSelected.title,
      salePrice: itemSelected.price,
      keys: ol.childNodes.length,
    }));
    salvar();
  }

// daqui para baixo, parte de mostrar os elementos na tela 

// cria a imagem dos elementos 
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria os elementos para aparecerem na tela
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// organiza os elementos e chama as funçoes para crialos
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
    button.id = sku;
    button.addEventListener('click', adcionar); 
    section.appendChild(button);
  return section;
}

// coloca os produtos na tela
async function buscaECriaElementos(urls) {
  const todaAPI = await funcFetch(urls);
  itemSelecionado = todaAPI.results;
  itemSelecionado.forEach((item) => {
    itens.appendChild(
      createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }),
      );
  loading.remove();
  });
}

function reloading(savede) {
  const separa = savede.split(',');
  separa.forEach((item) => {
    fetch(`${itemUrl}${item}`)
    .then((fetchReturn) => fetchReturn.json())
    .then((itemSelected) => {
    ol.appendChild(createCartItemElement({
      sku: itemSelected.id,
      name: itemSelected.title,
      salePrice: itemSelected.price,
      keys: ol.childNodes.length,
    }));
  });
  });
}

function ifLOading(retornoDoSave) {
  if (retornoDoSave.length > 0) {
    reloading(retornoDoSave);
  }
}

window.onload = function onload() {
  buscaECriaElementos(url);
  const retornoDoSave = localStorage.getItem('Salvo');
  ifLOading(retornoDoSave);
};

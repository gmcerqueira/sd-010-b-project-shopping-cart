async function getData(type) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${type}`);
  const data = await response.json();
  const computerList = await data.results;
  return computerList;
}

async function fetchIdItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await response.json();
  const itemReceived = await item;
  return itemReceived;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// funcao que cria novos elementos HTML
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

let cart = [];
let totalPrice = 0;

// Função que soma os valores
const sumPrices = () => {
  totalPrice = (cart.reduce((acc, cur) => acc + cur.price, 0));
};

const painelCart = document.querySelector('.cart');

// Função que mostra os preços na tela principal
const showPrices = async () => {
  const spanPrice = document.querySelector('.total-price');
  if (!spanPrice) {
    painelCart.appendChild(createCustomElement('span', 'total-price', `${totalPrice}`));
  } if (spanPrice) {
    painelCart.removeChild(spanPrice);
    painelCart.appendChild(createCustomElement('span', 'total-price', `${totalPrice}`));
  }
};

const cartListItems = document.querySelector('.cart__items');

// função que salva os itens adicionados ao carrinho no LocalStorage
function saveCart({ id, title, price }) {
  cart.push({ id, title, price });
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Função que remove os itens do carrinho
async function cartItemClickListener(event) {
  const target = event.target.innerText;
  const stringID = target.split(' ');
  const recoverID = { id: stringID[1] };
  const temporaryCart = cart.filter((product) => product.id !== recoverID.id);
  cart = temporaryCart;
  await sumPrices();
  await showPrices();
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  document.querySelector('.cart__items').removeChild(event.target);
}

// Criar elementos HTML
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  cartListItems.appendChild(li);
  return li;
}
// Recupera os itens salvos no carrinho
function loadCart() {
  const savedCart = localStorage.getItem('shoppingCart');
  cart = savedCart === null ? [] : JSON.parse(savedCart);
  cart.forEach((item) => createCartItemElement(item));
}
// Retira todos os itens do carrinho.
const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', async () => {
  while (cartListItems.firstChild) {
    cartListItems.removeChild(cartListItems.firstElementChild);
  }
  cart = [];
  totalPrice = 0;
  await sumPrices();
  await showPrices();
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
});
// Recupera o id do item que foi clicado na vitrine
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Cria os itens que aparecem na vitrine
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add',
   'Adicionar ao carrinho!')).addEventListener('click', async (event) => {
    const returnIdItem = getSkuFromProductItem(event.target.parentNode);
    const itemID = await fetchIdItem(returnIdItem);
    saveCart(itemID);
    createCartItemElement(itemID);
    await sumPrices();
    await showPrices();
  });
  return section;
}
// Adiciona os itens à vitrine
async function addSectionElements() {
  const list = await getData('Computador');
  const classItems = document.querySelector('.items');
  list.forEach((item) => {
    const computers = createProductItemElement(item);
     classItems.appendChild(computers);
  });
}

const body = document.getElementById('body');

function loadScreenAdd() {
  body.appendChild(createCustomElement('span', 'loading', 'Loading...'));
}

function loadScreenRemove() {
  const spanLoad = document.querySelector('.loading');
  body.removeChild(spanLoad);
}

window.onload = async function onload() {
  loadScreenAdd();
  await addSectionElements();
  loadScreenRemove();
  loadCart();
  await sumPrices();
  await showPrices();
};
// Referências

// Referência requisito 3

// https://www.youtube.com/watch?v=LEtLtRXBDms&t=390s&ab_channel=RogerMelo

// Referências requisito 4, 

// https://www.youtube.com/watch?v=WmBXh9ma138&ab_channel=MitchellHudson
// https://www.youtube.com/watch?v=H7gGkUNoKSM&t=344s&ab_channel=MitchellHudson
// também recebi ajuda do colega Misabel Bueno

// Requisito 5 recebi ajuda dos colegas Alan Tanaka, Mariana Mohr e Wolf
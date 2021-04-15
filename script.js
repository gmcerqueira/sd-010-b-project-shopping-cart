// const fetch = require('node-fetch');
// -FETCH--------------------------------------------------------------------------------------------------------
const getItemsResults = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const responseObj = await response.json();
  const results = await responseObj.results;
  
  return results;
};

const getItemById = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responseObj = await response.json();
  
  return responseObj;
};
// --------------------------------------------------------------------------------------------------------------

// -ARRAY DE OBEJETOS SALVOS NO LOCAL STORAGE--------------------------------------------------------------------
let savedCartItems = [];
let itemsPrices = [];
// --------------------------------------------------------------------------------------------------------------

// -CARD ITEMS---------------------------------------------------------------------------------------------------
const sumAllPrices = (arrayOfPrices) => {
  const addingUp = arrayOfPrices.reduce((acc, element) => {
    let sum = acc;
    sum += element;
    return sum;
  }, 0);
  return parseFloat(addingUp.toFixed(2));
};

const renderSummedPrices = () => {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = sumAllPrices(itemsPrices);
};

const cartItemClickListener = (event) => {
  // Basicamente ele obtem todos os irmãos do elemento clicado, cria um array, retorna o index do elemento clicado desse array, remove esse mesmo index do 'savedCartItems' e 'itemsPrices' e salva no localStorage.
  let cartItemsList = event.target.parentNode.children;
  cartItemsList = [...cartItemsList];
  const cartItemIndex = cartItemsList.reduce((acc, element, index) => {
    let current = acc;
    if (element === event.target) current = index;
    return current;
  }, 0);
  itemsPrices.splice(cartItemIndex, 1);
  savedCartItems.splice(cartItemIndex, 1);
  localStorage.setItem('cartItems', JSON.stringify(savedCartItems));
  renderSummedPrices();
  event.target.remove();
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => { cartItemClickListener(event); });
  return li;
};

const renderCardItem = (item) => {
  const cardItem = createCartItemElement(item);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(cardItem);
};

const removeCartItems = () => {
  const cartItems = document.querySelector('.cart__items');
  const cartItemsChildren = [...cartItems.childNodes];
  cartItemsChildren.forEach((element) => element.remove());
};

const emptyCartList = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    removeCartItems();
    itemsPrices = [];
    savedCartItems = [];
    renderSummedPrices();
    localStorage.clear(); 
  });
};

// --------------------------------------------------------------------------------------------------------------

// -ITEM LIST----------------------------------------------------------------------------------------------------
// Retorna o ID do elemento
const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const itemClickListener = async (event) => {
  // Retorna o pai do elemento clicado.
  const item = event.target.parentNode;
  const itemObj = await getItemById(getSkuFromProductItem(item));
  const { price } = itemObj;
  itemsPrices.push(price);
  savedCartItems.push(itemObj);
  // Salva no localStorage o objeto como string.
  localStorage.setItem('cartItems', JSON.stringify(savedCartItems));
  renderCardItem(itemObj);
  renderSummedPrices();
};

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
  
  const cartAddButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  cartAddButton.addEventListener('click', (event) => { itemClickListener(event); });
  section.appendChild(cartAddButton);

  return section;
};

const renderItems = async () => {
  const results = await getItemsResults();
  const items = document.querySelector('.items');
  results.forEach((item) => {
    items.appendChild(createProductItemElement(item));
  });
};
// --------------------------------------------------------------------------------------------------------------

// -LOCAL STORAGE------------------------------------------------------------------------------------------------
const restoreSavedCartItems = () => {
  if (localStorage.getItem('cartItems')) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    cartItems.forEach((cartItem) => {
      itemsPrices.push(cartItem.price);
      savedCartItems.push(cartItem);
      renderCardItem(cartItem);
    });
    renderSummedPrices();
  }
};
// --------------------------------------------------------------------------------------------------------------
window.onload = async () => {
  await renderItems();
  restoreSavedCartItems();
  emptyCartList();
};
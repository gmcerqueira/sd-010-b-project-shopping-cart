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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getItems = async () => {
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await request.json();
  const computers = response.results;
  computers.forEach((computer) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(computer));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemsString = 'cart-items';
let itemsOnCart;

if (localStorage.getItem(cartItemsString)) {
  itemsOnCart = JSON.parse(localStorage.getItem(cartItemsString));
} else {
  itemsOnCart = [];
}

function cartItemClickListener(event) {
  event.target.remove();
  const id = event.target.innerHTML.split(' ')[1];
  itemsOnCart.forEach((item) => {
    if (item.id === id) {
      itemsOnCart.splice(itemsOnCart.indexOf(item), 1);
    }
  });
  localStorage.removeItem(cartItemsString);
  localStorage.setItem(cartItemsString, JSON.stringify(itemsOnCart));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const ol = document.querySelector('.cart__items');

const requestItem = async (sku) => {
  const request = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const response = await request.json();
  return response;
};

const addToCart = async (event) => {
  if (event.target.className === 'item__add') {
    const sku = getSkuFromProductItem(event.target.parentNode);
    const item = await requestItem(sku);
    itemsOnCart.push({ id: item.id, title: item.title, price: item.price });
    const cartItem = createCartItemElement(item);
    ol.appendChild(cartItem);
    localStorage.setItem(cartItemsString, JSON.stringify(itemsOnCart));
  }
  console.log(itemsOnCart);
};

const removeAllItems = () => {
  ol.innerHTML = '';
  localStorage.removeItem(cartItemsString);
};

window.onload = function onload() {
  getItems();
  document.querySelector('.items').addEventListener('click', addToCart);
  if (localStorage.getItem(cartItemsString)) {
    const cartItemsWebStorage = JSON.parse(localStorage.getItem(cartItemsString));
    cartItemsWebStorage.forEach((cartItem) => {
      const item = createCartItemElement(cartItem);
      ol.appendChild(item);
    });
  }
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', removeAllItems);
};
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveItemsCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartList', JSON.stringify(cartItems.innerHTML));
}

function cartItemClickListener(event) {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
    saveItemsCart();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  return li;
}

function moveItemsToCart(button) {
  button.addEventListener('click', (event) => {
    const sku = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((data) => data.json())
      .then((data) => { 
        createCartItemElement(data);
        saveItemsCart();
      });
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const primarySection = document.getElementsByClassName('items')[0];
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  moveItemsToCart(button);
  section.appendChild(button);
  primarySection.appendChild(section);
  return section;
}

const createItemsList = async () => {
const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
const loading = document.getElementsByClassName('loading')[0];
loading.parentNode.removeChild(loading);
const data = await result.json();
data.results.forEach((product) => { createProductItemElement(product); });
};

function loadCartItems() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = JSON.parse(localStorage.getItem('cartList'));
  cartItems.addEventListener('click', cartItemClickListener);
}

window.onload = function onload() { 
  createItemsList();
  loadCartItems();
};
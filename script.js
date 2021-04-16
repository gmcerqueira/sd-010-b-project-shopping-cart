const storage = localStorage;
const cartClass = '.cart__items';

function productInStorage(id, products) {
  return products.find((product) => product.id === id);
}

function saveProductIdOnLocalStorage(product) {
  if (!storage.length) storage.setItem('products', JSON.stringify([product]));
  else {
    const arrProducts = JSON.parse(storage.getItem('products'));
    if (productInStorage(product.id, arrProducts)) return;
    arrProducts.push(product);
    storage.setItem('products', JSON.stringify(arrProducts));
  }
}

function removeProductIdOnLocalStorage(id) {
  const localStorageArr = JSON.parse(storage.getItem('products'));
  const productObj = localStorageArr.find((product) => product.id === id);
  const index = localStorageArr.indexOf(productObj);
  localStorageArr.splice(index, 1);
  storage.setItem('products', JSON.stringify(localStorageArr));
}

async function updateTotalPrice() {
  const totalPriceTag = document.querySelector('.total-price');
  try {
    const arrProducts = await JSON.parse(storage.getItem('products'));
    const totalRes = (arrProducts.reduce((result, acc) => result + acc.price, 0));
    totalPriceTag.innerText = Math.round(totalRes * 100) / 100;
  } catch (error) {
    console.log(error); 
  }
}

async function cartItemClickListener(event) {
  const item = event.target;
  const itemId = item.innerText.match(/MLB\d*/g)[0];
  const cartList = document.querySelector(cartClass);
  try {
    removeProductIdOnLocalStorage(itemId);
    await updateTotalPrice();
    cartList.removeChild(item);
  } catch (error) {
    console.log(error);
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function loadProductCartFromLocalStorage() {
  const cartList = document.querySelector(cartClass);
  const ids = await JSON.parse(storage.getItem('products'));
  try {
    if (!ids) return;
    ids.map((id) => 
      cartList.appendChild(createCartItemElement(id)));
    await updateTotalPrice();
  } catch (error) {
    console.log(error);
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, eventListener = []) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', eventListener);
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addProductToCart(event) {
  const cartList = document.querySelector(cartClass);
  const item = event.target.parentNode;
  const id = getSkuFromProductItem(item);
  // const arrProducts = JSON.parse(storage.getItem('products'));

  try {
    // if (productInStorage(id, arrProducts)) return;
    const res = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await res.json();
    cartList.appendChild(createCartItemElement(data));
    saveProductIdOnLocalStorage(data);
    updateTotalPrice();
  } catch (error) {
    console.log(error);
  }
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', addProductToCart),
  );
  const img = document.createElement('img');
  img.src = './img/shopping_cart.svg';
  section.querySelector('.item__add').appendChild(img);

  return section;
}

async function createProductList() {
  const productList = document.querySelector('.items');
  const container = document.querySelector('.container');
  const loading = document.querySelector('.loading');

  try {
    const res = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const data = await res.json();
    container.removeChild(loading);
    data.results
      .forEach((product) => productList.appendChild(createProductItemElement(product)));
  } catch (error) {
    console.log(error);
  }
}

function clearCart() {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerHTML = '0,00';
  storage.clear();
}

window.onload = async function onload() {
  createProductList();
  loadProductCartFromLocalStorage();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};
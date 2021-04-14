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
  const index = localStorageArr.indexOf(id);
  localStorageArr.splice(index, 1);
  storage.setItem('products', JSON.stringify(localStorageArr));
}

async function totalPrice() {
  const totalPriceTag = document.querySelector('.total-price');
  const arrProducts = await JSON.parse(storage.getItem('products'));
  const totalRes = (arrProducts.reduce((result, acc) => result + acc.base_price, 0));
  totalPriceTag.innerHTML = totalRes;
  return totalRes;
}

function cartItemClickListener(event) {
  const item = event.target;
  const itemId = item.innerText.match(/MLB\d*/g)[0];
  const cartList = document.querySelector(cartClass);

  removeProductIdOnLocalStorage(itemId);
  totalPrice();
  cartList.removeChild(item);
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
  if (!ids) return;
  ids.map((id) => 
    cartList.appendChild(createCartItemElement(id)));
  totalPrice();
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
    totalPrice();
  } catch (err) {
    console.log(err);
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

  return section;
}

async function createProductList() {
  const productList = document.querySelector('.items');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((res) => res.json())
    .then((res) => res.results
      .forEach((product) => productList.appendChild(createProductItemElement(product))))
    .catch((err) => console.log(err));
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
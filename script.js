const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
let cartShoppingIds = [];
let totalPrice = 0;
const shoppingList = document.querySelector('.cart__items');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function totalOrder(price) {
  totalPrice = Math.round((totalPrice + price) * 100) / 100;
  document.querySelector('.total-price').innerHTML = totalPrice;
}

function cartItemClickListener(event) {
  // https://stackoverflow.com/questions/41755268/how-to-get-index-of-an-array-element-in-click-event-with-javascript
  const indexCartItem = Array.from(shoppingList.children).indexOf(event.target);
  const price = event.target.innerHTML.split('$')[1];
  totalOrder(-price);
  cartShoppingIds.splice(indexCartItem, 1);
  localStorage.setItem('computers', JSON.stringify(cartShoppingIds));
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const text = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const li = createCustomElement('li', 'cart__item', text);
  li.addEventListener('click', cartItemClickListener);
  // cartShoppingIds.push(sku);
  // localStorage.setItem('computers', JSON.stringify(cartShoppingIds));
  return li;
}

async function addToCart(itemToAdd) {
  const listItem = createCartItemElement(itemToAdd);
  const { price } = itemToAdd;
  await totalOrder(price);
  shoppingList.appendChild(listItem);
}

async function addNewToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const resultFetch = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const itemToAdd = await resultFetch.json();
  cartShoppingIds.push(itemToAdd);
  localStorage.setItem('computers', JSON.stringify(cartShoppingIds));
  addToCart(itemToAdd);
}

async function getComputers() {
  const result = await fetch(endpoint);
  const computers = await result.json();
  return computers.results;
}

function renderComputers(computers) {
  const itemsSection = document.querySelector('.items');
  computers.forEach((computer) => {
    const sectionItem = createProductItemElement(computer);
    itemsSection.appendChild(sectionItem);
  });
  // usado querySectorAll, pois retorna uma NodeList, senão, usando getElementsByClassName retorna uma HTMLCollection e teria que usar outro comando (Array.prototype.forEach.call)
  // https://stackoverflow.com/questions/3871547/js-iterating-over-result-of-getelementsbyclassname-using-array-foreach
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', addNewToCart));
}

async function renderCart() {
  const cartShopString = localStorage.getItem('computers');
  // JSON.parse foi visto no plantão do dia 14/04 com Luanderson (primeiro dia do projeto)
  cartShoppingIds = cartShopString ? JSON.parse(cartShopString) : [];
  const cart = document.querySelector('.cart__title');
  const totalCart = totalPrice;
  const totalCartElement = createCustomElement('span', 'total-price', totalCart);
  cart.insertAdjacentElement('afterend', totalCartElement);
  // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
  cartShoppingIds.reduce(async (prevPromise, currId) => {
    await prevPromise;
    return addToCart(currId);
  }, Promise.resolve());
  // cartShoppingIds.forEach((id) => addToCart(id)); // o forEach não respeita async/await
}

function emptyCart() {
  shoppingList.innerHTML = '';
  totalOrder(-totalPrice);
  cartShoppingIds = [];
  localStorage.setItem('computers', JSON.stringify(cartShoppingIds));
}

const clearAll = document.querySelector('.empty-cart');
clearAll.addEventListener('click', emptyCart);

function loading() {
  const items = document.querySelector('.items');
  items.appendChild(createCustomElement('span', 'loading', 'Loading...'));
}

window.onload = async function onload() {
  loading();
  renderComputers(await getComputers());
  renderCart();
  document.querySelector('.loading').remove();
};

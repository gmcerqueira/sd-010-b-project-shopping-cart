let cartShoppingIds = [];
let totalPrice = 0;

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
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.innerHTML = `TOTAL: ${totalPrice}`;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const id = event.target.innerHTML.split(' ')[1];
  const price = event.target.innerHTML.split('$')[1];
  console.log(id);
  console.log(price);
  totalOrder(-price);
  cartShoppingIds.splice(cartShoppingIds.indexOf(id), 1);
  localStorage.setItem('computers', JSON.stringify(cartShoppingIds));
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartShoppingIds.push(sku);
  console.log(cartShoppingIds);
  localStorage.setItem('computers', JSON.stringify(cartShoppingIds));
  return li;
}

async function addToCart(event) {
  // https://stackoverflow.com/questions/38481549/what-is-the-difference-between-e-target-parentnode-and-e-path1
  let itemId = event.target;
  itemId = itemId ? itemId.parentNode.querySelector('.item__sku').innerHTML : event;
  const endpoint = 'https://api.mercadolibre.com/items/';
  const itemToAdd = await (await fetch(`${endpoint}${itemId}`)).json();
  const listItem = createCartItemElement(itemToAdd);
  const { price } = itemToAdd;
  console.log(price);
  await totalOrder(price);
  console.log(price);
  const shoppingList = document.querySelector('.cart__items');
  shoppingList.appendChild(listItem);
}

async function getComputers(endpoint) {
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
  // usado querySectorAll pois retorna uma NodeList, senão teria que usar outro comando (Array.prototype.forEach.call)
  // https://stackoverflow.com/questions/3871547/js-iterating-over-result-of-getelementsbyclassname-using-array-foreach
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', addToCart));
}

function renderCart() {
  localStorage.removeItem('computers');
  const oldCartShoppingIds = cartShoppingIds;
  console.log(oldCartShoppingIds);
  cartShoppingIds = [];
  oldCartShoppingIds.forEach((id) => {
    addToCart(id);
  });
}

function emptyCart() {
  document.querySelector('.cart__items').innerHTML = '';
  totalOrder(-totalPrice);
  totalPrice = 0;
  localStorage.removeItem('computers');
  cartShoppingIds = [];
}

window.onload = async function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const computers = await getComputers(endpoint);
  const cartShopString = localStorage.getItem('computers');
  // JSON.parse foi visto no plantão do dia 14/04 (primeiro dia do projeto)
  cartShoppingIds = cartShopString ? JSON.parse(cartShopString) : [];
  const cart = document.querySelector('.cart__title');
  const totalCart = `TOTAL: ${totalPrice}`;
  cart.insertAdjacentElement('afterend', createCustomElement('span', 'total-price', totalCart));

  const clearAll = document.querySelector('.empty-cart');
  clearAll.addEventListener('click', emptyCart);

  renderComputers(computers);
  renderCart();
};

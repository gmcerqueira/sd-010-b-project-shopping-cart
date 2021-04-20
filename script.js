const cartShoppingClass = '.cart__items';

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

async function fetchProducts(query) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const products = await response.json();
  return products.results;
}

async function getProductsFromAPI() {
  const productSpace = document.querySelector('.items');
  const productsResult = await fetchProducts('computador');
  productsResult.forEach((product) => productSpace.appendChild(createProductItemElement(product)));
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// sums the prices of the items in cart
function updateTotalPriceCart(items) {
  const totalPrice = items.reduce((total, currentPrice) => (total + currentPrice.price), 0.00);
  const displayPrice = document.querySelector('.total-price');
  displayPrice.innerText = totalPrice;
}

// updates prices and prices on localStorage
function updateLocalStorage({ id, price }, addDel) {
  const savedIDs = JSON.parse(localStorage.getItem('itemIDs') || '[]');
  if (addDel === 'add') {
    savedIDs.push({ id, price });
    updateTotalPriceCart(savedIDs);
    localStorage.setItem('itemIDs', JSON.stringify(savedIDs));
  } else if (addDel === 'del') {
    const indexOfItem = savedIDs.findIndex((item) => item.id === id);
    savedIDs.splice(indexOfItem, 1); // I found this logic at https://www.mundojs.com.br/2018/09/06/removendo-elementos-de-uma-lista-array-javascript/
    updateTotalPriceCart(savedIDs);
    localStorage.setItem('itemIDs', JSON.stringify(savedIDs));
  }
}

// saves the entire shopping cart to de localStorage
function setCarttoLocalStorage() {
  const cartItemsSpace = document.querySelector(cartShoppingClass); // .cart__items
  
  console.log(cartItemsSpace.innerHTML);

  localStorage.setItem('shopping_cart', cartItemsSpace.innerHTML);
}

// deletes an item from cart when clicked
function cartItemClickListener(event) {
  const stringInfo = event.target.innerText;
  const id = stringInfo.substring(5, stringInfo.indexOf(' ', 5));
  const stringPrice = stringInfo.substring(stringInfo.indexOf('$') + 1);
  const price = parseFloat(stringPrice);
  updateLocalStorage({ id, price }, 'del');
  event.target.remove();
  setCarttoLocalStorage();
}

// creates an the element to add to cart in addItemToCart()
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.appendChild(createItemInfoToCart('span', sku, salePrice));
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// fetches an unique product on API
async function fetchItem(productID) {
  const itemInfo = await fetch(`https://api.mercadolibre.com/items/${productID}`);
  const item = await itemInfo.json();
  return item;
}

// adds an item to cart when click add button
async function addItemToCart(productID, newOrNot) {
  const cartElement = document.querySelector(cartShoppingClass); // .cart__items
  const item = await fetchItem(productID);
  if (newOrNot) updateLocalStorage(item, 'add');
  cartElement.appendChild(createCartItemElement(item));
  setCarttoLocalStorage();
}

// adds eventListener to all add buttons
function eventListenerToAllButtons() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((but) => but.addEventListener('click', (evt) => {
    const productID = evt.target.parentElement.firstElementChild.innerText;
    addItemToCart(productID, 1);
  }));
}

// gets all cart saved on localStorage
function loadCartShopping() {
  const savedItems = JSON.parse(localStorage.getItem('itemIDs'));
  updateTotalPriceCart(savedItems);
  
  const savedCart = localStorage.getItem('shopping_cart');
  const cartItemsSpace = document.querySelector(cartShoppingClass); // .cart__items
  cartItemsSpace.innerHTML = savedCart;

  const allItems = document.querySelectorAll('.cart__item');
  allItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

// deletes the entire Shopping Cart
function deleteShoppingCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const cart = document.querySelector(cartShoppingClass); // .cart__items
    cart.innerHTML = '';
    localStorage.setItem('shopping_cart', '');
    localStorage.setItem('itemIDs', '[]');
    updateTotalPriceCart([]);
  });
}

window.onload = async function onload() {
  await getProductsFromAPI();
  eventListenerToAllButtons();
  deleteShoppingCart();
  loadCartShopping();
  // sumTotalPriceCart();
};
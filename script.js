

function cartItemClickListener(event) {
  const itemToDelete = event.target;
  // Método por Krasimir, stackoverflow.
  // Disponível em: https://stackoverflow.com/questions/18795028/javascript-remove-li-without-removing-ul
  // console.log(itemToDelete.parentNode.children);
  let position;
  const listOfChildren = itemToDelete.parentNode.children;
  for (let index = 0; index < listOfChildren.length; index += 1) {
    if (listOfChildren[index] === itemToDelete) position = index;
  }
  itemToDelete.parentNode.removeChild(itemToDelete);
  const savedIds = localStorage.getItem('cart');
  // if (savedIds !== undefined && savedIds !== null) {
    const arrayIds = savedIds.split(',');
    const removed = arrayIds.filter((item) => (arrayIds.indexOf(item)) !== position);
    if (removed.length === arrayIds.length) removed.shift();
    cartIds = cartIds.filter((item) => (cartIds.indexOf(item)) !== position)
    localStorage.setItem('cart', (removed));
    updateCartValue();
  // }
}

let total = 0;


async function updateCartValue() {
  const cartDiv = document.getElementsByClassName("cart")[0];
  const cartItems = document.querySelectorAll('.cart__item');
  if (cartDiv.children.length === 3) {
    const some = document.createElement('p');
    some.className = 'total-price';
    cartDiv.appendChild(some);
  }
  total = 0;
  await cartItems.forEach((item) => {
    const value = parseFloat(item.innerText.split('$')[1]);
    total += value;
  });
  cartDiv.children[3].innerText = total;
}

async function getProducts(search) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
  const products = await response.json();
  return products.results;
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

let cartIds = [];
let prices = [];

async function addToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await response.json();
  const { title, price } = product;
  const cartItem = createCartItemElement({ sku: id, name: title, price });
  const sectionListCart = document.getElementsByClassName('cart__items');
  sectionListCart[0].appendChild(cartItem);
  cartIds.push(id);
  prices.push(price);
  localStorage.setItem('cart', (cartIds));
  updateCartValue();
}

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function createLoading() {
  const pai = document.getElementsByClassName('items');
  const loading = document.createElement('p');
  loading.className = "loading";
  loading.innerText = "Carregando..."
  pai[0].appendChild(loading);
}

function removeLoading() {
  const pai = document.getElementsByClassName('items');
  pai[0].removeChild(pai[0].firstChild)
}

function renderList(products) {
  const sectionList = document.getElementsByClassName('items');
  products.forEach(({ id, title, thumbnail }) => {
    const elementoLista = createProductItemElement({ sku: id, name: title, image: thumbnail });
    sectionList[0].appendChild(elementoLista);
  });
}

function clearAll() {
  const cart = document.getElementsByClassName('cart__items')[0];
  cart.innerHTML = "";
  localStorage.setItem("cart", "");
  cartIds = [];
  updateCartValue();
}

// Função ForEach assícrono, por Sebastien Chopin.
// Disponível em: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
}

async function restoreSavedCart() {
  const savedIds = localStorage.getItem('cart');
  // savedIds.split(',').forEach((id) => addToCart(id));
  asyncForEach(savedIds.split(','), (id) => addToCart(id));
}

const buttons = document.getElementsByClassName('item__add');
const clearButton = document.getElementsByClassName("empty-cart");

window.onload = async function onload() {
  createLoading();
  console.log('Verificação onload');
  const computers = await getProducts('computador');
  renderList(computers);
  removeLoading()
  if (localStorage.getItem('cart') !== null && localStorage.getItem('cart') !== '') {
    restoreSavedCart();
  }

  Object.values(buttons).forEach((button) => {
    button.addEventListener('click', function (event) {
      const dadId = event.target.parentNode.firstChild.innerText;
      addToCart(dadId);
      console.log(dadId);
    });
  });

  clearButton[0].addEventListener('click', clearAll);
};
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const listC = '.cart__items';

function listItem() {
  let list = 0;
  const cartItems = document.querySelectorAll('li');
  [...cartItems].forEach((element) => {
    list += element;
  });
  
  return list;
}

function save() {
  const listCart = document.querySelector(listC);
  localStorage.setItem('cart', listCart.innerHTML);
}

function remove(event) {
  event.target.remove();
}

function cartItemClickListener(event) {
  remove(event);
  listItem();
  save();
}

function load() {
  const cart = document.querySelector(listC);
  cart.innerHTML = localStorage.getItem('cart');
  
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  const emptyCartBtn = document.querySelector('.empty-cart');
  const cartList = document.querySelector(listC);
  emptyCartBtn.addEventListener('click', () => {
    cartList.innerHTML = '';
    localStorage.clear();
  });
}

async function fetchAPI(endpoint) {
  const response = await fetch(endpoint);
  const object = await response.json();
  const resul = object.results;
  const items = document.querySelector('.items');

    resul.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    items.appendChild(element);
  });
}

async function fetchID(sku) {
  const endpoint = (`https://api.mercadolibre.com/items/${sku}`);  
  const response = await fetch(endpoint);
  await response.json()
    .then((data) => {
      const dataProduct = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const list = document.querySelector('.cart__items');
      list.appendChild(createCartItemElement(dataProduct));
    });
}

function getId() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetchID(sku);
});
}

window.onload = function onload() { 
  const endpoint = ('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  fetchAPI(endpoint);
  getId();
  load();
  emptyCart();
};
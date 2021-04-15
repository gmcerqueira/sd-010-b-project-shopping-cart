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

function cartItemClickListener(event) {
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
 
  return cartItems.appendChild(li);
}

function fetchID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((data) => data.json())
  .then((product) => createCartItemElement(product));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItems = document.querySelector('.items'); 
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetchID(sku);
    });

  return sectionItems.appendChild(section); 
}

function fetchProduct(computer) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computer}`)
    .then((response) => response.json())
    .then(({ results }) => {
      results.forEach((data) => createProductItemElement(data));
    });
}

/* function saveLocalStorage() {
  const cartItem = document.getElementsByClassName('cart__items');
  
  if (typeof Storage !== 'undefined') {
    if (localStorage.list) {
      localStorage.list += cartItem.innerHTML;
    } else {
      localStorage.list = cartItem;
    }
  }
} */

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function removeAllItems() {
  const cartItems = document.querySelector('.cart__items');
  const btnRemove = document.querySelector('.empty-cart');
  btnRemove.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
}

window.onload = function onload() { 
  fetchProduct('computador');
  removeAllItems();
};
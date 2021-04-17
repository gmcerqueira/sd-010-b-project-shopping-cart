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

async function getItems() {
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await request.json();
  const computers = response.results;
  computers.forEach((computer) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(computer));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function itemsListClickListener(event) {
  const ol = document.querySelector('.cart__items');
  if (event.target.className === 'item__add') {
    const sku = getSkuFromProductItem(event.target.parentNode);
    const request = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const response = await request.json();
    ol.appendChild(createCartItemElement(response));
  }
}

window.onload = async function onload() {
  getItems();
  document.querySelector('.items').addEventListener('click', itemsListClickListener);
};
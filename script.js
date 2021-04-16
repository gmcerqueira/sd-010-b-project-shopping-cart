function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

 async function totalprice() {
  let purchase = 0;
  const items = document.querySelectorAll('.cart__item');
  await items.forEach((item) => {
    purchase += parseFloat(item.innerHTML.split('$')[1], 10);
  });
  const container = document.querySelector('.cart');
  if (container.lastChild.className === 'total-price') {
    container.lastChild.innerText = purchase;
  } else {
    const p = document.createElement('p');
    p.className = 'total-price';
    p.innerText = purchase;
    container.appendChild(p);
  }
}

function saveItems() {
  const list = document.querySelector('#cont');
  localStorage.setItem('savedItems', list.innerHTML);
}

function returnSaved() {
  const list = document.querySelector('#cont');
  list.innerHTML = localStorage.getItem('savedItems');
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  event.target.remove();
  totalprice();
  saveItems();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', async () => {
      const itemToCart = await fetch(`https://api.mercadolibre.com/items/${sku}`);
      const product = await itemToCart.json();
      const ol = document.querySelector('.cart__items');
      const createCart = createCartItemElement(product);
      ol.appendChild(createCart);
      totalprice();
      saveItems();
      document.querySelector('.loading').remove();
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function createListOfProducts() {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  document.querySelector('.loading').remove();
  const { results } = await api.json();
  results.forEach((product) => {
    const parentElement = document.querySelector('.items');
    const creatingItem = createProductItemElement(product);
    parentElement.appendChild(creatingItem);
  });
}

const clearAll = () => {
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
    const itemsAdded = document.querySelector('.cart__items');
    const finalValue = document.querySelector('.total-price');
    itemsAdded.innerHTML = '';
    finalValue.remove();
    saveItems();
  });
};

window.onload = function onload() {
  createListOfProducts();
  clearAll();
  returnSaved();
};
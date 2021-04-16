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

function cartConstructor(li) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

function cartItemClickListener(event) {
  const product = event.target;
  localStorage.removeItem(product.id);
  product.remove();
}

// Recebi ajuda do colega, Alan Tanaka T10-B, para a execução do requisito 4
function cartRecover() {
  if (localStorage.length) {
   for (let index = 0; index < localStorage.length; index += 1) {
      const saved = JSON.parse(localStorage[index]);
      const li = document.createElement('li');
      li.innerText = `SKU: ${saved.sku} | NAME: ${saved.name} | PRICE: $${saved.salePrice}`;
      li.id = index;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('ol.cart__items').appendChild(li);
    }
  }
}

 function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.id = `${localStorage.length}`;
  const index = li.id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(index, JSON.stringify({ sku, name, salePrice }));
  return cartConstructor(li);
}

async function fetchIdProduct(itemID) {
  const fetchID = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const productId = await fetchID.json();
  return createCartItemElement(productId);
 }

function getSkuFromProductItem(item) {
  const itemID = item.querySelector('span.item__sku').innerText;
  return fetchIdProduct(itemID);
}

async function itemCatcher(event) {
  const eventTarget = event.target;
  const aboveContent = eventTarget.parentNode;
  return getSkuFromProductItem(aboveContent);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', itemCatcher);
  return section;
}

async function insertProducts(products) {
  const items = document.querySelectorAll('.items')[0];
  await products.forEach((product) => {
    items.appendChild(createProductItemElement(product));
  });
 }

 async function fetchReceiver() {
  const fetchMerch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const response = await fetchMerch.json();
  const products = response.results;
  return insertProducts(products);
 }

window.onload = async function onload() {
 await fetchReceiver();
 await cartRecover();
};

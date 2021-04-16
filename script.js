async function getData(type) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${type}`);
  const data = await response.json();
  const computerList = await data.results;
  return computerList;
}

async function fetchIdItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await response.json();
  const itemReceived = await item;
  return itemReceived;
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

function cartItemClickListener(_) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add',
   'Adicionar ao carrinho!')).addEventListener('click', async (event) => {
    const returnIdItem = getSkuFromProductItem(event.target.parentNode);
    const itemID = await fetchIdItem(returnIdItem);
    createCartItemElement(itemID);
  });
  return section;
}

async function addSectionElements() {
  const list = await getData('Computador');
  const classItems = document.querySelector('.items');
  list.forEach((item) => {
    const computers = createProductItemElement(item);
     classItems.appendChild(computers);
  });
}

window.onload = async function onload() {
  await addSectionElements();
};
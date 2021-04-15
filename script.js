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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToChart(event) {
  // https://stackoverflow.com/questions/38481549/what-is-the-difference-between-e-target-parentnode-and-e-path1
  const itemId = event.target.parentNode.querySelector('.item__sku').innerHTML;
  const endpoint = 'https://api.mercadolibre.com/items/';
  const itemToAdd = await (await fetch(`${endpoint}${itemId}`)).json();
  const listItem = createCartItemElement(itemToAdd);
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
  const buttons = document.querySelectorAll('.item__add');
  console.log(buttons);
  buttons.forEach((button) => button.addEventListener('click', addToChart));
}

window.onload = async function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const computers = await getComputers(endpoint);
  console.log(computers);
  renderComputers(computers);
};

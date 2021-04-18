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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function ProducCart() {
  const query = 'computador';
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const { results } = await response.json();
  return results;
}

async function renderCar(produtoCar) {
  produtoCar.forEach((produto) => {
    const elementsProduct = createProductItemElement(produto);
    const item = document.querySelector('.items');
    item.appendChild(elementsProduct);
  });
}

async function producId(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const results = await response.json();
  return results;
}

async function adicionaOl(id) {
  const item = await producId(id);
  const elementItem = createCartItemElement(item);
  const newElement = document.querySelector('.cart__items');
  newElement.appendChild(elementItem);
}

async function adicionaCar() {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((button) => {
    const productBt = button.parentElement.children[0].innerText;
    button.addEventListener('click', () => {
      adicionaOl(productBt);
    });
  });
}

window.onload = async function onload() { 
  const produto = await ProducCart();
  renderCar(produto);
  adicionaCar();
};

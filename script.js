const classOl = document.querySelector('.cart__items');
const buttonAdd = document.querySelector('.item__add');

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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  return event;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Faz a requisição para a API
const apiUrl = async (item) => {
  const URL = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
  const docJson = await URL.json();
  const listComputer = await docJson.results;
  return listComputer;
};
// Adiciona o elemento buscado (computador) como filho da section com a classe items
const elementComputerSection = async () => {
  const list = await apiUrl('computador');
  const classItens = document.querySelector('.items');
  list.forEach((item) => {
    const computers = createProductItemElement(item);
      classItens.appendChild(computers);
  });
};

const requestId = async () => {
  const productId = await apiUrl('id');
  const docJson = await productId.json();
  return docJson;
};

const itemsCart = async () => {
  buttonAdd.forEach((button) => {
    const idProduct = button.parentElement.firstElementChild.innerText;
    button.addEventListener('click', () => {
      
    });
  });
}

window.onload = () => {
  elementComputerSection();
  addProductcart();
};
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getElement(parameter) {
  return document.querySelector(parameter);
}

function createCustomElement(element, className, innerText) {
  const elementCreated = document.createElement(element);
  elementCreated.className = className;
  elementCreated.innerText = innerText;
  return elementCreated;
}

function cartItemClickListener(event) {
  event.target.remove();
  const ordenedList = getElement('ol');
  if (ordenedList) {
    localStorage.setItem('itens', ordenedList.innerHTML);
  }
  // const liItens = document.querySelectorAll('li');
  // liItens.forEach((element) => {
  //   localStorage.setItem('itens', JSON.stringify(element.innerHTML));
  // });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  const ol = getElement('ol');
  ol.appendChild(li);
  localStorage.setItem('itens', ol.innerHTML);

  // const liItens = document.querySelectorAll('li');
  // liItens.forEach((element) => {
  //   localStorage.setItem('itens', JSON.stringify(element.innerHTML));
  // });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', async () => {
      const fetchId = await fetch(`https://api.mercadolibre.com/items/${sku}`);
      const fetchIdJson = await fetchId.json();
      createCartItemElement(fetchIdJson);
    });

  const sectionFather = document.querySelector('.items');
  sectionFather.appendChild(section);
}

const getApi = async (parameter) => {
  const objApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${parameter}`);
  const objApiJson = await objApi.json();
  objApiJson.results
    .forEach((element) => {
      createProductItemElement(element);
    });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const removeAll = () => {
  const buttonRemoveAll = document.querySelector('.empty-cart');
  const ol2 = getElement('ol');
  buttonRemoveAll.addEventListener('click', () => {
    ol2.innerHTML = '';
  });
};

window.onload = function onload() {
  getApi('computador');
  removeAll();
  const olList = document.querySelector('.cart__items');
  olList.addEventListener('click', cartItemClickListener);
  olList.innerHTML = localStorage.getItem('itens');

  // const liStorage = JSON.parse(localStorage.getItem('itens'));
  // liStorage.forEach((element) => {
  //   const li = document.createElement('li');
  //   li.className = 'cart__item';
  //   li.innerHTML = element;
  //   ordenedList.appendChild(li);
  // });
};
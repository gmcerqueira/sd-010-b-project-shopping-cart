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

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const checkCarItems = async () => {
  const carItem = document.querySelectorAll('.cart__items li');
  return (
    carItem.length && [...carItem].reduce((acc, { textContent }) => {
      const price = Number(textContent.match(/(?<=\$)\d+(\.?(\d+))/gi));
      return acc + price;
    }, 0)
  );
};

const updatePrice = async () => {
  const listCar = document.querySelector('section .cart__items');
  const elem = document.querySelector('.total-price');
  const list = await checkCarItems();
  elem.textContent = list;
  localStorage.car = listCar.innerHTML;
};

const clearListCar = () => {
  const listCar = document.querySelector('section .cart__items');
  localStorage.clear();
  listCar.innerHTML = '';
  updatePrice();
};

const cartItemClickListener = ({ target }) => target.remove() || updatePrice();

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getFetch = async (url, callback) => {
  const container = document.querySelector('.container');
  const load = document.createElement('span');
  load.classList.add('loading');
  load.textContent = 'loading...';
  container.appendChild(load);
  const sucess = await fetch(url)
    .then((r) => r.json())
    .then(callback);
  load.remove();
  return sucess;
};

const addItemCar = async ({ target }) => {
  const listCar = document.querySelector('.cart__items');
  const id = getSkuFromProductItem(target.parentNode);
  const url = `https://api.mercadolibre.com/items/${id}`;
  const { id: sku, title: name, price: salePrice } = await getFetch(url);
  listCar.appendChild(createCartItemElement({ sku, name, salePrice }));
  updatePrice();
};

const loadStorage = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', clearListCar);
  if (localStorage.car) {
    const listCar = document.querySelector('.cart__items');
    listCar.innerHTML = localStorage.car;
    const items = document.querySelectorAll('.cart__items li');
    items.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  updatePrice();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemCar);
  return section;
}

const updateList = ({ results }) => {
  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const container = document.querySelector('.items');
    const section = createProductItemElement({ sku, name, image });
    container.appendChild(section);
  });
};

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  getFetch(url, updateList);
  loadStorage();
};
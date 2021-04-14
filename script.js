const addToLocalStorage = ({ sku, name, salePrice }) => {
  const arrayToSave = [`${sku};${name};${salePrice}`];
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify(arrayToSave));
  } else {
    const storedItem = JSON.parse(localStorage.getItem('cart'));
    const itemToStore = [...storedItem, ...arrayToSave];
    localStorage.setItem('cart', JSON.stringify(itemToStore));
  }
};

const sumCartItems = () => {
  const allCartItems = document.querySelectorAll('.cart__item');
  let currentPrice = 0;
  allCartItems.forEach((element) => {
    const stringPrice = element.innerText.match(/\$\d+(\.\d+)?/g)[0];
    const realPrice = Number(stringPrice.substring(1));
    currentPrice += realPrice;
  });
  const elementToAppend = document.querySelector('.total-price');
  elementToAppend.innerText = currentPrice;
};

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

const getSiblingThatContainsID = (element) => {
  const { children } = element.parentElement;
  let foundElement = '';
  Array.from(children).forEach((child) => {
    const classOfElement = child.className;
    if (classOfElement === 'item__sku') {
      foundElement = child.innerText;
    } 
  });
  return foundElement;
};

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  sumCartItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const renderedBtnListener = async (e) => {
  const elId = getSiblingThatContainsID(e.target);
  const res = await fetch(`https://api.mercadolibre.com/items/${elId}`);
  const { id, title, price } = await res.json();
  const params = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const createdCardItemElement = createCartItemElement(params);
  document.querySelector('.cart__items')
    .appendChild(createdCardItemElement);
  addToLocalStorage(params);
  sumCartItems();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const renderedItemButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  renderedItemButton.addEventListener('click', renderedBtnListener);
  section.appendChild(renderedItemButton);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const renderResults = (items) => {
  const itemContainer = document.querySelector('.items');
  items.forEach(({ id, title, thumbnail }) => {
    const params = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const element = createProductItemElement(params);
    itemContainer.appendChild(element);
  });
};

const getResults = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=Monitor');
  const { results } = await response.json();
  renderResults(results);
};

const loadCartFromStorage = async () => {
  const arrToRender = JSON.parse(localStorage.getItem('cart'));
  arrToRender.forEach((element) => {
    const [id, title, price] = element.split(';');
    const params = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const createdCardItemElement = createCartItemElement(params);
    document.querySelector('.cart__items')
    .appendChild(createdCardItemElement);
  });
  sumCartItems();
};

window.onload = function onload() {
  getResults();
  loadCartFromStorage();
};

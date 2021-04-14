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

const renderedBtnListener = async (e) => {
  const id = getSiblingThatContainsID(e.target);
  const res = await fetch(`https://api.mercadolibre.com/items/${id}`);
  console.log(await res.json());
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

window.onload = function onload() {
  getResults();
};

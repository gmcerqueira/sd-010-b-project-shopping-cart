// elements
const sectionItems = document.querySelector('.items');
const olList = document.querySelector('.cart__items');
const pTotal = document.querySelector('.total-price');
const btnClear = document.querySelector('.empty-cart');
const container = document.querySelector('.container');

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

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const addItem = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((data) => {
      const { title: name, price: salePrice } = data;
      const item = createCartItemElement(sku, name, salePrice);
      olList.appendChild(item);
      localStorage.setItem('product', olList.innerHTML);
      // sumTotal(true);
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btn);
  sectionItems.appendChild(section);

  btn.addEventListener('click', () => {
    const id = getSkuFromProductItem(section);
    addItem(id);
  });

  return section;
}

const fetchApi = () => {
  const load = document.querySelector('.loading');
  load.innerText = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((data) => {
      container.removeChild(load);
      const arr = data.results;
      arr.forEach((item) => {
        const { id: sku, title: name, thumbnail: image } = item;
        createProductItemElement({ sku, name, image });        
      });
    });
};

const clearCart = () => {
  olList.innerHTML = '';
  pTotal.innerText = '';
};
btnClear.addEventListener('click', clearCart);

window.onload = function onload() {
  fetchApi();  
  const product = localStorage.getItem('product');
  if (product) olList.innerHTML = product;
};

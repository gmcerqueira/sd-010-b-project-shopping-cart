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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', async () => {
      const itemToCart = await fetch(`https://api.mercadolibre.com/items/${sku}`);
      const product = await itemToCart.json();
      const ol = document.querySelector('.cart__items');
      const createCart = createCartItemElement(product);
      ol.appendChild(createCart);
      document.querySelector('.loading').remove();
      
      localStorage.setItem('savedItems', JSON.stringify(ol));
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function createListOfProducts() {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  document.querySelector('.loading').remove();
  const { results } = await api.json();
  results.forEach((product) => {
    const parentElement = document.querySelector('.items');
    const creatingItem = createProductItemElement(product);
    parentElement.appendChild(creatingItem);
  });
}

const clearAll = () => {
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
    const itemsAdded = document.querySelector('.cart__items');
    itemsAdded.innerHTML = '';
  });
};

window.onload = function onload() {
  createListOfProducts();
  clearAll();
};
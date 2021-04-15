// window.onload = function onload() { };

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

function cartItemClickListener() {
  // seu cóigo aqui
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
  const getButton = document.querySelectorAll('button');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  getButton.addEventListener('click', async () => {
    const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const product = await response.json();
    const getOlElement = document.querySelector('.cart_items');
    const funcCreatCart = createCartItemElement(product);
    getOlElement.appendChild(funcCreatCart);
  });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchPC = async () => {
  // referencia https://www.youtube.com/watch?v=Zl_jF7umgcs&ab_channel=RogerMelo
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  data.results.forEach((product) => {
    const element = document.querySelector('.items');
    element.appendChild(createProductItemElement(product));
  });
};
fetchPC();

window.onload = function onload() {
  fetchPC();
  createProductItemElement();
};
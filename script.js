async function fetchProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productsInfos = await response.json();
  const computers = await productsInfos.results;
  return computers;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchById(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const url = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(url);
  const idInfos = await response.json();
  const idObject = {
    sku: idInfos.id,
    name: idInfos.title,
    salePrice: idInfos.price,
  };
  const item = createCartItemElement(idObject);
  const cartOl = document.querySelector('.cart__items');
  cartOl.appendChild(item);
}

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', fetchById);
  section.appendChild(button);

  return section;
}

function renderProducts(computersList) {
  const section = document.querySelector('.items');
  computersList.forEach((computer) => {
     const computerObject = {
       sku: computer.id,
       name: computer.title,
       image: computer.thumbnail,
     };
     const createElement = createProductItemElement(computerObject);
     section.appendChild(createElement);
  });
}

window.onload = async function onload() {
  const computers = await fetchProducts();
  renderProducts(computers);
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

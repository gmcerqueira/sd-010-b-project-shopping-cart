window.onload = function onload() { };

const ul = document.querySelector('.cart__items');
const pPrice = document.querySelector('.total-price');

const updateStorage = () => {
  localStorage.setItem('cart', ul.innerHTML);
  localStorage.setItem('priceCart', pPrice.innerHTML);
};

const sumPrices = (acc, element) => {
  const arr = element.innerText.split('$');
  const price = Number(arr[1]);
  const total = acc + price;
  return total;
};

const updatePrice = async () => {
  const items = document.querySelectorAll('li.cart__item');
  const totalPrice = [...items].reduce(sumPrices, 0);
  pPrice.innerText = totalPrice;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

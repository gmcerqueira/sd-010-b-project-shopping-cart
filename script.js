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

let sum = 0;
let arr = [];

function cartItemClickListener(event) {
  const spanSum = document.getElementsByClassName('total-price')[0];

  event.target.remove();

  const liText = event.target.innerText;
  const price = Number(liText.substring(liText.indexOf('$') + 1, liText.length));

  sum -= price;
  arr = [Math.abs(sum)];

  spanSum.innerText = `${Math.abs(sum.toFixed(3))}`;
  
  localStorage.setItem('listCart', document.getElementsByClassName('cart__items')[0].innerHTML);
  localStorage.setItem('sum', Math.abs(sum));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const spanSum = document.querySelector('.total-price');
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  const liText = li.innerText;
  arr.push(Number(liText.substring(liText.indexOf('$') + 1, liText.length)));
  sum = arr.reduce((acumulator, currentValue) => acumulator + currentValue);
  
  spanSum.innerHTML = `${Math.abs(sum.toFixed(3))}`;

  cartItems.appendChild(li);
  localStorage.setItem('listCart', cartItems.innerHTML);
  localStorage.setItem('sum', Math.abs(sum));
}

function fetchID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((data) => data.json())
  .then((product) => createCartItemElement(product));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItems = document.querySelector('.items'); 
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetchID(sku);
    });

  sectionItems.appendChild(section); 
}

function fetchProduct(computer) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computer}`)
    .then((response) => response.json())
    .then(({ results }) => {
      results.forEach((data) => createProductItemElement(data));
    });
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function removeAllItems() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const btnRemove = document.querySelector('.empty-cart');
  btnRemove.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
}

function loadStorage() {
  const spanSum = document.querySelector('.total-price');
  const sumLocalStorage = Number(localStorage.getItem('sum'));
  spanSum.innerHTML = sumLocalStorage;
  const items = document.getElementsByTagName('ol')[0];
  
  items.addEventListener('click', (event) => {
    event.target.remove();
    const liText = event.target.innerText;
    const price = Number(liText.substring(liText.indexOf('$') + 1, liText.length));
    console.log(price);
    
    localStorage.setItem('listCart', items.innerHTML);
  });

  items.innerHTML = localStorage.getItem('listCart');
}

window.onload = function onload() { 
  fetchProduct('computador');
  removeAllItems();
  loadStorage();
};
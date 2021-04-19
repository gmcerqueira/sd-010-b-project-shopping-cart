let sum = 0;
let deduct = 0;
let sumStorage = 0;

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

function storageCart() {
  localStorage.clear('cart');
  const myStorage = document.getElementsByClassName('cart__items')[0].innerHTML;
  const sumPrice = document.getElementsByClassName('total-price').innerHTML;
  console.log(myStorage);
  localStorage.setItem('cart', myStorage);
  localStorage.setItem('total', sumPrice);
}

async function totalSum() {
  const totalPrice = await document.querySelector('.total-price');
  if (localStorage.cart === undefined || localStorage.cart === '') {
    totalPrice.innerHTML = 0;
    storageCart();
  } else {
    totalPrice.innerHTML = Math.round(((Math.round(sumStorage * 100) / 100) 
    + (Math.round(sum * 100) / 100) + (Math.round(deduct * 100) / 100)) * 100) / 100;
    storageCart();
  }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.currentTarget.remove('clicked');
  storageCart();
  const Split = event.target.innerHTML.split(' ');
  const selected = Split[Split.length - 1].split('$');
  deduct -= selected[1];
  totalSum();
  }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((response) => response.json())
    .then((data) => {
      const addCar = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const cart = document.getElementsByClassName('cart__items')[0];
      cart.appendChild(createCartItemElement(addCar));
      storageCart();
      sum += data.price;
      totalSum();
    });
}

function addObject() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()).then((data) => {
      data.results.forEach((item) => {
        const computer = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(computer);
      });
    }).then(() => {
      document.querySelectorAll('.item__add').forEach((addItem) => 
        addItem.addEventListener('click', () => { 
          getSkuFromProductItem(addItem
        .parentElement.querySelector('span.item__sku').innerText);
      }));
    });
}

window.onload = function onload() {
  if (localStorage.getItem('cart') !== undefined) {
    document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart');
    const li = document.querySelectorAll('li');
    li.forEach((list) => list.addEventListener('click', cartItemClickListener));
    document.getElementsByClassName('total-price').innerHTML = localStorage.getItem('price');
    sumStorage = document.querySelector('.total-price').innerHTML;
  }
  document.querySelectorAll('.empty-cart').forEach((empty) => empty 
    .addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    localStorage.removeItem('cart');
    sum = 0;
    deduct = 0;
    sumStorage = 0;
    totalSum();
    storageCart();
  }));
  addObject();
};

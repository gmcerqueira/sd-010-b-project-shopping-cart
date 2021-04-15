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

  // if (element === 'button') {
  //   e.addEventListner('click', cartItemClickListener(event));
  // }

  return e;
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(_event) {
  const ol = document.querySelector('ol');
  while (ol.firstChild) ol.removeChild(ol.firstChild);
}

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function salvarCompras() {
  const listaCompras = document.querySelectorAll('li');
  for (let i = 0; i < listaCompras.length; i += 1) {
    localStorage.setItem(i, listaCompras[i].innerText);
  }
}

function pegarCompra() {
  const pai = document.querySelector('ol');
  const compras = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    compras.push(localStorage.getItem(i));
  }
  for (let i = 0; i < compras.length; i += 1) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerHTML = compras[i];
    pai.appendChild(li);
  }
  localStorage.clear();
}
const totalPrice = () => {
  const cart = Array.from(document.getElementsByClassName('cart__item'));
  const total = document.getElementById('totalPrice');
  const valores = [];
  cart.forEach((item) => {
  valores.push(parseFloat(item.innerHTML.split('$')[1]));
  });
  total.innerHTML = valores.reduce((acc, current) => acc + current);
};

function chamafunc(event) {
  const id = ((event.target.parentNode).firstChild).innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) =>
      response.json())
    .then((item) => {
      const pai = document.querySelector('ol');
      pai.appendChild(createCartItemElement(item));
      totalPrice();
      salvarCompras();
    });
}

const fetchItem = () =>
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((items) => {
    const {
      results,
    } = items;
    const pai = document.querySelector('.items');
    results.forEach((item) => pai.appendChild(createProductItemElement(item)));
    const arrBtn = document.getElementsByClassName('item__add');
    for (let i = 0; i < arrBtn.length; i += 1) {
      arrBtn[i].addEventListener('click', chamafunc);
    }
    const empBtn = document.querySelector('.empty-cart');
    empBtn.addEventListener('click', cartItemClickListener);
  });

// const saveAll = async () => {
//   try {
//     await salvarCompras();
//   } catch (error) {
//     alert('error');
//   }
// };

window.onload = function onload() {
  fetchItem();
  pegarCompra();
  totalPrice();
};
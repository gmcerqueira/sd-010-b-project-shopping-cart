const cartItem = '.cart__items';

const updatePrices = async () => {
  const items = document.querySelectorAll('.cart__item');
  const pricesArray = [];
  items.forEach((element) => {
    const split = element.innerText.split(' | ');
    const priceTag = split[2].split(' ');
    const price = priceTag[1].substring(1);
    pricesArray.push(Number(price));
  });
  const totalPrice = pricesArray.reduce((acc, curr) => acc + curr, 0);
  console.log(totalPrice);
  const pricePlace = document.querySelector('.total-price');
  pricePlace.innerText = `${totalPrice}`;
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const cartList = document.querySelector(cartItem);
  cartList.removeChild(event.target);
  const array = event.target.innerText.split(' | ');
  localStorage.removeItem(array[0]);
  updatePrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`SKU: ${sku}`, `${li.innerText}`);
  return li;
}

async function fetchML() {
  const father = document.querySelector('.list');
  const li = document.createElement('li');
  li.className = 'loading';
  li.innerText = 'loading...';
  father.appendChild(li);
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador',
    { method: 'GET' });
  const json = await response.json();
  return json.results;
}

async function fetchItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`,
    { method: 'GET' });
  const json = await response.json();
  return json;
}

const addToCart = () => {
  document.querySelectorAll('.item__add').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      const firstSibling = event.target.parentNode.firstChild;
      fetchItem(firstSibling.innerText).then((result2) => {
        const father = document.querySelector(cartItem);
        const child = createCartItemElement({
          sku: result2.id,
          name: result2.title,
          salePrice: result2.price,
        });
        father.appendChild(child);
        updatePrices();
      });
    });
  });
};

const loadStorage = () => {
  const items = Object.values(localStorage);
  return items;  
};

// REVER A IMPLEMENTAÇÃO - no carregamento a ordem está diferente
const populateFromStorage = (array) => {
  const father = document.querySelector(cartItem);
  array.forEach((element) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `${element}`;
    li.addEventListener('click', cartItemClickListener);
    father.appendChild(li);
  });
  updatePrices();
};

const clearCart = () => {
  document.querySelector(cartItem).innerHTML = '';
  localStorage.clear();
  document.querySelector('.total-price').innerText = '';
};

const populateList = (param) => {
  const father = document.querySelector('.items');
  param.forEach((element) => {
    const child = createProductItemElement({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    });
    father.appendChild(child);
  });
};

window.onload = function onload() {
  fetchML()
    .then((result) => {
      populateList(result);
      addToCart();
    });
  if (localStorage) {
    populateFromStorage(loadStorage());
  }
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  setTimeout(() => document.querySelector('.list').remove(), 2000);
};

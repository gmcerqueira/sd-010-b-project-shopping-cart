function clearCart(itemsCartClear) {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    while (itemsCartClear.hasChildNodes()) {
    itemsCartClear.removeChild(itemsCartClear.firstChild);
    }
  });
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
  
// let cartContainer = [];

const pricesSum = [];

function cartItemClickListener(event) {
  const olItems = document.querySelector('.cart__items');
  olItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function sumCart() {  
  const fixedPrice = pricesSum.reduce((acc, cur) => acc + cur, 0).toFixed(2);
  return fixedPrice;
}

async function showSumCart() {
  const cart = document.querySelector('.cart');
  const priceSum = await sumCart();

  if (cart.lastChild.className === 'total-price') {
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerText = `${Math.round(priceSum * 100) / 100}`;
  } else {
    const totalPrice = document.createElement('p');
    totalPrice.className = 'total-price';
    totalPrice.innerText = `${Math.round(priceSum * 100) / 100}`;
    cart.appendChild(totalPrice);
  }
}

function appendItemCart(result) {
  const olItems = document.querySelector('.cart__items');
  const { id, title, price } = result;
  olItems.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  clearCart(olItems);
  pricesSum.push(price);
  // cartContainer.push(olItems.lastChild.outerHTML);   
  // localStorage.setItem('cart-item', cartContainer); 
  // cartLocalStorage()
  showSumCart();
}

// function cartLocalStorage() {
  //   const getItemLocalStorage = localStorage.getItem('cart-item');
  //   const olItems = document.querySelector('.cart__items');  
  //   olItems.innerHTML = getItemLocalStorage;  
  // }

  const fetchSearchById = (id) => {  
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json()
    .then((result) => {
      appendItemCart(result);      
    });
  });
};

function addCart() {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((add) => {
    add.addEventListener('click', () => {
      const textId = add.parentNode.querySelector('.item__sku').innerText;
      fetchSearchById(textId);      
    });
  });
}

const fetchComputer = async () => {
  const loading = document.createElement('h1');
  const container = document.querySelector('.container');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.body.insertBefore(loading, container);
  
  const apiReturn = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonReturn = await apiReturn.json();
  const resultsReturn = await jsonReturn.results;

  if (resultsReturn) document.body.removeChild(loading);
  return resultsReturn;
};

async function appendResult() {
  const item = document.querySelector('.items');
  const itemResult = await fetchComputer();
  itemResult.forEach((result) => {
    const { id, title, thumbnail } = result;
    item.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  addCart();
}

window.onload = async function onload() {
  await appendResult();  
};

// https://www.w3schools.com/jsref/met_node_removechild.asp 
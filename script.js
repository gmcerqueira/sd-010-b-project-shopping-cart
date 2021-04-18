const cartTotalPrice = (num) => {
  const arr = [];
  let sum = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i); /* Esse método localiza uma chave do obj usando um índice */
    const data = JSON.parse(localStorage[key]);
    arr.push(data.salePrice);
  }

  if (num) {
    arr.push(num);
    sum = parseFloat(arr.reduce((acc, cur) => acc + cur, 0));
    document.querySelector('.total-price').innerText = sum;
  }
  sum = parseFloat(arr.reduce((acc, cur) => acc + cur, 0));
  document.querySelector('.total-price').innerText = sum;
};

const save = (ide, objItem) => {
  localStorage.setItem(`${ide}`, JSON.stringify(objItem));  
};
  
  /* << DEFAULT FUNCTIONS >> */
  
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
  const item = event.target;
  const ide = item.id;
  localStorage.removeItem(ide);
  cartTotalPrice();
  item.remove();
}
  
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = `${localStorage.length}`;
  const ide = li.id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  save(ide, { sku, name, salePrice });
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* << END DEFAULT FUNCTIONS >> */

const addItemToCart = async (event) => {
  const item = event.target;
  const itemId = item.parentElement.firstElementChild.innerText;
  
  const addItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((res) => res.json())
  .then((res) => {
    const itemObj = { sku: res.id, name: res.title, salePrice: res.price };
    return itemObj;
  });
  cartTotalPrice(addItem.salePrice);
  document.querySelector('.cart__items').appendChild(createCartItemElement(addItem));
};

const setItems = (arr) => {
  for (let i = 0; i < arr.length; i += 1) {
    const obj = { sku: arr[i].id, name: arr[i].title, image: arr[i].thumbnail };
    document.querySelector('section.items').appendChild(createProductItemElement(obj));
  }
};

const clearCart = () => {
  localStorage.clear();
  document.querySelector('.cart__items').innerText = '';
  cartTotalPrice();
};

const load = () => {
  if (localStorage.length) {
    console.log(Object.keys(localStorage));
    for (let i = 0; i < localStorage.length; i += 1) {
      const data = JSON.parse(localStorage[i]);
      const li = document.createElement('li');
      li.innerText = `SKU: ${data.sku} | NAME: ${data.name} | PRICE: $${data.salePrice}`;
      li.id = i;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('ol.cart__items').appendChild(li);
    }
    cartTotalPrice();
  }
};

const construct = async () => {
  const loading = document.querySelector('.loading');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((res) => res.json())
    .then((res) => res.results)
    .then(setItems);
  const btnArr = document.querySelectorAll('.item__add');
  btnArr.forEach((_, i) => btnArr[i].addEventListener('click', addItemToCart));
  load();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  loading.remove();
};

window.onload = function onload() {
  construct();
};

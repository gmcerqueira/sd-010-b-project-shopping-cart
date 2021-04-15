const cartTotalPrice = (num) => {
  const arr = [];
  let t = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const data = JSON.parse(localStorage[key]);
    arr.push(data.salePrice);
  }

  if (num) {
    arr.push(num);
    t = parseFloat(arr.reduce((acc, cur) => acc + cur, 0));
    document.querySelector('.total-price').innerText = t;
  }
  t = parseFloat(arr.reduce((acc, cur) => acc + cur, 0));
  document.querySelector('.total-price').innerText = t;
};

const save = (ide, objItem) => {
  localStorage.setItem(`${ide}`, `${JSON.stringify(objItem)}`);  
};
  
  /* << DEFAULT >> */
  
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
  li.id = `${Date.now()}`;
  const ide = li.id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  save(ide, { sku, name, salePrice });
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* << FIM DEFAULT >> */

const addItemToCart = async (event) => {
  const item = event.target;
  const itemId = item.parentElement.firstElementChild.innerText;
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  
  const addItem = await fetch(url)
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
const load = () => {
  if (localStorage.length) {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      const data = JSON.parse(localStorage[key]);
      const li = document.createElement('li');
      li.innerText = `SKU: ${data.sku} | NAME: ${data.name} | PRICE: $${data.salePrice}`;
      li.id = key;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('ol.cart__items').appendChild(li);
    }
    cartTotalPrice();
  }
};

const construct = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(url)
    .then((res) => res.json())
    .then((res) => res.results)
    .then(setItems);
  const btnArr = document.querySelectorAll('.item__add');
  btnArr.forEach((_, i) => btnArr[i].addEventListener('click', addItemToCart));
  load();
};

window.onload = function onload() {
  construct();
};
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
/* 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

async function fetchData(url, header) {
  return fetch(url, header)
  .then((promise) => promise.json())
  .catch((err) => err);
}

async function somePrice() {
  const totalPrice = document.getElementsByClassName('total-price')[0];
  const cadItem = document.querySelectorAll('.cart__item');
  const ids = [...cadItem].map((e) => e.innerText.split(' ')[1]);
  const Products = await fetchData('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((data) => data.results);
  const arrayPrices = ids.map((id) => Products
    .find((product) => product.id === id).price);

  const total = (arrayPrices.reduce((acc, current) => acc + current, 0));
  totalPrice.innerText = total;
}

function cartItemClickListener(event) {
  const idProduct = event.target.innerHTML.split(' ')[1];
  const arrayShoppingList = JSON.parse(localStorage.getItem('productsSave'));
  const arrayFilted = arrayShoppingList.filter(({ sku }) => sku !== idProduct);

  localStorage.setItem('productsSave', JSON.stringify(arrayFilted));
  event.target.remove();
  somePrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveLocalStorage(objProduct) {
  if (localStorage.getItem('productsSave') === null) {
    localStorage.setItem('productsSave', JSON.stringify([objProduct]));
  } else {
    localStorage.setItem(
      'productsSave', 
      JSON.stringify([
        ...JSON.parse(localStorage.getItem('productsSave')), 
        objProduct,
      ]),
    );
  }
}

const addEventBtn = (section, objProduct) => {
  section.getElementsByClassName('item__add')[0].addEventListener('click', async () => {
    const ItemID = objProduct.sku; 
    const objResponse = await fetchData(`https://api.mercadolibre.com/items/${ItemID}`)
      .then((data) => data)
      .catch((err) => console.log(err));
    
    const obj = { sku: objResponse.id, name: objResponse.title, salePrice: objResponse.price };
    
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(obj));
    saveLocalStorage(obj);
    somePrice();
  });
};

const printOutProducts = (product) => {
  const objProduct = { sku: product.id, name: product.title, image: product.thumbnail };
  const section = createProductItemElement(objProduct);
  
  addEventBtn(section, objProduct);
  document.getElementsByClassName('items')[0].appendChild(section);
};

function showLoading() {
  const div = document.createElement('div');
  div.innerText = 'loading...';
  div.classList.add('loading');
  document.getElementsByClassName('items')[0]
    .appendChild(div);
}

function removeLoding() {
  document.querySelector('.loading')
  .remove();
}

async function renderlistProduct() {
  showLoading();
  const products = await fetchData('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((data) => data.results);
  removeLoding();
  
  products.forEach(printOutProducts);
}

function recoverShoppingList() {
  const JSONListProducts = localStorage.getItem('productsSave');
  if (JSONListProducts !== null) {
    const arrayListProducts = JSON.parse(JSONListProducts);
    arrayListProducts.forEach((obj) => {
      document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(obj));
    });
  }
  somePrice();
}

function btnClearShoppingList() {
  const btnEmpty = document.getElementsByClassName('empty-cart')[0];
  btnEmpty.addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    document.getElementsByClassName('total-price')[0].innerHTML = 0;
    localStorage.removeItem('productsSave');
  });
}

window.onload = () => {
  renderlistProduct();
  recoverShoppingList();
  btnClearShoppingList();
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let flexPrice = 0;

function cartItemClickListener(event, salePrice) {
  event.target.parentNode.removeChild(event.target);
  flexPrice -= salePrice;
  document.querySelector('.total-price').innerHTML = flexPrice;
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event, salePrice);
  });
  return li;
}

function createObjProductCart(product) {
  const objProduct = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  };
  const itemCart = createCartItemElement(objProduct);
  const cartPage = document.getElementsByClassName('cart__items')[0];
  cartPage.appendChild(itemCart);
  localStorage.setItem('cart', cartPage.innerHTML);
}

function fetchProductCart(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((product) => product);
}

function totalPrice({ price }) {
  flexPrice += price;
  document.querySelector('.total-price').innerHTML = flexPrice;
}

async function buttonEvent(event) {
  const dad = event.target.parentNode;
  const id = getSkuFromProductItem(dad);
  createObjProductCart(await fetchProductCart(id));
  totalPrice(await fetchProductCart(id));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', buttonEvent);

  return section;
}

function fetchProdutcs() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then(({ results }) => results);
}

function appendElements(results) {
  results.forEach((result) => {
    const product = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const addProduct = createProductItemElement(product);
    document.querySelector('.items').appendChild(addProduct);
  });
}

window.onload = async function onload() {
  const products = await fetchProdutcs();
  appendElements(products);
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
};
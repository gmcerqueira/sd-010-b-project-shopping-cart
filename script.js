// Trabalho executado com colaboração de Fellipe Correa, Lotar Lucas, João Herculano e do instrutor Gabriel Almeida. //

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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const callFetch = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const objResponse = await response.json();
  const arrayReturn = objResponse.results;
  return arrayReturn;
};

const renderProductList = async (product) => {
  const items = document.querySelector('.items');
  product.forEach((element) => {
    const object = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail, 
    };
    const joinProducts = createProductItemElement(object);
    items.appendChild(joinProducts);
  });
};
  
const changeToObject = (data) => ({ sku: data.id, name: data.title, salePrice: data.price });

const joinItemsCart = (item) => {
  const olCartItem = document.querySelector('.cart__items');
  olCartItem.appendChild(item);
};

function removeAllItems() {
  const catchButton = document.querySelector('.empty-cart');
  const createOl = document.querySelector('.cart__items');
  catchButton.addEventListener('click', () => {
    createOl.innerHTML = ' ';
  });
}

function buttonEvent() {
  const productButton = document.querySelectorAll('.item__add');
  productButton.forEach((addProduct) => {
    addProduct.addEventListener('click', async (event) => {
      const idProduct = getSkuFromProductItem(event.target.parentNode);
      const fetchCall = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
      const response = await fetchCall.json();
      const changeObject = changeToObject(response);
      const liCreate = createCartItemElement(changeObject);
      joinItemsCart(liCreate);
    });
  });
}
  
window.onload = async function onload() {
  const products = await callFetch();
  renderProductList(products);
  buttonEvent();
  removeAllItems();
};

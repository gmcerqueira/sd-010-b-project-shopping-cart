const getPricesItem = [];

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

const cartItemClickListener = (event) => {
const { target } = event;
const getSpan = document.querySelector('.total-price');
const newObj = target.parentNode.children;
const objRest = [...newObj];
objRest.forEach((value, index) => {
  if (target === value) {
    target.parentNode.removeChild(target);
    getPricesItem.splice(index);
    if (getPricesItem.length >= 1) {
      const soma = getPricesItem.reduce((accumulator, currentValue) => accumulator + currentValue);
      getSpan.textContent = soma;
    } else {
      [getSpan.textContent] = [getPricesItem[0]];
    }
  }
});
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;  
};

const theProduct = async (item) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const responseData = await product.json();
   return responseData;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async () => {
  const sc = section.firstChild.textContent;
  const data = await theProduct(sc);
  document.querySelector('.cart__items').appendChild(createCartItemElement(data));
  getPricesItem.push(data.price);
  const soma = getPricesItem.reduce((accumulator, value = 0) => accumulator + value);
  const getSpan = document.querySelector('.total-price');
  getSpan.textContent = soma;
});
  return section;
}

const getProduct = async () => {
  const container = document.querySelector('.container');
  const loadingScreen = document.createElement('span');
  loadingScreen.classList.add('loading');
  loadingScreen.textContent = 'loading...';
  container.appendChild(loadingScreen);
  const getComputer = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const getResponse = await getComputer.json();
  const response = await getResponse.results;
  response.forEach((value) => {
    const product = { sku: value.id, name: value.title, image: value.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
  loadingScreen.remove();
};

const clearCart = () => {
  const clearCartItems = document.querySelector('.empty-cart');
  clearCartItems.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
  });
};

window.onload = function () {
  getProduct();
  clearCart();
};
window.onload = function onload() {
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const cartItemClickListener = (event) => {
const { target } = event;
target.parentNode.removeChild(target);
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
    document.querySelector('.cart__items').appendChild(createCartItemElement(await theProduct(sc)));
  });
  return section;
}

const getProduct = async () => {
  const getComputer = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const getResponse = await getComputer.json();
  const response = await getResponse.results;
  return response.forEach((value) => {
    const product = { sku: value.id, name: value.title, image: value.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
};
getProduct();
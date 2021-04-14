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
function cartItemClickListener(_event) {
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const olClass = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return olClass.appendChild(li);
}

function fetchAddCart(endpoint) {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => createCartItemElement(data));
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      const endpoint = `https://api.mercadolibre.com/items/${sku}`;
      fetchAddCart(endpoint);
    });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function fetchApi($QUERY) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const newObj = {
          sku: result.id, name: result.title, image: result.thumbnail,
        };
        const itemsClass = document.querySelector('.items');
        itemsClass.appendChild(createProductItemElement(newObj));
      });
    });
}

function addItemCart() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((item) => {
    item.addEventListener('click', () => {

    });
  });
}

window.onload = function onload() {
  fetchApi('computador');
  addItemCart();
};
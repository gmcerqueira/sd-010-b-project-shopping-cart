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

function cartItemClickListener() {
  const clicaProduto = document.querySelector('.cart__items');
  clicaProduto.addEventListener('click', function (event) {
    const evento = event.target;
    evento.remove();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItemElement(evento) {
  const pegaId = getSkuFromProductItem(evento.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${pegaId}`;
  fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const resultElement = {
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    const item = createCartItemElement(resultElement);
    const carrinho = document.querySelector('.cart__items');
    carrinho.appendChild(item);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addCartItemElement);

  return section;
}

const fetchItem = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const result = response.results;
    result.forEach((element) => {
      const resultElement = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      const produto = createProductItemElement(resultElement);
      const section = document.querySelector('.items');
      section.appendChild(produto);
    });
  });
};

window.onload = function onload() {
  fetchItem();
 };

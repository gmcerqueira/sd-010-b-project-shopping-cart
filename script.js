// Abimael Rocha - Trybe
const data = {};

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  console.log(image);
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const renderItems = () => {
  const items = document.querySelector('.items');
  data.results.forEach((element) => {
    const elementHtml = createProductItemElement(element);
    items.appendChild(elementHtml);
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const ul = document.querySelector('.cart__items');
  ul.appendChild(li);
  return li;
}

function getId() {
  const add = document.querySelector('.items');
      add.addEventListener('click', (event) => {
        if (event.target.className === 'item__add') {
          const element = event.target.parentNode;
          const id = element.firstChild.innerText; 
          fetch(`https://api.mercadolibre.com/items/${id}`)
            .then((response) => response)
            .then((response) => response.json())
            .then((json) => {
            createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price });
            });
        }
      });
}

window.onload = function onload() { 
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  fetch(endPoint)
    .then((value) => value.json())
    .then((result) => Object.assign(data, result))
    .then(() => {
      renderItems();
      getId();
    });
};

window.onload = function onload() { };

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

function cartItemClickListener() {
  const listItems = document.querySelectorAll('.cart__item');
    listItems.forEach((listItem) => {
      listItem.addEventListener('click', (e) => {
        listItem.remove(e.target);
      });
    });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendItemCart(result) {
  const olItems = document.querySelector('.cart__items');
  const { id, title, price } = result;
  olItems.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));      
  cartItemClickListener();
}

const fetchSearchById = (id) => {  
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json()
    .then((result) => {
      appendItemCart(result);
    });
  });
};

function addCart() {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((add) => {
    add.addEventListener('click', () => {
      const textId = add.parentNode.querySelector('.item__sku').innerText;
      fetchSearchById(textId);
    });
  });
}

function appendResult(fetchResult) {
  const item = document.querySelector('.items');
  fetchResult.results.forEach((result) => {
    const { id, title, thumbnail } = result;
    item.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
   });
   addCart();
}

const fetchComputer = () => {  
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json()
    .then((result) => {
      appendResult(result);
    });
  });
};
fetchComputer();

/* const consButton = document.querySelectorAll('.item__add'); */

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
  console.log();
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

/* const add = (mercados) => {
  const deconstruct = mercados.results;
  const items = document.querySelector('.items');
  deconstruct.forEach((element) => {
  items.appendChild(createProductItemElement(element));
  });
}; */

const start = ($QUERY) => {
 fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
  .then((response) => {
    response.json()
      .then((mercados) => {
          document.querySelector('.loading').remove();
        const deconstruct = mercados.results;
        const items = document.querySelector('.items');
        deconstruct.forEach((element) => {
          items.appendChild(createProductItemElement(element));
        });
      });
  });
};

/* consButton.addEventListener('click', createCartItemElement); */

const clear = () => {
  const consClear = document.querySelector('.empty-cart');
  consClear.addEventListener('click', () => {
    const cleando = document.querySelector('.cart__items');
    cleando.innerHTML = '';
  });
};

window.onload = function onload() {
  start('computador');
  clear();
};
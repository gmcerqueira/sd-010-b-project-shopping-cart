// elements
const sectionItems = document.querySelector('.items');
// const olList = document.querySelector(".cart__items");
// const childs = olList.childNodes;
// const pTotal = document.querySelector(".total-price");
// const btnClear = document.querySelector(".empty-cart");
const container = document.querySelector('.container');

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

function createProductItemElement({ sku, name, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(thumbnail));
  const btn = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  section.appendChild(btn);
  sectionItems.appendChild(section);

  btn.addEventListener('click', () => {
    addItem(sku);
  });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
const fetchApi = () => {
  const load = document.querySelector('.loading');
  load.innerText = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((data) => {
      container.removeChild(load);
      const arr = data.results;
      arr.forEach((item) => {
        // const { id: sku, title: name, thumbnail: image } = item;
        createProductItemElement(item);
      });
    });
};

window.onload = function onload() {
  fetchApi();
};

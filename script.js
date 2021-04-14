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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(_event) {
  // coloque seu código aqui
  console.log('event');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); 
  return li;
}

// URL's
const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const urlProduct = 'https://api.mercadolibre.com/items/';

const fetchProducts = (item, Url) => fetch(`${Url}${item}`).then((resp) => resp.json());

const mountItems = async (product) => {  
  const conteinerItems = document.querySelector('.items');

  const arrItens = await fetchProducts(product, urlProducts);
  arrItens.results.forEach((item) => conteinerItems.appendChild(createProductItemElement(item)));
};

const reviveButtons = () => {
  const AddButtons = document.querySelectorAll('.item__add');
  const cardItems = document.querySelector('.cart__items');

  AddButtons.forEach((buttom) => {
    buttom.addEventListener('click', async () => {
      const idItem = buttom.parentNode.firstChild.innerText;
      const itemInfo = await fetchProducts(idItem, urlProduct);
      cardItems.appendChild(createCartItemElement(itemInfo));
    });
  });
};

mountItems('computador');
setTimeout(() => reviveButtons(), 1000);

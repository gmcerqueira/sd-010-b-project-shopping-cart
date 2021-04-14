window.onload = function onload() { };

// URL's
const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const urlProduct = 'https://api.mercadolibre.com/items/';

const fetchProducts = (item, Url) => fetch(`${Url}${item}`).then((resp) => resp.json());

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

function dellCartsSaveds() {
  localStorage.removeItem('CartItemsToSave');
}

function saveCart() {
  const itemsToSave = [];
  dellCartsSaveds();
  const allItemsNow = document.querySelectorAll('.cart__item');
  allItemsNow.forEach((item) => {
    const itemObj = { item: item.innerText };
    itemsToSave.push(itemObj);
  });
  console.log(itemsToSave);
}

function cartItemClickListener(event) {
  const cardItems = document.querySelector('.cart__items');
  cardItems.removeChild(event.srcElement);
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); 
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  buttonAdd.addEventListener('click', async () => {
    const cardItems = document.querySelector('.cart__items');
    const idItem = buttonAdd.parentNode.firstChild.innerText;
    const itemInfo = await fetchProducts(idItem, urlProduct);
    cardItems.appendChild(createCartItemElement(itemInfo));
    saveCart();
  });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const mountItems = async (product) => {  
  const conteinerItems = document.querySelector('.items');

  const arrItens = await fetchProducts(product, urlProducts);
  arrItens.results.forEach((item) => conteinerItems.appendChild(createProductItemElement(item)));
};

// const reviveButtons = () => {
//   const AddButtons = document.querySelectorAll('.item__add');
//   

//   AddButtons.forEach((buttom) => {

//   });
// };

mountItems('computador');
// setTimeout(() => reviveButtons(), 500);

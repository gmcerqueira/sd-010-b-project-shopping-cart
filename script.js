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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// A função 'pega' os produtos computadores da APi, dentro do obj results, e depois através do loop do forEach adciona o item como 'filho' na classe items;
async function getProduct() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const product = await response.json();
  const productResults = product.results;
 productResults.forEach((item) => {
   const itenProduct = document.getElementsByClassName('items')[0];
   itenProduct.appendChild(createProductItemElement(item));
});
}

 function getSkuFromProductItem(item) {
   return item.querySelector('span.item__sku').innerText;
 }

function cartItemClickListener(event) {
 event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
   return li;
 }
 async function getItem(id) {
   const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
   const items = await response.json();
   return items;
 }

 async function addItem(id) {
   const add = await getItem(id);
   const addOl = document.querySelector('.cart__items');
   const cart = createCartItemElement(add);
   addOl.appendChild(cart);
 }

function addItemCart() {
   const buttonItem = document.querySelectorAll('.item__add');
   buttonItem.forEach((button) => {
     button.addEventListener('click', () => {
       const id = getSkuFromProductItem(button.parentElement);
       addItem(id);
     });
     });
 }
 
window.onload = async function onload() { 
 await getProduct();
 await addItemCart();
};

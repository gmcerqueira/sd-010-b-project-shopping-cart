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

function cartItemClickListener(event) {
    const cartItem = event.target;
    cartItem.remove();
  }
  
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
    
function addProductToCart(event) { 
  const cart = document.querySelector('.cart__items');
  const itemsId = getSkuFromProductItem(event.target.parentNode);
  console.log(itemsId);
  const urlId = `https://api.mercadolibre.com/items/${itemsId}`;
  fetch(urlId)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    cart.appendChild(createCartItemElement({ 
      sku: data.id, name: data.title, salePrice: data.price }));
    }); 
  }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addProductToCart);
  return section;
}

async function creatProductList() {
const items = document.querySelector('.items'); 
await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
.then((response) => response.json())
.then((data) => {
const dataResults = data.results;
console.log(dataResults);
dataResults.forEach(({ id, title, thumbnail }) => // Henrique Clementino 
items.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
})
.catch(() => alert('Não foi possível se conectar com a API '));
}

window.onload = function onload() {
creatProductList();
};

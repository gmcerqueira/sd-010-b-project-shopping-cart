const cart = '.cart__items'; // Atribuo a classe a uma constante assim posso reutilizar mais vezes quanto for pegar
// https://eslint.org/docs/rules/prefer-const (Jonnes Bezerra)

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
  const cartItem = document.querySelector(cart);
  const cartItemClicked = event.target;
  cartItemClicked.remove();
  localStorage.setItem('productsCart', cartItem.innerHTML);
  }
  
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
    
function addProductToCart(event) {  
  const cartAdd = document.querySelector(cart); 
  const itemsId = getSkuFromProductItem(event.target.parentNode);
  console.log(itemsId);
  const urlId = `https://api.mercadolibre.com/items/${itemsId}`;
  fetch(urlId)
  .then((response) => response.json())
  .then((data) => {
    cartAdd.appendChild(createCartItemElement({ 
      sku: data.id, name: data.title, salePrice: data.price }));
      localStorage.setItem('productsCart', cartAdd.innerHTML);
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
dataResults.forEach(({ id, title, thumbnail }) => // Henrique Clementino 
items.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
})
.catch(() => alert('Não foi possível se conectar com a API '));
}

function getStorageCart() {  
  const cartRecovered = document.querySelector(cart);
  const storage = localStorage.getItem('productsCart');
  if (storage !== '' && storage !== null && cartRecovered !== null) { 
    cartRecovered.innerHTML = (localStorage.getItem('productsCart')); // pego os valores dela
    const lis = document.querySelectorAll('li'); // pego os lis recuperados do storage
    lis.forEach((li) => li.addEventListener('click', cartItemClickListener)); // adiciono para cada um o listener do click
  }
}

function emptyCart() {
  const carrinhoAtual = document.querySelector(cart);
  carrinhoAtual.remove();
  localStorage.setItem('productsCart', carrinhoAtual.innerHTML = '');
}

function addClickEventToEmptyCartButton() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
}

window.onload = function onload() {
creatProductList();
getStorageCart();
addClickEventToEmptyCartButton();
};

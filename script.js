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
// saveitemsCart salva os itens no localStorage
// usando JSON.stringify 'aula do leandro' transforma dados em string
// para depois converter com JSON.parse para object
function saveItemsCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartList', JSON.stringify(cartItems.innerHTML));
}
// cartitemClickListener remove os itens salvos no carrinho
function cartItemClickListener(event) {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
    saveItemsCart();
  }
}
// cria as li destruturando id, title, price
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  return li;
}

// moveItemsToCart adiciono produto ao carrinho
// crio a const sku chamando o getSkuFromProductItem sku = id
// passo um fetch da api dos itens (readme)
// reaproveito a funct createCartitemElement no .then e as salvo
function moveItemsToCart(button) {
  button.addEventListener('click', (event) => {
    const sku = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((data) => data.json())
      .then((data) => { 
        createCartItemElement(data);
        saveItemsCart();
      });
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const primarySection = document.getElementsByClassName('items')[0];
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  moveItemsToCart(button);
  section.appendChild(button);
  primarySection.appendChild(section);
  return section;
}

// createItemsList refatorei um pouco usando async, pois dava erro
// no localStorage
// seleciono a classe 'loading' e a removo apos a api carregar
// passo um forEach do result destruturando o createProductItemElement
const createItemsList = async () => {
const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
const loading = document.getElementsByClassName('loading')[0];
loading.parentNode.removeChild(loading);
const data = await result.json();
data.results.forEach((product) => { createProductItemElement(product); });
};

// emptyCart faco um querySelector do button
// seleciono as ol e apago chamando a func saveitemsCart
function emptyCart() {
  const button = document.querySelector('.empty-cart');
  const cart = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    cart.innerHTML = '';
    saveItemsCart();
  });
}
// loadCartItems carrego a lista salva no localStorage chamando o
// cartList da func saveItemsCart no localStorage
// uso JSON.parse para transformar string em object
// reaproveito a func cartitemClickListener
function loadCartItems() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = JSON.parse(localStorage.getItem('cartList'));
  cartItems.addEventListener('click', cartItemClickListener);
}

window.onload = function onload() { 
  createItemsList();
  loadCartItems();
  emptyCart();
};
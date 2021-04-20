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

const listCartItems = '.cart__items';
const totalPriceValue = '.total-price';

async function listItem() {
  let list = 0;
  const cartItems = document.querySelectorAll('li');
  const sumValue = document.querySelector(totalPriceValue);
  [...cartItems].forEach((element) => {
    list += parseFloat(element.innerHTML.split('$')[1]);
  });
  sumValue.innerHTML = list.toFixed(2);
}

function save() {
  const listCart = document.querySelector(listCartItems);
  const totalValue = document.querySelector(totalPriceValue);
  localStorage.setItem('cart', listCart.innerHTML);
  localStorage.setItem('value', totalValue.innerHTML);
}

function remove(event) {
  event.target.remove();
}

function cartItemClickListener(event) {
  remove(event);
  listItem();
  save();
}

function load() {
  const cart = document.querySelector(listCartItems);
  cart.innerHTML = localStorage.getItem('cart');
  
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  listItem();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Botão removedor.
function emptyCart() {
  // Variavel contem o elemento do botão.
  const emptyCartBtn = document.querySelector('.empty-cart');
  // Variavel contem uma lista Ordenada.
  const cartList = document.querySelector(listCartItems);
  // adciona um evento de 'click' que remove os elementos.
  const totalValue = document.querySelector('.total-price'); 
  emptyCartBtn.addEventListener('click', () => {
    cartList.innerHTML = '';
    localStorage.clear();
    totalValue.innerHTML = 0;
  });
}

function loadingMsg() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  document.body.append(loading);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  document.body.removeChild(loading);
}

// função assincrona que espera uma API
async function fetchAPI(endpoint) {
  // variavel espera a resposta da URL/ENDPOINT
  loadingMsg();
  const response = await fetch(endpoint);
  // Transforma o endpoint em formato JSON
  const object = await response.json();
  const resul = object.results;
  const items = document.querySelector('.items');

    resul.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    items.appendChild(element);
  });
  removeLoading();
  listItem();
}

async function fetchID(sku) {
  loadingMsg();
  const endpoint = (`https://api.mercadolibre.com/items/${sku}`);  
  const response = await fetch(endpoint);
  await response.json()
    .then((data) => {
      const dataProduct = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const list = document.querySelector('.cart__items');
      list.appendChild(createCartItemElement(dataProduct));
    });
    removeLoading();
    listItem();
    // A lista estava apresentando um resultado inesperado, na qual somente
    // salvava quando REMOVIA algum item, então resolvi chamar a função Save () tanto no evento de click quanto na busca pelo ID.
    save();   
}

function getId() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetchID(sku);
});
}

window.onload = async function onload() { 
  const endpoint = ('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  fetchAPI(endpoint);
  getId();
  load();
  emptyCart();
};
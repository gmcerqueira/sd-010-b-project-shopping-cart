//-----------------------------------------------------------------------------
// NATIVE FUNCTIONS
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

//-----------------------------------------------------------------------------
// SET CART TO LOCAL STORAGE
function saveCartStatus() {
  const cart = document.querySelector('.cart__items');
  const productsList = cart.innerHTML;
  localStorage.onCart = productsList;
}

// DEVELOPED FUNCTION - ALMOST NATIVE
function cartItemClickListener(event) {
  // coloque seu código aqui
  const toRemove = event.target;
  toRemove.parentNode.removeChild(toRemove);
  saveCartStatus();
}

//-----------------------------------------------------------------------------
// NATIVE FUNCTION
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//-----------------------------------------------------------------------------
// FUNÇÃO QUE CRIA OS PRODUTOS QUE IRÃO PARA O CART
function productOnCart(product) {
  const cartProduct = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
    };

  const item = createCartItemElement(cartProduct);
  const toCart = document.querySelector('.cart__items');
  toCart.appendChild(item);
  saveCartStatus();
}

// FUNÇÃO QUE PEGA O ITEM VIA API PARA CRIAR OS PRODUTOS DO CARRINHO DE COMPRAS
function productToCart(event) {
  const productID = getSkuFromProductItem(event.target.parentNode);
  const urlAPI = `https://api.mercadolibre.com/items/${productID}`;
  fetch(urlAPI).then((response) => response.json())
    .then((data) => productOnCart(data));
}

//-----------------------------------------------------------------------------
// NATIVE FUNCTION
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', productToCart); // ADICIONA O EVENT LISTENER AOS BOTÕES

  return section;
}

//-----------------------------------------------------------------------------
// CRIAR TODOS OS PRODUTOS DA LOJA COM BASE NOS DADOS RECEBIDOS DA API
async function createProducts(productInfos) {
  const data = productInfos.results;
  data.forEach((info) => {
    const product = {
      sku: info.id,
      name: info.title,
      image: info.thumbnail,
    };
    const item = createProductItemElement(product);
    const section = document.querySelector('.items');
    section.appendChild(item);
  });
}

// PEGAR AS INFORMAÇÕES DOS PRODUTOS DA LOJA VIA API
async function getProducts() {
  const keyword = 'computador';
  const urlAPI = `https://api.mercadolibre.com/sites/MLB/search?q=${keyword}`;
  
  await fetch(urlAPI)
    .then((response) => response.json())
    .then((data) => createProducts(data));
}

// LOAD CART FROM LOCAL STORAGE
function loadCart() {
  const onCart = document.querySelector('.cart__items');
  if (localStorage.onCart) onCart.innerHTML = localStorage.onCart;
  document.querySelectorAll('li')
    .forEach((product) => product.addEventListener('click', cartItemClickListener));
}

//-----------------------------------------------------------------------------
// FUNCTION CALLS
window.onload = function onload() {
  getProducts();
  loadCart();
};
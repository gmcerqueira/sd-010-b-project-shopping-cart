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
// DEVELOPED FUNCTION - ALMOST NATIVE
function cartItemClickListener(event) {
  // coloque seu código aqui
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
    const cart = document.querySelector('.cart__items');
    cart.appendChild(item);
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

//-----------------------------------------------------------------------------
// FUNCTION CALLS
window.onload = function onload() {
  getProducts();
};
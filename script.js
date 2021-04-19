const loading = document.querySelector('.loading');

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

// pegando as ids da API
async function fethIds(id) {
  const responseFetch = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responseJson = await responseFetch.json();
  const idsProducts = responseJson;
  return idsProducts;
}

// calc o valor total do carrinho
async function totalPricesInCart() {
  const getPrices = Object.values(document.getElementsByClassName('cart__item'));
  let totalPrices = 0;
  getPrices.forEach((_key, index) => {
  const price = getPrices[index].innerText.split('$', 2)[1];
  totalPrices += Number(price);
    });
  return totalPrices;
}

async function creatElementH3() {
  const elementH3 = document.querySelector('.total-price');
  if (elementH3) elementH3.remove();
  const h3 = document.createElement('h3');
  h3.id = 'h3-total';
  h3.className = 'total-price';
  h3.innerText = await totalPricesInCart();
  const classCart = document.querySelector('.cart');
  classCart.appendChild(h3);
}

// Clicar para deletar o item do carrinho e do localStorage
async function cartItemClickListener(event) {
  const targetInnerText = event.target.innerText;
  const sizeLocalStore = Object.values(localStorage).length;
  for (let index = 0; index < sizeLocalStore; index += 1) {
    if (targetInnerText === Object.values(localStorage)[index]) {
      localStorage.removeItem(Object.keys(localStorage)[index]);
      break;
    }
  }
  event.target.remove('parent');
  await totalPricesInCart();
  await creatElementH3();
}

function localStorageCartShop(cartShop) {
  const sizeCartItem = document.getElementsByClassName('cart__item');
  for (let index = 1; index <= sizeCartItem.length; index += 1) {
    if (index === sizeCartItem.length) {
      localStorage.setItem(`cartShop[${index}]`, `${cartShop}`);
    }
  }
  // for (let index = 1; index <= sizeCartItem.length; index += 1) {
  //   console.log(Object.keys(localStorage)[index]);
  //   if (!Object.keys(localStorage)[index] !== ) {
  //     localStorage.setItem(`cartShop[${index}]`, `${cartShop}`);
  //     break;
  //   }
  // }
}

// tive ajuda do Lucas Portella;
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const classCartItems = document.getElementsByClassName('cart__items')[0];
  classCartItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// botão de limpar o carrinho
function clearCarAndLocalStorage() {
  localStorage.clear();
  const cartItem = document.getElementsByClassName('cart__items');
  cartItem[0].innerHTML = '';
  creatElementH3();
}
document.getElementsByClassName('empty-cart')[0]
  .addEventListener('click', clearCarAndLocalStorage);

// add item no carrinho ao clicar
async function addCarrinho(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const responseFath = await fethIds(id);
  const responseApiId = createCartItemElement(responseFath);
  await totalPricesInCart();
  await creatElementH3();
  localStorageCartShop(responseApiId.innerText);
  return responseApiId;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addCarrinho); // add evento nos botões de add no carrinho
  return section;
}

// tive ajuda Carlos Margato - Turma 10 - Tribo B
function consultProducts(products) {
  const classItems = document.getElementsByClassName('items')[0];
  products.forEach((product) => classItems.appendChild(createProductItemElement(product)));
}

// tive ajuda Carlos Margato - Turma 10 - Tribo B
async function fethProdutos() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await response.json();
  const products = responseJson.results;
  loading.remove();
  return consultProducts(products);
}

async function recoveryLocalStorage() {
  const valuesLocalStorage = Object.values(localStorage);
  valuesLocalStorage.forEach((_key, index) => {
    const li = document.createElement('li');
    const classCartItems = document.getElementsByClassName('cart__items')[0];
    li.className = 'cart__item';
    li.innerText = valuesLocalStorage[index];
    classCartItems.appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  });
  await totalPricesInCart();
  await creatElementH3();
}
 
    // tive ajuda do Lucas Matins
  window.onload = async function onload() {
    await fethProdutos(); // so vem parar aqui oq for preciso carregar primeiro 
    await recoveryLocalStorage();
  };
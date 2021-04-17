// const prices = [0.00];

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

// const arrayLocalStorage = [];

function cartItemClickListener(event) {
  event.target.remove('parent');
  const targetInnerText = event.target.innerText;
  const sizeLocalStore = Object.values(localStorage).length;
  for (let index = 0; index < sizeLocalStore; index += 1) {
    if (targetInnerText === Object.values(localStorage)[index]) {
      localStorage.removeItem(Object.keys(localStorage)[index]);
      break;
    }
  }
}

const localStorageCartShop = (cartShop) => {
  const sizeCartItem = document.getElementsByClassName('cart__item');
  for (let index = 1; index <= sizeCartItem.length; index += 1) {
    if (index === sizeCartItem.length) {
      localStorage.setItem(`cartShop[${index}]`, `${cartShop}`);
    }
  }
};

// tive ajuda do Lucas Portella;
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const classCartItems = document.getElementsByClassName('cart__items')[0];
  classCartItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  // localStorageCartShop(li.innerText);
  return li;
}

function clearCarAndLocalStorage() {
  localStorage.clear();
  const cartItem = document.getElementsByClassName('cart__items');
  cartItem[0].innerHTML = '';
  // Object.values(cartItem).forEach((_key, index) => cartItem[index].remove('parent'));
}
document.getElementsByClassName('empty-cart')[0]
  .addEventListener('click', clearCarAndLocalStorage);

// let totalPrices;

// async function totalPricesInCart() {
//   const getPrices = await Object.values(document.getElementsByClassName('cart__item'));
//   await getPrices.forEach((_key, index) => {
    // const price = getPrices[index].innerText.split('$', 2)[1];
    // prices.push(Number(price));
  // });
  // totalPrices = await prices.reduce((acc, currentValue) => acc + currentValue);
  // const elementeH3 = await document.getElementsByClassName('total-price')[0];
  // elementeH3.innerText = totalPrices;
  // return totalPrices;
// }

function creatElementH3() {
  const h3 = document.createElement('h3');
  h3.className = 'total-price';
  h3.innerText = 'R$ 0.00';
  const classCart = document.querySelector('.cart');
  classCart.appendChild(h3);
}

async function addCarrinho(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const responseFath = await fethIds(id);
  const responseApiId = createCartItemElement(responseFath);
  localStorageCartShop(responseApiId.innerText);
  // totalPricesInCart(); // localStorage
  // arrayLocalStorage.push(responseApiId.innerText);
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
      
    // criar addeventlistem
  // const buttons = document.querySelectorAll('.item__add');
  // buttons.forEach((button) => button.addEventListener('click', () => console.log('fui clicado')));

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
  return consultProducts(products);
}

function recoveryLocalStorage() {
  for (let index = 1; index <= localStorage.length; index += 1) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = localStorage.getItem(`cartShop[${index}]`);
    const classCartItems = document.getElementsByClassName('cart__items')[0];
    classCartItems.appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  }
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

  // classItem.forEach(() =>
  // classItem.addEventListener('click', () => console.log('item adicionado')));
   
  // function addProductsInFavorite(products) {
  //   const classCartItems = document.getElementsByClassName('cart__items');
  //   classCartItems.appendChild(createCartItemElement(products));
  // }

  // const classCartItem = document.querySelector('cart__items');
  // classCartItem.appendChild();
  
  // testando addEventListener
  
    // tive ajuda do Lucas Matins
  window.onload = async function onload() {
    // await totalPricesInCart();
    await fethProdutos(); // so vem parar aqui oq for preciso carregar primeiro 
    recoveryLocalStorage();
    creatElementH3();
  };
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
  // localStorage.removeItem(event.target.innerText);
  const targetInnerText = event.target.innerText;
  // console.log(targetInnerText);
  const sizeLocalStore = Object.values(localStorage).length;
  console.log(targetInnerText);
  console.log(sizeLocalStore);
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

async function addCarrinho(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const responseFath = await fethIds(id);
  const responseApiId = createCartItemElement(responseFath);
  localStorageCartShop(responseApiId.innerText); // localStorage
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
    await fethProdutos(); // so vem parar aqui oq for preciso carregar primeiro 
    recoveryLocalStorage();
  };
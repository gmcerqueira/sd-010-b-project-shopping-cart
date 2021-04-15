const cartClass = '.cart__items';

const btn = document.querySelector('.empty-cart');
btn.addEventListener('click', () => {
  localStorage.clear();
  document.querySelector('.cart__items').innerHTML = '';
});

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
  return event.target.remove();
}

// Recebe um obj com 3 keys especificas e cria um elemento no carrinho:
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// document.getElementById('oi');

// Salva a lista de produtos no carrinho:
function saveCartList() {
  const ol = document.querySelector(cartClass);
  [...ol.children].map((children, index) => {
    const cartList = {
      sku: children.id,
      name: children.title,
      salePrice: children.price,
      };
    // Salva no localstorage: o indice da tarefa(keyName do LS) e seu obj respectivo transformado em string(keyValue do LS);
    localStorage.setItem(`${index}`, JSON.stringify(cartList));
    return true; // Lint: 'Expected to return a value in arrow function.'
  });
}

function loadCartList() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const obj = JSON.parse(localStorage[i]);
    const cartItemLoad = document.createElement('li');
    cartItemLoad.innerHTML = `${console.log(obj)}`;
    document.querySelector(cartClass).appendChild(cartItemLoad);
  }
}

// Com o ID vindo de 'getSkuFromProductItem' cria o produto especifico no carrinho de compras com a função 'createCartItemElement':
const getProduct = (itemID) => fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((productToCart) => {
      const inCart = {
        sku: productToCart.id,
        name: productToCart.title,
        salePrice: productToCart.price,
        };
        document.querySelector(cartClass).appendChild(createCartItemElement(inCart));
    })
    .then(saveCartList);

// Caso haja uma lista no local storage, ela será exibida: 
// function loadCartList() {
//   for (let i = 0; i < localStorage.length; i += 1) {
//     const obj = JSON.parse(localStorage[i]);
//     const cartItemLoad = document.createElement('li');
//     cartItemLoad.innerHTML = `${obj.name}`;
//     ol.appendChild(cartItemLoad);
//   }
// }

// Através de infos especificas cria elementos filhos de 'section', com auxilio de outras funções previamente criadas;
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', (event) => {
    const item = event.target;
    getProduct(getSkuFromProductItem(item.parentNode));
  });

  return section;
}

// Através da requisição da API captura uma lista de obj e, pegando infos especificas deles, cria a lista de produtos com a função: 'createProductItemElement';
function productInfo(product) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => response.json())
  .then((computers) => {
    computers.results.forEach((element) => {
      const pc = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(pc));
    });
  });
}
        
window.onload = function onload() { 
  productInfo('computador');
  // saveCartList();
  loadCartList();
};

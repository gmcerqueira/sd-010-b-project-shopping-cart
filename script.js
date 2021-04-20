const catchOl = () => {
  const ol = document.querySelector('.cart__items');
  return ol;
};
const insertOnLocalStorage = () => {
  localStorage.setItem('cart', catchOl().innerHTML);
};

const getProducts = async () => {
  const products = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const allProducts = await products.json();
  const { results } = allProducts;
  // console.log(results);
  return results;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
// Desenvolvido com ajuda do Rafael Mathias
const loading = () => {
  const section = document.querySelector('.items');
  const span1 = document.createElement('span');
  span1.className = 'loading';
  span1.innerText = 'loading...';
  section.appendChild(span1);
};

const deletingLoading = () => {
 document.querySelector('.loading').remove();
};
async function getItemById(event) {
  const ids = getSkuFromProductItem(event.target.parentNode);
  const idProducts = await fetch(`https://api.mercadolibre.com/items/${ids}`);
  const idProduct = await idProducts.json();
  return idProduct;
}

let soma1 = [];
let results = 0;

const soma = async () => {
    results = await soma1.reduce((acc, curr) => acc + curr);
    const span = document.querySelector('.total-price');
    span.innerText = results;
};
// Click Events on Cart Items - Créditos para Jefferson A. que indicou o splice()
async function cartItemClickListener(event) {
  // coloque seu código aqui
  const removeItem = event.target;
  removeItem.parentNode.removeChild(removeItem);
  soma1.splice(soma1.indexOf(Number(removeItem.innerText.split('$')[1])), 1);
  insertOnLocalStorage();
  soma();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const renderProducts = (products) => {
  const productsItens = document.querySelector('.items');
  products.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const productsRenders = createProductItemElement({ sku, name, image });
    productsItens.appendChild(productsRenders);
  });
};

// FUNCTION TO INSERT ITEM NO CART
function insertOnCart(event) {
  const insertItem = async () => {
    const getItem = await getItemById(event);
    const objIdPrduct = { sku: getItem.id, name: getItem.title, salePrice: getItem.price };
    console.log(getItem);
    const test = catchOl();
    console.log(test);
    test.appendChild(createCartItemElement(objIdPrduct));
    insertOnLocalStorage();
    soma1.push(getItem.price);
    soma();
  };
  // console.log(insertItem);
  return insertItem();
}
console.log(results);
// ADD ITEMS TO CARTS AND DO THE SUM
const btnAddOnCartAndSum = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', insertOnCart);
  });
};
// REMOVE ALL ITEMS FROM CART
const removeAllItemsFromCart = () => {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', () => {
    const li = document.querySelectorAll('.cart__item');
    li.forEach((element) => {
      element.parentNode.removeChild(element);
      soma1 = [0];
      const span = document.querySelector('.total-price');
      span.innerText = soma1;
    });
    insertOnLocalStorage();
  });
};

const getSaveCartIems = () => {
  const saveCartItems = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = saveCartItems;
  // const saveCartItems = localStorage.getItem('arrayItens');
  // const teste = JSON.parse(saveCartItems);
  // teste.forEach((element) => {
  //   const resolvoJa = createCartItemElement(element);
  // });
  // // console.log(teste);
  // document.querySelector('.cart__items').innerHTML = JSON.parse(saveCartItems);
};

window.onload = async function onload() { 
  // const itemsById = await getItemById(event);
  loading();
  getSaveCartIems();
  console.log('Ok,Starts!');
  const products = await getProducts();
  renderProducts(products);
  deletingLoading();
  btnAddOnCartAndSum();
  removeAllItemsFromCart();
};

const olClass = '.cart__items';
let arraySum = [];
let spanHtml = document.querySelector('.total-price');
const apiAcess = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const {
    results,
  } = await response.json();
  return results;
};

// cria elemento img no html
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// cria elemento com o texto e com a classe e o texto
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// 
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const setStorage = (ol) => {
  localStorage.setItem('localCart', ol.innerHTML);
};

const subItensCart = () => {
  const sub = arraySum.reduce((sum, curr) => sum + curr);
  spanHtml.innerHTML = sub;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const price = event.target.getAttribute('price');
  const olStorage = document.querySelector(olClass);
  const newArray = arraySum.filter((element) => element !== parseFloat(price));
  arraySum = newArray;
  if (arraySum.length === 0) {
    spanHtml.innerHTML = 0;
  } else {
    subItensCart();
  }
  setStorage(olStorage);// o target referencia o objeto que criou o evento, no caso é a li que foi clicada
}
// cria card dos itens no carrinho
function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.setAttribute('price', salePrice);
  return li;
}
// soma os itens adcionados no carrinho
const sumItensCart = ({ price }) => {
  arraySum.push(price);
  const priceTotal = arraySum.reduce((sum, curr) => sum + curr);
  spanHtml.innerHTML = priceTotal;
};

const addToCart = async (skuId) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${skuId}`);
  const jsonResponse = await response.json();
  const newItem = createCartItemElement({
    sku: jsonResponse.id,
    name: jsonResponse.title,
    salePrice: jsonResponse.price,
  });
  const orderedList = document.querySelector(olClass);
  console.log(orderedList);
  orderedList.appendChild(newItem);
  sumItensCart(jsonResponse);
  setStorage(orderedList);// set do storage depois da criacao do ultimo filho
};

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const itemButton = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(itemButton);
  itemButton.addEventListener('click', () => addToCart(sku));
  return section;
}

const newChild = (element) => {
  const createChild = document.getElementsByClassName('items')[0];
  createChild.appendChild(element);
};

const makeProduct = (apiJason) => {
  const results = apiJason.forEach((element) => {
    const object = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    newChild(createProductItemElement(object));
  });
  return results;
};

const cartStorage = () => {
  const getStorage = localStorage.getItem('localCart');
  console.log(getStorage);
  const olStorage = document.querySelector(olClass);
  olStorage.innerHTML = getStorage;
  const liCart = document.querySelectorAll('.cart__item');
  liCart.forEach((li) => li.addEventListener('click', cartItemClickListener));
};

const createList = async () => {
  makeProduct(await apiAcess());
};

window.onload = function onload() {
  createList();
  cartStorage();
};
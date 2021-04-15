window.onload = function onload() { };

// URL's
const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const urlProduct = 'https://api.mercadolibre.com/items/';

const totalPrice = document.querySelector('.total-price');
const cardItems = document.querySelector('.cart__items');
const loader = document.querySelector('.loder');

const fetchProducts = async (item, Url) => {
  const loading = '<div class="loading">Carregando...</div>';
  loader.innerHTML = loading;
  const result = await fetch(`${Url}${item}`).then((resp) => resp.json());
  loader.innerHTML = '';
  return result;
};

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

function dellCartsSaveds() {
  localStorage.removeItem('CartItemsToSave');
}

function saveCart() {
  const infosToSave = [];
  dellCartsSaveds();
  const allItemsNow = document.querySelectorAll('.cart__item');
  allItemsNow.forEach((item) => {
    const itemObj = { item: item.innerText };
    infosToSave.push(itemObj);
  });
  infosToSave.push(totalPrice.innerText);
  localStorage.setItem('CartItemsToSave', JSON.stringify(infosToSave));
}

function upTotalPrice(price, op) {
  if (op === '+') {
    totalPrice
  .innerText = Number((parseFloat(totalPrice.innerText) + parseFloat(price)).toFixed(2));
  }
  if (op === '-') {
    totalPrice
  .innerText = Number((parseFloat(totalPrice.innerText) - parseFloat(price)).toFixed(2));
  }
}

function cartItemClickListener(event) {  
  const allOptionText = event.srcElement.innerText;
  upTotalPrice(allOptionText.substr(allOptionText.lastIndexOf('$') + 1), '-');
  cardItems.removeChild(event.srcElement);
  saveCart();
}

function updateCart(itemsCard) {
  itemsCard.forEach((itemCard) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = itemCard;
    li.addEventListener('click', cartItemClickListener); 
    cardItems.appendChild(li);
  });  
}

function loadCart() {
  const itemsCard = [];
  const toLoadItems = JSON.parse(localStorage.getItem('CartItemsToSave'));
  if (toLoadItems) {
    for (let item = 0; item < toLoadItems.length - 1; item += 1) {
      itemsCard.push(toLoadItems[item].item);
    }
    updateCart(itemsCard);
    upTotalPrice(toLoadItems[toLoadItems.length - 1], '+');
  } else {
    console.log('Vasio');
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); 
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  buttonAdd.addEventListener('click', async () => {
    const idItem = buttonAdd.parentNode.firstChild.innerText;
    const itemInfo = await fetchProducts(idItem, urlProduct);
    cardItems.appendChild(createCartItemElement(itemInfo));
    upTotalPrice(itemInfo.price, '+');
    saveCart();
  });

  return section;
}

const mountItems = async (product) => {  
  const conteinerItems = document.querySelector('.items');

  const arrItens = await fetchProducts(product, urlProducts);
  arrItens.results.forEach((item) => conteinerItems.appendChild(createProductItemElement(item)));
};

function reviverButtonClear() {
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', () => {
    cardItems.innerHTML = '';
    upTotalPrice(totalPrice.innerText, '-');
    saveCart();
  }); 
}

mountItems('computador');
loadCart();
reviverButtonClear();

let total = 0;
const totalDom = document.getElementsByClassName('total-price')[0];
const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

  async function totalAdd(price) {
    total += Math.round(price * 100) / 100;
    totalDom.innerText = total;
  }

  function deleteAllItensInCart() {
    const cart = document.getElementsByClassName('cart__items')[0];
    while (cart.firstChild) (cart.removeChild(cart.lastChild));
    total = 0;
    totalDom.innerText = 0;
    localStorage.setItem('cart', '');
    localStorage.setItem('total', 0);
  }
  
  function cartItemClickListener(event) {
    console.log(event.target.id);
    event.target.parentNode.removeChild(event.target);
    const API_URL = `https://api.mercadolibre.com/items/${event.target.id}`;
    fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((results) => {
      const removePrice = results.price * (-1);
      console.log(removePrice);
      totalAdd(removePrice);
    });
  }
  
  function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    const cart = document.getElementsByClassName('cart__items')[0];
    cart.appendChild(li);
    li.className = 'cart__item';
    li.id = sku;
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    localStorage.setItem('cart', cart.innerHTML);
    totalAdd(salePrice);
    localStorage.setItem('total', total);
    return li;
  }
  
  function getCartItemFromApi(productId, index) {
    const API_URL = `https://api.mercadolibre.com/items/${productId}`;
    fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((results) => {
      const button = document.getElementsByClassName('item__add')[index];
      button.addEventListener('click', () => createCartItemElement(results));
    });
  }
  
  function createDom(itens) {
    const shelf = document.getElementsByClassName('items')[0];
    itens.forEach((item, index) => {
      const placeOfItem = document.createElement('div');
      shelf.appendChild(placeOfItem);
      const lastProductInShelfNow = shelf.lastChild;
      lastProductInShelfNow.id = item.id;
      lastProductInShelfNow.className = 'itensInShelf';
      lastProductInShelfNow.appendChild(createProductItemElement(item));
      getCartItemFromApi(item.id, index);
    });
  }
  
  function getItensListFromApi() {
    const query = 'computador';
    const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
    fetch(API_URL, myObject)
    .then((response) => response.json())
    .then(({ results }) => createDom(results));
  }
  function addEventLIstenerCartAgain() {
    const [...allLi] = document.getElementsByClassName('cart__item');
    allLi.forEach((li) => li.addEventListener('click', cartItemClickListener));
  }

  window.onload = function onload() {
    getItensListFromApi();
    const emptyCart = document.getElementsByClassName('empty-cart')[0];
    emptyCart.addEventListener('click', deleteAllItensInCart);
    const cart = document.getElementsByClassName('cart__items')[0];
    cart.innerHTML = localStorage.getItem('cart');
    totalDom.innerText += localStorage.getItem('total');    
    total = Math.round(parseFloat(localStorage.getItem('total')) * 100) / 100;
    addEventLIstenerCartAgain();
   };
  function cartItemClickListener(event) {
    const itemToDelete = event.target;
    // Método por Krasimir, stackoverflow.
    // Disponível em: https://stackoverflow.com/questions/18795028/javascript-remove-li-without-removing-ul
    console.log(itemToDelete.parentNode.children);
    let position;
    const listOfChildren = itemToDelete.parentNode.children;
    for (let index = 0; index < listOfChildren.length; index += 1) {
      if (listOfChildren[index] === itemToDelete) position = index;
    }
    itemToDelete.parentNode.removeChild(itemToDelete);
    const savedIds = localStorage.getItem('cart');
    console.log(position);
    const arrayIds = savedIds.split(',');
    const removed = arrayIds.filter((item) => (arrayIds.indexOf(item)) !== position);
    localStorage.setItem('cart', (removed));
  }

async function getProducts(search) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
  const products = await response.json();
  return products.results;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const cartIds = [];

async function addToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await response.json();
  const { title, price } = product;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  const sectionListCart = document.getElementsByClassName('cart__items');
  sectionListCart[0].appendChild(cartItem);
  cartIds.push(id);
  localStorage.setItem('cart', (cartIds));
}

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function renderList(products) {
  const sectionList = document.getElementsByClassName('items');
  products.forEach(({ id, title, thumbnail }) => {
    const elementoLista = createProductItemElement({ sku: id, name: title, image: thumbnail });
    sectionList[0].appendChild(elementoLista);
  });
}

async function restoreSavedCart() {
  const savedIds = localStorage.getItem('cart');
  savedIds.split(',').forEach((id) => addToCart(id));
}

const buttons = document.getElementsByClassName('item__add');

window.onload = async function onload() { 
  console.log('Verificação onload');
  const computers = await getProducts('computador');
  renderList(computers);
  if (localStorage.getItem('cart') !== null && localStorage.getItem('cart') !== '') {
    restoreSavedCart();
  }
  Object.values(buttons).forEach((button) => {
    button.addEventListener('click', function (event) {
      const dadId = event.target.parentNode.firstChild.innerText;
      addToCart(dadId);
      console.log(dadId);
    });
  });
};

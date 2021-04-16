window.onload = function onload() { };

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui 
  return event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProducts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const products = await response.json();
  const productList = await products.results;
  return productList;
};

const renderProducts = async () => {
  const itemsProducts = await getProducts();
  const items = document.querySelector('.items');
  itemsProducts.forEach((itemProduct) => {
    const objItem = { sku: itemProduct.id, name: itemProduct.title, image: itemProduct.thumbnail };
    items.appendChild(createProductItemElement(objItem));
  });
};

const getId = async (id) => {
  const itemId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const response = await itemId.json();
  return response;
};

const eventButtomItem = async (id) => {
  const product = await getId(id);
  const productCart = createCartItemElement(product);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(productCart);
  localStorage.setItem('Cart', ol.innerHTML);
};

const renderItemsCart = async () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    const idProduct = button.parentElement.firstElementChild.innerText;
    button.addEventListener('click', () => {
      eventButtomItem(idProduct);
    });
  });
};

const removeAll = () => {
  const buttomRemove = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  buttomRemove.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};

const saveCart = () => {
  const saveItems = localStorage.getItem('Cart');
  document.querySelector('.cart__items').innerHTML = saveItems;
};

window.onload = async function onload() {
  await renderProducts();
  await renderItemsCart();
  await removeAll();
  await saveCart();
};

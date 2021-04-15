  function cartItemClickListener(event) {
    const itemToDelete = event.target;
    // Método por Krasimir, stackoverflow.
    // Disponível em: https://stackoverflow.com/questions/18795028/javascript-remove-li-without-removing-ul
    itemToDelete.parentNode.removeChild(itemToDelete);
}

// const buttons = document.getElementsByClassName('item__add');
// buttons.addEventListener('click', addToCart);

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

async function addToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await response.json();
  const { title, price } = product;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  const sectionListCart = document.getElementsByClassName('cart__items');
  sectionListCart[0].appendChild(cartItem);
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
// mod
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
  // const computers = getProducts("computador");
  products.forEach(({ id, title, thumbnail }) => {
    const elementoLista = createProductItemElement({ sku: id, name: title, image: thumbnail });
    sectionList[0].appendChild(elementoLista);
  });
}

const buttons = document.getElementsByClassName('item__add');

window.onload = async function onload() { 
  console.log('Verificação onload');
  const computers = await getProducts('computador');
  renderList(computers);
  Object.values(buttons).forEach((button) => {
    button.addEventListener('click', function (event) {
      const dadId = event.target.parentNode.firstChild.innerText;
      addToCart(dadId);
      console.log(dadId);
    });
  });
};
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

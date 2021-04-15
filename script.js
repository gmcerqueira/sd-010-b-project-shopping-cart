function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
function cartItemClickListener(event) {
  const alvo = event.target;
  const listCart = document.querySelector('.cart__items');
  listCart.removeChild(alvo);
}

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(product) {
  product.addEventListener('click', async () => {
    const id = product.children[0].innerText;
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const element = await response.json();
    const listCart = document.querySelector('.cart__items');
    listCart.appendChild(createCartItemElement(element));
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  addToCart(section);
  return section;
}

async function getProductsList(word) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${word}`);
  const object = await response.json();
  const {
    results,
  } = object;
  const section = document.querySelector('.items');
  results.forEach((item) => {
    // Dica do PR da Ana Gomes 
    section.appendChild(createProductItemElement(item));
  });
}

window.onload = function onload() {
  getProductsList('computador');
};
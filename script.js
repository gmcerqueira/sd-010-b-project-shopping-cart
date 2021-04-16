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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  // coloque seu código aqui
  event.path[0].remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getListProducts() {
  const endPoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await endPoint.json();
  const span = document.querySelector('.items');
  products.results.forEach((product) => {
    span.appendChild(createProductItemElement(product));
  });
  return span;
}

function shoppingCart(spans) {
  const ol = document.querySelector('.cart__items');
  for (let index = 0; index < spans.children.length; index += 1) {
    spans.children[index].lastChild.addEventListener('click', async (button) => {
      const id = button.path[1].firstChild.innerText;
      const item = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const itemJson = await item.json();
      ol.appendChild(createCartItemElement(itemJson));
    });
  }
}

window.onload = async function onload() {
  const products = await getListProducts();
  shoppingCart(products);
};
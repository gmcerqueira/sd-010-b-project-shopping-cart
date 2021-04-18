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

async function getSkuFromProductItem(item) {
  return item.id;
}

async function changePrice(salePrice) {
  const number = salePrice.price;
  const total = document.querySelector('.total-price');
  total.innerHTML = (Math.round(((total.innerHTML) * 100) / 100) + number);
}

async function cartItemClickListener(event) {
  // coloque seu código aqui
  const text = await event.path[0].innerText;
  const num = await text.substring(text.indexOf('$') + 1);
  await changePrice({ price: (num * (-1)) });
  await event.path[0].remove();
  localStorage.removeItem(event.path[0].id);
}

async function getProductID(idButton) {
  const item = await fetch(`https://api.mercadolibre.com/items/${idButton}`);
  const itemJson = await item.json();
  return itemJson;
}

async function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(li.id, li);
  await changePrice(await getProductID(await getSkuFromProductItem(li)));
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

async function addShoppingCart(product) {
  const ol = document.querySelector('.cart__items');
  // console.log(product);
  ol.appendChild(await createCartItemElement(product));
}

async function rendersAfterLoading(index) {
  const key = localStorage.key(index);
  if (key !== null) {
   await addShoppingCart(await getProductID(key));
  }
}

window.onload = async function onload() {
  const products = await getListProducts();
  for (let index = 0; index < products.children.length; index += 1) {
    products.children[index].lastChild.addEventListener('click', async (buttonEvent) => {
     const itemJson = await getProductID(buttonEvent.path[1].firstChild.innerText);
     addShoppingCart(itemJson);
    });
    rendersAfterLoading(index);
  }
};
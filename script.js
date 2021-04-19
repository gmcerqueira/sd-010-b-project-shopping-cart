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

async function changePrice(salePrice) { // total preço
  const total = document.querySelector('.total-price');
  const numberTotal = parseFloat(total.innerHTML);
  const numberPrice = salePrice.price;
  total.innerHTML = numberTotal + numberPrice;
  if (total.innerHTML < 0) {
    total.innerHTML = 0;
  }
}

async function cartItemClickListener(event) { // remove no click
  // coloque seu código aqui
  const text = await event.path[0].innerText;
  const num = await text.substring(text.indexOf('$') + 1);
  await changePrice({ price: (num * (-1)) });
  await event.path[0].remove();
  localStorage.removeItem(event.path[0].id);
}

function clearCarShopping() { // limpa carrinho
  const itemLi = document.querySelectorAll('.cart__item');
  for (let index = 0; index < itemLi.length; index += 1) {
    itemLi[index].remove();
    localStorage.clear();
  }
  const total = document.querySelector('.total-price');
  total.innerHTML = 0;
}

async function getProductID(idButton) { // pegar produto id
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
  localStorage.setItem(li.id, li); // add local storage
  await changePrice(await getProductID(await getSkuFromProductItem(li))); // total preço
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

async function rendersAfterLoading(index) { // renderiza carrinho no onload
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
     await addShoppingCart(itemJson);
    });
    rendersAfterLoading(index);
  }
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCarShopping);
};
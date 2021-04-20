// async function cartItemClickListener(event) {
//   //
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createItemCart(id) {
  const getData = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((response) => response);
  const createItem = createCartItemElement({
    sku: getData.id,
    name: getData.title,
    salePrice: getData.price,
  });
  document.querySelector('.cart__items').appendChild(createItem);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getItemId(event) {
  const elementFather = event.target.parentElement;
  const elementChildId = getSkuFromProductItem(elementFather);
  createItemCart(elementChildId);
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
  // Nessa parte eu me orientei com o Leandro Reis, porque eu não conseguia adicionar os eventos por meio do forEach, que inclusive está comentada a função que eu tentei criar. link:https://github.com/tryber/sd-010-b-project-shopping-cart/pull/6/commits/6786f64c56a36ac67c936481ba9426f1e3b3d64e.
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', getItemId);
  section.appendChild(btn);
  return section;
}

// No requisito 1 fiquei um pouco perdido no que diz respeito a estruturação da resposta, mesmo tendo uma ideia de como fazê-la. Então busquei me orientar com o meu colega Leandro Reis, foi então que eu percebi o que o requisito realmente pedia. link: https://github.com/tryber/sd-010-b-project-shopping-cart/pull/6/commits/4313a30ae6b5617cd45bd6434e2e5c50e9144818.

async function getProducts() {
  const myFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((response) => response.results);
  myFetch.forEach((product) => {
    // Aqui acrescentamos os respectivos valores das chaves do destruction.
    const createProduct = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    // Aqui incorporamos o elemento HTML criado ao elemento pai(.items).
    const elementFather = document.querySelector('.items');
    elementFather.appendChild(createProduct);
  });
}

// Aqui eu tentei adicionar um evento em cada botão, porém sem sucesso.
// function getButtonAddItem() {
  //   const getButton = document.querySelectorAll('button');
  //   getButton.forEach(button => button.addEventListener('click', getItemId))
  // }

window.onload = function onload() { 
  getProducts();
  // getButtonAddItem();
};

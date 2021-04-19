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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   //
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = function onload() { 
  getProducts();
};

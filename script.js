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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

async function getResultsAPI(url) {
  const { results } = await fetch(url)
  .then((response) => response.json())
  .catch(() => 'não foi possível acessar a API');
  return results;
}

async function createItemElements(url) {
  const sectionItems = document.querySelector('.items');
  const createHTMLElements = await getResultsAPI(url)
  .then((array) => {
    array.forEach((element) => sectionItems.appendChild(createProductItemElement(element)));
  })
  .catch(() => 'não foi possível acessar o elemento');
  return createHTMLElements;
}

window.onload = function onload() {
  createItemElements('https://api.mercadolibre.com/sites/MLB/search?q=computador');
 };

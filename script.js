const mlbURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchResults = (url) => fetch(url)
  .then((response) => response.json())
  .then((result) => {
    const items = result.results;
    return items.map((item) => ({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    }));
  });

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

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// const allComputers = fetchResults();

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({
//   sku,
//   name,
//   salePrice
// }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = async function onload() {
  const results = await fetchResults(mlbURL);
  const itemCatalog = document.querySelector('.items');

  results.forEach((item) => {
    const itemElement = createProductItemElement(item);
    itemCatalog.appendChild(itemElement);
  });
};
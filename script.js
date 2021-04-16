const mlbURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
// const idURL = `https://api.mercadolibre.com/items/$ItemID`

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

const fetchItem = (itemID) => fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then((item) => {
    const cartItem = {
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    };
    return cartItem;
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
  section.lastChild.addEventListener('click', (event) => addItemToCart(event));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const storageText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.innerText = storageText;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

const addItemToCart = async (event) => {
  const element = event.target.parentElement;
  const idSku = element.firstChild.innerText;
  const cartItems = document.querySelector('.cart__items');
  const itemDetails = await fetchItem(idSku);
  console.log(itemDetails);
  cartItems.appendChild(createCartItemElement(itemDetails));
};

const renderCatalog = (results) => {
  const itemCatalog = document.querySelector('.items');
  results.forEach((item) => {
    const itemElement = createProductItemElement(item);
    itemCatalog.appendChild(itemElement);
  });
};

window.onload = async function onload() {
  const results = await fetchResults(mlbURL);
  renderCatalog(results);
};
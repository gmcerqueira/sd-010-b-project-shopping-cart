// AJUDA DO JEFFERSON ANDRADE NO PROJETO <3
// AJUDA DO LUCAS NO PROJETO <3
const arrayStorage = [];
const priceItem = [];

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

function priceCart() {
  const priceClass = document.querySelector('.total-price');
  const sumPrice = priceItem.reduce((acc, curr) => acc + curr, 0);
  priceClass.innerHTML = `${sumPrice}`;
}

async function cartItemClickListener(event, sku) {
  const item = event.target;
  item.remove();
  const itemRemove = arrayStorage.find((iten) => iten.id === sku);
  arrayStorage.splice(arrayStorage.indexOf(itemRemove), 1);
  priceItem.splice(priceItem.indexOf(Number(item.innerText.split('$')[1])), 1);
  localStorage.setItem('items', JSON.stringify(arrayStorage));
  priceCart();
}

function clearArray() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.clear();
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('ol');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, sku));
  ol.appendChild(li);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((res) => res.json())
        .then((data) => {
          createCartItemElement(data);
          arrayStorage.push(data);
          priceItem.push(data.price);
        })
        .then(() => localStorage.setItem('items', JSON.stringify(arrayStorage)))
        .then(() => priceCart());
    });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function fetchApi($QUERY) {
  const load = document.querySelector('.loading');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const newObj = { sku: result.id, name: result.title, image: result.thumbnail };
        const itemsClass = document.querySelector('.items');
        itemsClass.appendChild(createProductItemElement(newObj));
        load.remove();
      });
    });
}

window.onload = async function onload() {
  await fetchApi('computador');
  clearArray();
  const recoveryArray = await localStorage.getItem('items');
  const arrayObj = JSON.parse(recoveryArray);
  arrayObj.forEach((itemArray) => createCartItemElement(itemArray));
  priceCart();
};
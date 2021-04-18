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

function priceCart(price) {
  priceItem.push(price);
  const sessionCart = document.querySelector('.cart');
  const priceClass = document.querySelector('.total-price');
  const sumPrice = priceItem.reduce((acc, curr) => acc + curr, 0);
  priceClass.innerHTML = `Preço Total ${sumPrice}`;
  sessionCart.appendChild(priceClass);
}

async function cartItemClickListener(event) {
  const item = event.target;
  item.parentNode.removeChild(item);
  arrayStorage.splice(arrayStorage.indexOf(item), 1);
  // priceItem.splice(priceItem.indexOf(Number(item.innerText.split('$')[1])), 1);
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
  li.addEventListener('click', cartItemClickListener);
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
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const newObj = { sku: result.id, name: result.title, image: result.thumbnail };
        const itemsClass = document.querySelector('.items');
        itemsClass.appendChild(createProductItemElement(newObj));
      });
    });
}

window.onload = async function onload() {
  await fetchApi('computador');
  clearArray();
  const recoveryArray = await localStorage.getItem('items');
  const arrayObj = JSON.parse(recoveryArray);
  arrayObj.forEach((itemArray) => createCartItemElement(itemArray));
};
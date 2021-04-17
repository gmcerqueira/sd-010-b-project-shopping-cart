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

function setListing(ide, objItem) {
  localStorage.setItem(`${ide}`, JSON.stringify(objItem));
}

async function cartItemClickListener(event) {
  const item = event.target;
  const ide = item.id;
  item.parentNode.removeChild(item);
  localStorage.removeItem(`${ide}`);
}

function priceCart(price) {
  const priceItem = [];
  const ol = document.querySelector('ol');
  const totalPrice = document.querySelector('.total-price');
  priceItem.push(price);
  const sumPrice = priceItem.reduce((acc, curr) => acc + curr);
  console.log(sumPrice);
  totalPrice.innerHTML = `Preço Total ${sumPrice}`;
  ol.appendChild(totalPrice);
}

function keepListing() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const ol = document.querySelector('ol');
    const value = JSON.parse(localStorage[i]);
    const li = document.createElement('li');
    li.id = i;
    li.innerText = `SKU: ${value.sku} | NAME: ${value.name} | PRICE: $${value.salePrice}`;
    ol.appendChild(li).addEventListener('click', cartItemClickListener);
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('ol');
  const li = document.createElement('li');
  li.id = `${localStorage.length}`;
  const ide = li.id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  setListing(ide, { sku, name, salePrice });
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  priceCart(salePrice);
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
        .then((data) => createCartItemElement(data));
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
  keepListing();
}

window.onload = function onload() {
  fetchApi('computador');
};
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

function setListing(array) {
  localStorage.setItem('items', JSON.stringify(array));
}

async function cartItemClickListener(event) {
  const item = event.target;
  item.parentNode.removeChild(item);
  // const li = document.querySelectorAll('li');
  // li.forEach((el, index) => {
  //   const split1 = el.innerText.split('|');
  //   // const newObj = {};
  //   split1.forEach((a) => {
  //     const split2 = a.split(':');
  //     // newObj.sku
  //     split2.forEach((b) => console.log(b));
  //     // const newObj = { sku: el[0], name: split2[1], salePrice: split2[1] };
  //     // console.log(split2, index);
  //     // console.log(split2);
  //     // console.log(split1[index]);
  //   });
  // });
}

const priceItem = [];
function priceCart(price) {
  priceItem.push(price);
  const sessionCart = document.querySelector('.cart');
  const priceClass = document.querySelector('.total-price');
  const sumPrice = priceItem.reduce((acc, curr) => acc + curr, 0);
  priceClass.innerHTML = `Preço Total ${sumPrice}`;
  sessionCart.appendChild(priceClass);
}

const arrayStorage = [];
function saveItemsArray(item) {
  arrayStorage.push(item);
  setListing(arrayStorage);
}

// function removeItemsArray(item) {
// remover  o item do array que tá no local storage
// }

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
  saveItemsArray({ sku, name, salePrice });
  priceCart(salePrice);
}

function showArray() {
  const recoveryArray = localStorage.getItem('items');
  const arrayObj = JSON.parse(recoveryArray);
  arrayObj.forEach((item) => {
    const ol = document.querySelector('ol');
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${item.sku} | NAME: ${item.name} | PRICE: $${item.salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    ol.appendChild(li);
  });
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
}

window.onload = async function onload() {
  await fetchApi('computador');
  showArray();
  clearArray();
};
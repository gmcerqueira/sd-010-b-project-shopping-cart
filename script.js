const cartItem = '.cart__items';

const updatePrices = async () => {
  const items = document.querySelectorAll('.cart__item');
  const pricesArray = [];
  items.forEach((element) => {
    const split = element.textContent.split(' | ');
    const priceTag = split[2].split(' ');
    const price = priceTag[1].substring(1);
    pricesArray.push(Number(price));
  });
  const totalPrice = await pricesArray.reduce((acc, curr) => acc + curr, 0);
  const pricePlace = await document.querySelector('.total-price');
  console.log(totalPrice);
  pricePlace.textContent = `Preço Total: $ ${parseFloat(totalPrice).toFixed(2)}`;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.src = imageSource;
  return img;
}
function createCustomElement(element, className, innerText) {
  const newElement = document.createElement(element);
  newElement.className = className;
  newElement.innerText = innerText;
  return newElement;
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add button', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const cartList = document.querySelector(cartItem);
  cartList.removeChild(event.target);
  const array = event.target.innerText.split(' | ');
  localStorage.removeItem(array[0]);
  updatePrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const listItem = document.createElement('li');
  listItem.className = 'cart__item';
  listItem.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  listItem.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`SKU: ${sku}`, `${listItem.innerText}`);
  return listItem;
}

async function fetchML() {
  const unorderedList = document.querySelector('.list');
  const listItem = document.createElement('li');
  listItem.className = 'loading';
  listItem.innerText = 'Espere! Está Carregando...';
  unorderedList.appendChild(listItem);
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador',
    { method: 'GET' });
  const json = await response.json();
  return json.results;
}

async function fetchItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`,
    { method: 'GET' });
  const json = await response.json();
  return json;
}

const addToCart = () => {
  document.querySelectorAll('.item__add').forEach((addCart) => {
    addCart.addEventListener('click', (event) => {
      const firstSibling = event.target.parentNode.firstChild;
      fetchItem(firstSibling.innerText).then((resolve) => {
        const unorderedList = document.querySelector(cartItem);
        const listItem = createCartItemElement({
          sku: resolve.id,
          name: resolve.title,
          salePrice: resolve.price,
        });
        unorderedList.appendChild(listItem);
        updatePrices();
      });
    });
  });
};

const loadStorage = () => {
  const items = Object.values(localStorage);
  return items;  
};

const populateFromStorage = (arrayStorage) => {
  const unorderedList = document.querySelector(cartItem);
  arrayStorage.forEach((element) => {
    const listItem = document.createElement('li');
    listItem.className = 'cart__item';
    listItem.textContent = `${element}`;
    listItem.addEventListener('click', cartItemClickListener);
    unorderedList.appendChild(listItem);
  });
  updatePrices();
};

const clearCart = () => {
  document.querySelector(cartItem).innerHTML = '';
  localStorage.clear();
  document.querySelector('.total-price').textContent = '';
};

const populateList = (showcase) => {
  const unorderedList = document.querySelector('.items');
  showcase.forEach((element) => {
    const child = createProductItemElement({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    });
    unorderedList.appendChild(child);
  });
};

window.onload = () => {
  fetchML()
    .then((resolve) => {
      populateList(resolve);
      addToCart();
    })
    .then(() => document.querySelector('.list').remove());
  if (localStorage) {
    populateFromStorage(loadStorage());
  }
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  const array = event.target.innerText.split(' | ');
  localStorage.removeItem(array[0]);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`SKU: ${sku}`, `${li.innerText}`);
  return li;
}

async function fetchML() {
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
  document.querySelectorAll('.item__add').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      const firstSibling = event.target.parentNode.firstChild;
      fetchItem(firstSibling.innerText).then((result2) => {
        const father = document.querySelector('.cart__items');
        const child = createCartItemElement({
          sku: result2.id,
          name: result2.title,
          salePrice: result2.price,
        });
        father.appendChild(child);
      });
    });
  });
};

const loadStorage = () => {
  console.log(localStorage);
  const indexes = Object.keys(localStorage);
  const skuList = indexes.map((element) => {
    const array = element.split(' ');
    return array[1];
  });
  return skuList;
};

const populateFromStorage = (array) => {
  array.forEach((element) => {
    fetchItem(element).then((result) => {
      const father = document.querySelector('.cart__items');
      const child = createCartItemElement({
        sku: result.id,
        name: result.title,
        salePrice: result.price,
      });
      father.appendChild(child);
    });
  });
};

window.onload = function onload() {
  fetchML().then((result) => {
    const father = document.querySelector('.items');
    result.forEach((element) => {
      const child = createProductItemElement({
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      });
      father.appendChild(child);
    });
    addToCart();
  });
  if (localStorage) {
    populateFromStorage(loadStorage());
  }
};

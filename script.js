const array = [];
function retirarItem(valor) {
  console.log(valor);
    const element = array.find((el) => el === valor);
    array.splice(array.indexOf(element), 1);
    localStorage.setItem('IDS', JSON.stringify(array));
}

function cartItemClickListener(event) {
  if (event.target.parentElement.parentElement.tagName === 'LI') {
    retirarItem(event.target.parentElement.firstChild.innerText.split(' ')[1]);
    event.target.parentElement.parentElement.remove();
  } else {
    retirarItem(event.target.firstChild.firstChild.innerText.split(' ')[1]);
    event.target.remove();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

function buttonAdd(button, sku) {
  button.addEventListener('click', () => {
    const $ItemID = sku;
    array.push(sku);
    localStorage.setItem('IDS', JSON.stringify(array));
    fetch(`https://api.mercadolibre.com/items/${$ItemID}`)
    .then((r) => r.json())
    .then((r) => {
      const object = {
        sku: $ItemID, 
        name: r.title, 
        salePrice: r.price,
      };
      const cart = document.getElementsByClassName('cart__items')[0];
      cart.appendChild(createCartItemElement(object));
    });
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const id = createCustomElement('span', 'item__sku', sku);
  section.appendChild(id);
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  buttonAdd(button, sku);

  return section;
}

function verifiedFetch(url) {
  fetch(url)
    .then((r) => r.json())
    .then((r) => {
      r.results.forEach((element) => {
        const object = {
          sku: element.id, 
          name: element.title, 
          image: element.thumbnail,
        };
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement(object));
      });
    });
}

function sacolaSalva(element) {
    const $ItemID = element;
    fetch(`https://api.mercadolibre.com/items/${$ItemID}`)
    .then((g) => g.json())
    .then((g) => {
      const object = {
        sku: $ItemID, 
        name: g.title, 
        salePrice: g.price,
      };
      const cart = document.getElementsByClassName('cart__items')[0];
      cart.appendChild(createCartItemElement(object));
    });
}

window.onload = function onload() { 
  verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const ar = JSON.parse(localStorage.getItem('IDS'));
  ar.forEach((element) => sacolaSalva(element));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const array = [];
function retirarItem(valor) {
    const element = array.find((el) => el === valor);
    array.splice(array.indexOf(element), 1);
    localStorage.setItem('IDS', JSON.stringify(array));
}

function cartItemClickListener(event) {
  const one = event.target;
  const one1 = one.parentElement;
  if (one1.parentElement.tagName === 'LI' ) {
    retirarItem(one.parentElement.firstChild.innerHTML.split(' ')[1]);
    event.target.parentElement.parentElement.remove();
  } else {
      retirarItem(one.firstChild.firstChild.innerHTML.split(' ')[1]);
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

let soma = 0;
async function somaPrice(object) {
  const p = document.querySelector('.total-price');
  soma += object.salePrice;
  p.innerText = soma;
  console.log(soma);  
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
      somaPrice(object);
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
    array.push(element);
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

function empty() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const narray = [...document.querySelector('.cart').children[2].children];
    narray.forEach((element) => element.remove());
  });
}

window.onload = function onload() { 
  verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const ar = JSON.parse(localStorage.getItem('IDS'));
  if (ar !== null) {
    ar.forEach((element) => sacolaSalva(element)); 
  }
  empty();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

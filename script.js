function retirarItem() {
  const cart = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('IDS', cart.innerHTML);
}

let soma = 0;
async function subtraiPrice(tag) {
  const p = document.querySelector('.total-price');
  if (tag.innerHTML.split(' ')[2].includes(',') === true) {
    soma -= parseFloat(tag.innerHTML.split(' ')[2].replace(',', '.'));
  } else {
    console.log(tag.innerHTML.split(' ')[2].replace('.', ''));
    soma -= parseFloat(tag.innerHTML.split(' ')[2].replace('.', ''));
  }
  console.log(soma);  
  if (p.innerText !== null) {
    p.innerText = Math.round(soma * 100) / 100;  
  }
}

function cartItemClickListener(event) {
  const one = event.target;
  const one1 = one.parentElement;
  if (one1.parentElement.tagName === 'LI') {
    subtraiPrice(event.target.parentElement.children[2]);
    event.target.parentElement.parentElement.remove();
    retirarItem();
  } else {
      retirarItem();
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

async function somaPrice(object) {
  const p = document.querySelector('.total-price');
  soma += Math.round(object.salePrice * 100) / 100;
  if (p.innerText !== null) {
    p.innerText = Math.round(soma * 100) / 100;
  }
}

function buttonAdd(button, sku) {
  button.addEventListener('click', () => {
    const $ItemID = sku;
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
      localStorage.setItem('IDS', cart.innerHTML);
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

function verifiedFetch() {
  const p = document.querySelector('.loading');
  p.innerHTML = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((r) => r.json())
    .then((r) => {
      r.results.forEach((element) => {
        p.remove();
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

function sacolaSalva(ar) {
  const cart = document.getElementsByClassName('cart__items')[0];
  cart.innerHTML = ar;
}

function empty() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const narray = [...document.querySelector('.cart').children[2].children];
    narray.forEach((element) => element.remove());
  });
}

window.onload = function onload() { 
  verifiedFetch();
  const ar = localStorage.getItem('IDS');
  if (ar) {
    sacolaSalva(ar); 
  }
  empty();
};
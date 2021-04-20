function cartItemClickListener(event) {
  event.target.remove();
//  calcPreço();
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
}

function getProductId(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((r) => r.json())
    .then((r) => (r))
    .catch((error) => error);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criarElemento(element, className, innerText) {
  const elemento = document.createElement(element);
  elemento.className = className;
  elemento.innerText = innerText;
  return elemento;
}

function criarImagem(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function calcPreço(price) {
//   let total = parseFloat(localStorage.getItem('preco'));
//   total += price;
//   const price2 = Math.round(total * 100) / 100;
//   localStorage.setItem('preco', price2);
//   const encontrarP = document.getElementsByClassName('price-item')[0];
//   encontrarP.remove();
//   const cartItems = document.getElementsByClassName('cart__items')[0];
//   const criarP = document.createElement('p');
//   criarP.classList.add('price-item');
//   criarP.innerHTML = `R$:${total}`;
//   //cartItems.appendChild(criarP);
// }

async function clickElemente(event) {
  const incontrarItem = document.getElementsByClassName('cart__items')[0];
  const parent = event.target.parentElement;
  const prodID = parent.querySelector('span.item__sku').innerText;
  const prod = await getProductId(prodID);
  const newEl = createCartItemElement({
    sku: prod.id,
    name: prod.title,
    salePrice: prod.price,
  });
  incontrarItem.appendChild(newEl);
//  calcPreço(prod.price);
  localStorage.setItem('cartItems', incontrarItem.innerHTML);
}

function criarElementoNaTabela({ sku, name, image }) {
  const encontraSection = document.createElement('section');
  encontraSection.className = 'item';
  encontraSection.appendChild(criarElemento('span', 'item__sku', sku));
  encontraSection.appendChild(criarElemento('span', 'item__title', name));
  encontraSection.appendChild(criarImagem(image));
  const criarButton = criarElemento('button', 'item__add', 'Adicionar ao carrinho!');
  criarButton.addEventListener('click', clickElemente);
  encontraSection.appendChild(criarButton);
  return encontraSection;
}

async function transformarUrl(url) {
  const pegarIformacoesDaUrl = await fetch(url);
// passar para obejeto
  const arrayDaUrl = await pegarIformacoesDaUrl.json();
  const { results: answer } = arrayDaUrl;
  const elementos = document.querySelector('.items');
  answer.forEach((index) => {
    const informaçoesDoproduto = {
      sku: index.id,
      name: index.title,
      image: index.thumbnail,
    };
    const element = criarElementoNaTabela(informaçoesDoproduto);
    elementos.appendChild(element);
  });
}

const apagar = (valor) => {
  if (valor !== true) {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
  }
};

window.onload = function onload() {
  transformarUrl('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartItems');
  apagar(true);
};

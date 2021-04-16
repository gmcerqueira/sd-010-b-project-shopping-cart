// const p = document.createElement('p');
// p.innerText = 'vqv'
// const lista = document.getElementsByClassName('cart__items');
// lista.appendChild(p)

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
  // li.addEventListener('click', cartItemClickListener);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function clickElemente(event) {
  const incontrarItem = document.getElementsByClassName('cart__items')[0];
  const parent = event.target.parentElement;
  const prodID = getSkuFromProductItem(parent);
  const prod = await getProductId(prodID);
  const newEl = createCartItemElement({
    sku: prod.id,
    name: prod.title,
    salePrice: prod.price,
  });
  // calcPreço(prod.price);
  incontrarItem.appendChild(newEl);
  localStorage.setItem('cartItems', incontrarItem.innerHTML);
}

// function calcPreço(price){
//   parseFloat(price);
//   let total =  localStorage.getItem("preco");
//   total += price;
//   localStorage.setItem("preco", total);
//   console.log(total);
// }

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

//   function cartItemClickListener(event) {
//    console.log('entrou na lista');
// }

window.onload = function onload() {
  transformarUrl('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  localStorage.setItem('preco', 0);
 };

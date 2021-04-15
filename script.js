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

let total = 0;

const mostraValor = document.querySelector('.total-price');
const valorTotal = document.createElement('span');

function somaValor(price) {
  total += price;
  valorTotal.innerHTML = total;
  mostraValor.appendChild(valorTotal);
}

function salvaItens() {
  const itens = document.querySelector('.cart__items');
  localStorage.cart = itens.innerHTML;  
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const produto = document.querySelector('.cart__items');

function cartItemClickListener(event) {
  const evento = event.target;
  let valorSubtrai = evento.innerText.split('$')[1];    
  total -= valorSubtrai;
  console.log(valorSubtrai);
  console.log(total);
  valorTotal.innerHTML = total;
  evento.remove();
  salvaItens();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItemElement(evento) {
  const pegaId = getSkuFromProductItem(evento.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${pegaId}`;
  fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const resultElement = {
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    const item = createCartItemElement(resultElement);
    produto.appendChild(item);
    somaValor(response.price);
    salvaItens(); 
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addCartItemElement);

  return section;
}

const botaoApaga = document.querySelector('.empty-cart');

botaoApaga.addEventListener('click', function () {
  produto.innerHTML = '';
  localStorage.clear();
  valorTotal.innerText = '';
  total = 0;
});

const fetchItem = async () => {
  const container = document.querySelector('.container');
  const mensagem = document.createElement('span');
  mensagem.classList.add('loading');
  mensagem.textContent = 'loading...';
  container.appendChild(mensagem);
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const finaliza = await fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const result = response.results;
    result.forEach((element) => {
      const resultElement = {sku: element.id, name: element.title, image: element.thumbnail};
      const itemProduto = createProductItemElement(resultElement);
      const section = document.querySelector('.items');
      section.appendChild(itemProduto)}); 
  });
  mensagem.remove();
  return finaliza;
};

window.onload = function onload() {
  fetchItem();
  if (localStorage.cart) {
    produto.innerHTML = localStorage.cart;
    const li = document.querySelectorAll('li');
    li.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
};

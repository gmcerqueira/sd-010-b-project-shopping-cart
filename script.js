const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const ol = document.querySelector('.cart__items');
const salvos = ol.childNodes;
const itens = document.querySelector('.items');
// const preco = document.querySelector('.total-price');
const loading = document.querySelector('.loading');
const butonClear = document.querySelector('.empty-cart');

function clerCart() {
  ol.innerHTML = [];
  localStorage.clear();
}

butonClear.addEventListener('click', clerCart);

function loadingRmove() {
  loading.remove();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function funcFetch(urls) {
  return fetch(urls) 
  .then((fetchReturn) => fetchReturn.json())
  .catch((erro) => erro);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function salvar() {
  const itensASalvar = ol.innerHTML;
  localStorage.setItem('Salvo', itensASalvar); // por innerHTMH pois o localStorageso salva texto
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const selecionado = event.target.parentNode;
  selecionado.removeChild(event.target);
  salvar();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function adcionar(este) {
  const section = este.target.id;
  const itemSelecionado = await funcFetch(`https://api.mercadolibre.com/items/${section}`);
  ol.appendChild(createCartItemElement({
    sku: itemSelecionado.id,
    name: itemSelecionado.title,
    salePrice: itemSelecionado.price,
  }));
  salvar();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const button = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button.id = sku;
  button.addEventListener('click', adcionar); 
  section.appendChild(button);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function lista(http) {
  funcFetch(http)
  .then((coisa) => coisa.results.forEach((item) => {
    itens.appendChild(
      createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }),
      );
  }))
  .catch((erro) => erro);
  loadingRmove();
}

function colocaOsListeners() {
  for (let cont = 0; cont < salvos.length; cont += 1) {
    salvos[cont].addEventListener('click', cartItemClickListener);
  }
}

window.onload = function onload() {
  lista(url);
  ol.innerHTML = localStorage.getItem('Salvo');
  colocaOsListeners();
};
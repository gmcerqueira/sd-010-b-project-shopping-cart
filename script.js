window.onload = function onload() { };

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

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const newLi = document.createElement('li');
  newLi.className = 'cart__item';
  newLi.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  newLi.addEventListener('click', cartItemClickListener);
  return newLi;
}

async function fetchProducts() {
  const resposta = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const produtos = await resposta.json();
  const lista = await produtos.results;
  return lista;
}

async function produtcs() {
  const produto = await fetchProducts();
  const items = document.querySelector('.items');
  produto.forEach((product) => {
    const itemObject = { sku: product.id, name: product.title, image: product.thumbnail };
    items.appendChild(createProductItemElement(itemObject));
  });
}

async function fetchId(id) {
  const idItem = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const res = await idItem.json();
  return res;
}

async function botao(id) {
  const item = await fetchId(id);
  const carrinho = createCartItemElement(item);
  const newUl = document.querySelector('.cart__items');
  newUl.appendChild(carrinho);
}

async function adicionarCarrinho() {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((button) => {
    const produtoId = button.parentElement.children[0].innerText;
    button.addEventListener('click', () => {
      botao(produtoId);
    });
  });
}

window.onload = async function onload() {
  await produtcs();
  await adicionarCarrinho();
};
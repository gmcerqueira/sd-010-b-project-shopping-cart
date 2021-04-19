function loadData() {
  document.querySelector('ol').innerHTML = localStorage.getItem('data');
}

// Carrega o carrinho de compras através do LocalStorage ao iniciar a página

function saveLocalStorage() {
  localStorage.setItem('data', document.querySelector('ol').innerHTML);
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

async function totalPrice() {
  let sum = 0;
  const cartItems = document.querySelector('ol');
  cartItems.childNodes.forEach((child) => {
    const valueItem = child.innerText.split('$')[1];
    sum += Number(valueItem);
    return sum;
  });
  saveLocalStorage();
  document.querySelector('.total-price').innerHTML = `${sum}`;
}

// Remove o item do carrinho de compras ao clicar
function cartItemClickListener(event) {
  // coloque seu código aqui
  const targetItem = event.target;
  targetItem.parentNode.removeChild(targetItem);
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Adicione o produto ao carrinho de compras
async function onClick(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const results = await response.json();
  const addToCart = createCartItemElement(results);
  document.querySelector('.cart__items').appendChild(addToCart);
  addToCart.addEventListener('click', cartItemClickListener);
  totalPrice();
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const onClickButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(onClickButton);
  onClickButton.addEventListener('click', () => onClick(sku));
  return section;
}

// apaga todos os itens do local storage
function clearCart() {
  const removeItemId = document.querySelector('.empty-cart');
  removeItemId.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
  });
}

// ASYNC declara a função como assincrona! e assim podemos usar o AWAIT
// Esta função cria uma listagem de produtos($computador)
async function getComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const { results } = await response.json();
  results.forEach((product) => {
    const getComputers = createProductItemElement(product);
    document.querySelector('.items').appendChild(getComputers);
  });
  document.querySelector('.loading').remove();
}

window.onload = function onload() {
  console.log('Funcionando, corretamente.');
  getComputer();
  loadData();
  clearCart();
  totalPrice();
};

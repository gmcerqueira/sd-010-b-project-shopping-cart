const cart = '.cart__items'; // Atribuo a classe a uma constante assim posso reutilizar mais vezes quanto for pegar
// https://eslint.org/docs/rules/prefer-const (Jonnes Bezerra)
let total = 0;
let storageTotalPrice = localStorage.getItem('totalPrice');
const priceContainer = document.getElementsByClassName('total-price');

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
// ------------------------------------------------------------------------------------------------
// RECUPERA O ID REFERENTE AO SKU

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// ---------------------------------------------------------------------------------------------------------
// SALVA VALOR NO STORAGE
function addToLocalStorage(id, objeto) {
  localStorage.setItem(id, objeto);
}

//-----------------------------------------------------------------------------------------------------
// BOTÃO ADICIONAR ITENS AO CARRINHO DE COMPRAS

function cartItemClickListener(event) { 
  const cartItem = document.querySelector(cart); // recupero meu carrinho com os itens
  const cartItemClicked = event.target; // item que recebeu o click
  // https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232
  const itemClickedPrice = cartItemClicked.innerText.substring(
    cartItemClicked.innerText.indexOf('$') + 1,
    );  
  total -= itemClickedPrice;
  total = Math.round(total * 100) / 100;
  addToLocalStorage('totalPrice', total);
  priceContainer[0].innerHTML = total;
  console.log(priceContainer[0]);
  cartItemClicked.remove(); // item é removido
  addToLocalStorage('productsCart', cartItem.innerHTML); // Atualizo o storage sem o item;
  }
  // --------------------------------------------------------------------------------------------------
// VALOR TOTAL DO CARRINHO DE COMPRAS

function cartTotalPrice(value) {
  total += Math.round(value * 100) / 100;
  console.log(priceContainer[0].innerHTML = total);
  return total;
}

// ------------------------------------------------------------------------------------------------------
// CRIANDO ITEM CARRINHO DE COMPRAS

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ADICIONANDO PRODUTO AO CARRINHO DE COMPRAS

function addProductToCart(event) {  
  const cartAdd = document.querySelector(cart); // recupero o carrinho
  const itemsId = getSkuFromProductItem(event.target.parentNode); // pego o sku(id) do botao que recebeu o click
  const urlId = `https://api.mercadolibre.com/items/${itemsId}`; // passo a id para a url da api
  fetch(urlId)
  .then((response) => response.json()) // transforma o retorno em json
  .then(({ id, title, price }) => { // com o retorno crio o meu elem e o adiciono ao carrinho passando para as
    cartAdd.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));// chaves id, title e preço
      addToLocalStorage('productsCart', cartAdd.innerHTML); // salvo meu li criado no localstorage
      addToLocalStorage('totalPrice', cartTotalPrice(price));
      console.log(priceContainer[0]);
    }); 
  }
//-----------------------------------------------------------------------------------------------------------------
// CRIANDO LISTA DE PRODUTOS

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addProductToCart);
  return section;
}

// REQUISIÇÃO COM A API MERCADO LIVRE E CRIANDO LISTA
// loading feito no plantão com ideia do Henrique Zózimo.
async function creatProductList() {
  const container = document.querySelector('.container');
  const message = document.createElement('span');
  message.className = 'loading';
  message.innerText = 'loading...';
  container.appendChild(message);
  console.log(message);
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((data) => {
      const dataResults = data.results;
      const listItems = document.querySelector('.items'); // recupera a seção onde será criada a lista de produtos
      dataResults.forEach(({ id, title, thumbnail }) => // Henrique Clementino 
      listItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
    })
    .then(() => message.remove())
    .catch(() => alert('Não foi possível se conectar com a API '));
    console.log(container);
}

//-------------------------------------------------------------------------------------------------
// RECUPERANDO O CARRINHO SALVO NO STORAGE

function getStorageCart() {  
  const cartRecovered = document.querySelector(cart);
  const storageCart = localStorage.getItem('productsCart');
  total = parseFloat(storageTotalPrice);
  priceContainer[0].innerHTML = storageTotalPrice;
  console.log(storageTotalPrice);
  if (storageCart) { // se tevier storage
    cartRecovered.innerHTML = storageCart; // passo o inner html para o meu carrinho
    const listItems = document.querySelectorAll('li'); // pego os lis recuperados do storage
    listItems.forEach((li) => li.addEventListener('click', cartItemClickListener)); // adiciono para cada um o listener do click
  }
}

//-----------------------------------------------------------------------------------------------------
// BOTAO ESVAZIAR CARRINHO DE COMPRAS

function emptyCart() {
  const carrinhoAtual = document.querySelectorAll('.cart__item'); // node list
  if (carrinhoAtual.length === 0) {
    alert('Carrinho Vazio');
  } else {
    carrinhoAtual.forEach((item) => item.remove());
    addToLocalStorage('productsCart', carrinhoAtual.innerHTML = '');
    storageTotalPrice = 0;
    priceContainer[0].innerHTML = storageTotalPrice;
    total = storageTotalPrice;
    addToLocalStorage('totalPrice', storageTotalPrice);
  }
}
//---------------------------------------------------------------------------------------
// ADICIONANDO O EVENDO AO BOTAO ESVAZIAR CARRINHO

function addClickEventToEmptyCartButton() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
}

window.onload = function onload() {
creatProductList();
getStorageCart();
addClickEventToEmptyCartButton();
};

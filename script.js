const cart = '.cart__items'; // Atribuo a classe a uma constante assim posso reutilizar mais vezes quanto for pegar
// https://eslint.org/docs/rules/prefer-const (Jonnes Bezerra)
let total = 0; // valor inicial do carrinho
localStorage.setItem('totalPrice', total); // adiciono a chave e o valor inicial ao localStorage

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

const priceContainer = document.getElementsByClassName('total-price');

function cartItemClickListener(event) { 
  const cartItem = document.querySelector(cart); // recupero meu carrinho com os itens
  const cartItemClicked = event.target; // item que recebeu o click
  // https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232
  const itemClickedPrice = cartItemClicked.innerText.substring(
    cartItemClicked.innerText.indexOf('$') + 1, // pego o valor depois do $ no texto
    );  
    cartItemClicked.remove(); // item é removido
  total -= itemClickedPrice; // subtrai o valor do total
  total = Math.round(total * 100) / 100; // arredonda o total
  priceContainer[0].innerHTML = total; // adiciono o valor atual a tag html
  addToLocalStorage('productsCart', cartItem.innerHTML); // Atualizo o storage sem o item;
  addToLocalStorage('totalPrice', total); // salvo no storage
  }
  // --------------------------------------------------------------------------------------------------
// VALOR TOTAL DO CARRINHO DE COMPRAS

function cartTotalPrice(value) { // pego o valor passado pelo parametro ao adicionar item no carrinho
  total += value; // soma no total
  priceContainer[0].innerHTML = total; // passo o valor para o html
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
      addToLocalStorage('totalPrice', cartTotalPrice(price)); // salvo o valor passado pra função soma no storage
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
  const container = document.querySelector('.container'); // recupero o container que vou add o loading
  const message = document.createElement('span'); // crio um span
  message.className = 'loading'; // nome da classe e o texto
  message.innerText = 'loading...';
  container.appendChild(message); // adiciono ao container
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador') // espero a requisiçao com a API
    .then((response) => response.json()) // resposta para json
    .then((data) => {
      const dataResults = data.results; 
      const listItems = document.querySelector('.items'); // recupera a seção onde será criada a lista de produtos
      dataResults.forEach(({ id, title, thumbnail }) => // pego o id, title e imagem do obj recuperado
      listItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }))); // add ao carrinho
    })
    .then(() => message.remove()) // removo a classe de loading
    .catch(() => alert('Não foi possível se conectar com a API '));
    // console.log(container);
}

//-------------------------------------------------------------------------------------------------
// RECUPERANDO O CARRINHO SALVO NO STORAGE
let storageTotalPrice = localStorage.getItem('totalPrice'); // recupero o preço total do storage

function getStorageCart() {  
  const cartRecovered = document.querySelector(cart); // recupero meu carrinho
  const storageCart = localStorage.getItem('productsCart'); // pego os itens salvos no carrinho
  total = parseFloat(storageTotalPrice); // transformo em numero
  priceContainer[0].innerHTML = storageTotalPrice; // adiciono o valor ao html
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
  if (carrinhoAtual.length === 0) { // vejo se tem algo no carrinho
    alert('Carrinho Vazio');
  } else {
    carrinhoAtual.forEach((item) => item.remove()); // removo cada item
    addToLocalStorage('productsCart', carrinhoAtual.innerHTML = ''); // zero o localStorage
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

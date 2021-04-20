// ajuda não consegui criar arcabouços para fazer do metodo convencional
// então usei jQuery após descobri-lo na internet
// mas lint me proibe de usa-lo sem importar o cypress nao roda quando importo.
// depois de clicar minha constante não recebe o item
const sendLocalStorageCart = [];
// O fim está chegando 
function sum() {
  const total = sendLocalStorageCart.reduce((acc, product) => {
  const { salePrice } = product;
  return acc + salePrice;
  }, 0);
  console.log(Math.round(total * 100) / 100);
  const localTotal = document.querySelector('.total-price');
  localTotal.innerText = (Math.round(total * 100) / 100);
}
async function cartItemClickListener(event) {
  // recupero o index do elemento clicado
  // https://stackoverflow.com/questions/13658021/jquery-index-in-vanilla-javascript
  const index = (Array.from(event.target.parentElement.children).indexOf(event.target));
  sendLocalStorageCart.splice(index, 1);
  event.target.remove();
  await sum();
  // precisa empurrar novamente o array para o localStorage
  localStorage.setItem('cartItems', JSON.stringify(sendLocalStorageCart));
  }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const prepareToAdd = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const archive = await response.json();
  return archive;
};

async function buttonClickAddCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const itemApiReturn = await prepareToAdd(itemId);
  const { id, title, price } = itemApiReturn;
  const itemCart = {
    sku: id,
    name: title,
    salePrice: price,
  };
  sendLocalStorageCart.push(itemCart);
  document.querySelector('.cart__items').appendChild(createCartItemElement(itemCart));
  localStorage.setItem('cartItems', JSON.stringify(sendLocalStorageCart));
  await sum();
  }

 function recoveryLocal() {
  const localStorageRecovery = localStorage.getItem('cartItems');
  const itensSaved = JSON.parse(localStorageRecovery);
  // preciso empurrar o itensSaved novamente pra dentro do array quando eu der o recovery
  // porque quando carrego ele fica vazio e empurra um array vazio para  chave cartItems
  const cartItems = document.getElementsByClassName('cart__items')[0];
  itensSaved.forEach((item) => {
  const itemAddLocalStorage = createCartItemElement(item);
  cartItems.appendChild(itemAddLocalStorage);
  // sendLocalStorageCart precisa receber os itens salvos, sele não receber após f5 
  // ele vai virar []
  sendLocalStorageCart.push(itensSaved);
  });
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', buttonClickAddCart);

  return section;
}

async function getComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computer');
  const computers = await response.json();
  const { results } = computers;
  // ate aqui está tudo certo estou recebendo um objeto 
  results.forEach((computer) => {    
    const newComputerObject = {
      sku: computer.id, 
      name: computer.title,
      image: computer.thumbnail,
    };
    // onde desejo adicionar os computadores que serão filhos da section
    document.querySelector('.items').appendChild(createProductItemElement(newComputerObject));
  });
}

window.onload = async function onload() { 
const buttonClearAll = document.querySelector('.empty-cart');
buttonClearAll.addEventListener('click', async () => {
document.querySelector('.cart__items').innerHTML = '';
sendLocalStorageCart.splice(0, sendLocalStorageCart.length);
localStorage.setItem('cartItems', JSON.stringify(sendLocalStorageCart));
await sum();
});
  sum();
  // acima tenho os computadore que busca achou!
  await getComputer();
  recoveryLocal();
  };
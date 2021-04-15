let items; // Esta variável guarda os itens exibidos na tela;
let orderedList; // Esta variável guarda a OL;
let buttonClearAll;
let totalPrice = 0;

async function amountValue() {
  let priceItem = 0;
  const itemCarrinho = document.querySelectorAll('.cart__item');
  itemCarrinho.forEach((item) => {
    const value = parseFloat(item.innerText.split('$')[1]);
    priceItem += value;
  });
  totalPrice.innerText = priceItem;
}

const removeAllItemsLocalHistorage = () => {
  const itemCarrinho = document.querySelectorAll('.cart__item');
  if (itemCarrinho) {
    itemCarrinho.forEach((item) => {
    orderedList.removeChild(item);
  });
  localStorage.removeItem('projectCart');
  totalPrice.innerHTML = 0;
  }
};

function recoveredItensLocalStorage() {
  const itemLocalHistorage = localStorage.getItem('projectCart');
  if (itemLocalHistorage) {
    orderedList.innerHTML = itemLocalHistorage;
    amountValue();
  }
}

function addLocalHistorage() {
  const listItems = document.querySelector('.cart__items');
  localStorage.setItem('projectCart', listItems.innerHTML);  
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

 function cartItemClickListener(event) {
   const itemCart = event.target;
   orderedList.removeChild(itemCart);
   amountValue();
 }

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

 function createCartItemElement({ sku, name, salePrice }) {
   const li = document.createElement('li');
   li.className = 'cart__item';
   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
   li.addEventListener('click', cartItemClickListener);
   return li;
 }

const addProductToCart = (args) => {    
  fetch(`https://api.mercadolibre.com/items/${args}`)
  .then(
    (response) => {
      response.json()
  .then((result) => {
    const resultado = result;
    const newItem = createCartItemElement({
      sku: resultado.id,
      name: resultado.title,
      salePrice: resultado.price,
    });
    orderedList.appendChild(newItem);
    addLocalHistorage();
    amountValue();
  });
    },
  );
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clickAddEvent = () => {
  // Busca com base na classe .item todos os itens
  items.addEventListener('click', function (props) {
    // parentNode retorna o pai do elemento clicado, no caso o pai do botão adicionar
    const sku = getSkuFromProductItem(props.target.parentNode);
    addProductToCart(sku);
  });
  buttonClearAll.addEventListener('click', function () {
    // Botão de limpar a lista de carrinho
    removeAllItemsLocalHistorage();
  });
};

const createLoading = () => {
  const containnerResult = document.querySelector('.container');
  const elementHeader = document.createElement('div');
  elementHeader.className = 'loading';
  containnerResult.appendChild(elementHeader);
  console.log('Criado');
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  const containnerResult = document.querySelector('.container');
  containnerResult.removeChild(loading);
  console.log('Removido');
};

// Função para retornar o produto com base no parâmetro
const recoverProduct = async (product) => {  
  items = document.querySelector('.items');
  orderedList = document.querySelector('.cart__items');
  buttonClearAll = document.querySelector('.empty-cart');
  totalPrice = document.querySelector('.total-price');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then(
    (response) => {
      response.json().then((result) => {
        const resultado = result.results;
        resultado.forEach((element) => {
          items.appendChild(createProductItemElement(element));
        });     
          // Após criar os elementos na tela, aciona a função que cria o evento de clique
          clickAddEvent();
      });
      removeLoading();
    },
  );
};

window.onload = function onload() {  
  createLoading();
  recoverProduct('computador');
  recoveredItensLocalStorage();
};

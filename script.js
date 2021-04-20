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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/*
  Requisito os itens para a API e a partir deles crio cada elemento na página. Enquanto os itens são carregados existe um elemento com a mensagem 'Loading...' na tela. Após a API responder, o texto deixa de existir.
*/

const getItems = async () => {
  const loading = document.createElement('p');
  loading.className = 'loading';
  document.body.appendChild(loading);
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await request.json();
  document.querySelector('.loading').remove();
  const computers = response.results;
  computers.forEach((computer) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(computer));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemsString = 'cart-items';
let itemsOnCart;

/*
  Determino que, caso existam itens a serem resgatados pelo Local Storage, então a lista de itens deve conter todos eles. Caso contrário, determino que a lista deve iniciar vazia.
*/

if (localStorage.getItem(cartItemsString)) {
  itemsOnCart = JSON.parse(localStorage.getItem(cartItemsString));
} else {
  itemsOnCart = [];
}

/*
  Determino que casa exista pelo menos um item na lista, o valor é dado pela soma de todos os preços presentes na lista (corrigido pelo Math.round()). Caso contrário é 0.
*/

const calcPrice = () => {
  if (itemsOnCart.length > 0) {
    const totalPrice = itemsOnCart.reduce((total, item) => {
      const result = (Math.round((total + item.price) * 100) / 100);
      return result;
    }, 0);
    return totalPrice;
  }
  return 0;
};

const priceOnScreen = document.querySelector('.total-price');

function cartItemClickListener(event) {
  // Removo o item da página. 
  event.target.remove();

  // Busco o item no carrinho que possui o ID igual ao SKU (que aparece dentro do texto) do item clicado e o removo.
  const id = event.target.innerHTML.split(' ')[1];
  itemsOnCart.forEach((item) => {
    if (item.id === id) {
      itemsOnCart.splice(itemsOnCart.indexOf(item), 1);
    }
  });

  // Atualizo o preço.
  priceOnScreen.innerHTML = calcPrice();

  // Atualizo quais os valores que devem estar no Local Storage.
  localStorage.removeItem(cartItemsString);
  localStorage.setItem(cartItemsString, JSON.stringify(itemsOnCart));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const ol = document.querySelector('.cart__items');

/*
  Requisito os dados do item para a API para criar o elemento do item no carrinho.
*/

const requestItem = async (sku) => {
  const request = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const response = await request.json();
  return response;
};

const addToCart = async (event) => {
  // Determino que se o item clicado for um botão de adicionar ao carrinho,
  if (event.target.className === 'item__add') {
    // a partir do ID do item,
    const sku = getSkuFromProductItem(event.target.parentNode);
    // requisito o item clicado para a API.
    const item = await requestItem(sku);
    // A partir do retorno da API crio um objeto com os dados do item dentro da array que armazena os itens no carrinho e crio o elemento HTML que aparecerá na tela do usuário com as informações do produto.
    itemsOnCart.push({ id: item.id, title: item.title, price: item.price });
    const cartItem = createCartItemElement(item);
    ol.appendChild(cartItem);
    // Crio uma chave no Local Storage que armazena todos os valores da array de itens no carrinho.
    localStorage.setItem(cartItemsString, JSON.stringify(itemsOnCart));
    // Atualizo o preço para o valor dos itens na array.
    priceOnScreen.innerHTML = calcPrice();
  }
};

/*
  Crio a função que remove todos os itens do carrinho na tela, no Local Storage e na array, então atualizo o preço na tela.
*/

const removeAllItems = async () => {
  ol.innerHTML = '';
  localStorage.removeItem(cartItemsString);
  itemsOnCart = [];
  priceOnScreen.innerHTML = calcPrice();
};

window.onload = function onload() {
  // Chamo a função que cria os itens na tela e adiciono o evento ao botão de adicionar ao carrinho, criado pela função.
  getItems();
  document.querySelector('.items').addEventListener('click', addToCart);
  // Determino que se existir uma chave no Local Storage armazenando os itens no carrinho, devo criar os itens na tela. 
  if (localStorage.getItem(cartItemsString)) {
    const cartItemsWebStorage = JSON.parse(localStorage.getItem(cartItemsString));
    cartItemsWebStorage.forEach((cartItem) => {
      const item = createCartItemElement(cartItem);
      ol.appendChild(item);
    });
  }
  // Determino que ao clicar no botão de apagar todos os itens o valor na tela deve ser atualizado.
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', removeAllItems);
  priceOnScreen.innerHTML = calcPrice();
};
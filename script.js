const endpointComputer = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const endpointComputerItem = 'https://api.mercadolibre.com/items/';

// Faz requisição para API buscando todos os computadores;
const requestAPIComputer = async (produto) => {
  const response = await fetch(`${endpointComputer}${produto}`);
  const data = await response.json();
  
  return data.results;
};

// Faz requisição para API buscando item computador;
const requestAPIItem = async (item) => {
  const response = await fetch(`${endpointComputerItem}${item}`);
  const data = await response.json();
  
  return data;
};

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.dataset.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

// Adiciona item no carrinho ao clicar no botão 'Adicinar no carrinho';
const addCard = async (event) => {
  const id = event.target.parentNode;
  const dataItem = await requestAPIItem(id.dataset.id);
  const getOl = document.querySelector('.cart__items');
  getOl.appendChild(createCartItemElement(dataItem));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.dataset.id = sku;
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addCard);
  section.appendChild(button);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Imprime lista de itens com cards;
const createListItems = (data, section) => {
  data.forEach(async (product) => {
    const card = await createProductItemElement(product);
    section.appendChild(card);
  });
};

// Função principal
window.onload = async function onload() {
  const data = await requestAPIComputer('computador');
  // console.log('data ', data);
  const sectionItems = document.querySelector('.items');
  await createListItems(data, sectionItems);
 };

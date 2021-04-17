let savingS;
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

const localSave = () => {
  const toBesaved = savingS.innerHTML;
  localStorage.setItem('keyy', toBesaved);
};
// Diegho e Denis me ajudaram no desenvolvimento deste quesito;

const refreshPage = () => {
 const searchLocal = localStorage.getItem('keyy');
 savingS.innerHTML = searchLocal;
};
// Diegho e Denis me ajudaram no desenvolvimento deste quesito;

const cartItemClickListener = (event) => {
  const clickedItem = event.target;
  clickedItem.remove();
  localSave();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localSave();
  return li;
}

async function createLoadMessage() {
  const load = document.querySelector('.items');
  const li = document.createElement('li');
  li.className = 'loading';
  li.innerText = 'loading';
  load.appendChild(li);
  return li;
}

function takeLoadMessageDown() {
  const load = document.querySelector('.items');
  const loadingMessage = document.querySelector('.loading');
  loadingMessage.className = '';
  loadingMessage.innerText = '';
  load.removeChild(loadingMessage);
  return loadingMessage;
}

// const totalPrice = () => {
//   const individualChartFilled = document.querySelector('.cart__item');
// };

const removeElement = () => {
  savingS.innerHTML = '';
  localSave();
};
// Lucas me ajudou a entender que eu poderia aproveitar a função adicionada com clique na linha 26.'

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button.addEventListener('click', async () => {
    const add = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const buy = await add.json();
    const createdItem = createCartItemElement(buy);
    const saving = document.querySelector('.cart__items');
    saving.appendChild(createdItem);
    const bttnClick = document.querySelector('.empty-cart');
bttnClick.addEventListener('click', removeElement);
localSave();
  });
  return section;
}
// Alan me ajudou nesta questão e também o Wolf no plantão;

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

 async function shopping() {
 const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer');
 const comp = await response.json();
 const resul = await comp.results;
 return resul;
}

async function renderComputers() {
  const shopp = await shopping();
  const first = document.querySelector('.items');
shopp.forEach((shop) => {
    first.appendChild(createProductItemElement(shop));
  });
 }
// O colega Denis me ajudou no primeiro quesito. 
const loadPage = () => {
  setTimeout(() => {
    createLoadMessage();
    renderComputers();
  });
};

const loadedPage = () => {
  setTimeout(() => {
    takeLoadMessageDown();
  }, Math.random() * 3000);
};

window.onload = async function onload() {
  savingS = document.querySelector('.cart__items');
  loadPage();
  refreshPage();
  loadedPage();
};
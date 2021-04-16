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

const cartItemClickListener = (event) => {
    const clickedItem = event.target;
    clickedItem.remove();
    };
// Lucas me ajudou a entender que eu poderia aproveitar a função adicionada com clique na linha 26.

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const removeElement = () => {
const chartFilled = document.querySelector('.cart__items');
chartFilled.innerHTML = '';
};

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
    const addProduct = document.querySelector('.cart__items');
    addProduct.appendChild(createdItem);
    const bttnClick = document.querySelector('.empty-cart');
bttnClick.addEventListener('click', removeElement);
  });
  return section;
}
// Alan me ajudou nesta questão;

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
    // first.addEventListener('click', )
  });
 }

window.onload = async function onload() { 
  renderComputers();
};
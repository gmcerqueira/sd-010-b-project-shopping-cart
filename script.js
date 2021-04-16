let cartItemsList = [];

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

const listOfProducts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();  
  return results;
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchCarItems = async (itemID) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const response = await product.json();
  return response;
};

function cartItemClickListener(event) {
  const getTargetId = event.target.id;
  const response = fetchCarItems(getTargetId);
  const getOL = document.getElementsByClassName('cart__items')[0];
  getOL.removeChild(event.target);
  cartItemsList.forEach((item, index) => {
    if (item.id === getTargetId) cartItemsList.splice(index);
    localStorage.setItem('carShop', JSON.stringify(cartItemsList));
  });
  return response;
 }

 // Fonte para eliminar um item de uma array: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createCartItems = () => {
  const carOL = document.getElementsByClassName('cart__items')[0];
  carOL.innerHTML = '';
  cartItemsList.forEach((itm) => {
    const creatLi = createCartItemElement({ sku: itm.id, name: itm.title, salePrice: itm.price });
    carOL.appendChild(creatLi);
  });
};

const renderItems = (getResults) => {
  let pc;
  const selectSection = document.getElementsByClassName('items')[0];
  getResults.forEach((el) => {
   pc = createProductItemElement({ sku: el.id, name: el.title, image: el.thumbnail });
    selectSection.appendChild(pc);
    pc.addEventListener('click', () => {
      const carProduct = cartItemsList.find((item) => item.id === el.id);
      if (!carProduct) cartItemsList.push(el);
      localStorage.setItem('carShop', JSON.stringify(cartItemsList));
      createCartItems(); 
    });
   });
  };

  const sumItemsPrices = async () => {
    const itemsSum = cartItemsList.reduce((acc, curr) => acc + curr.price, 0);
    const createh2 = document.createElement('h2');
    const selectDiv = document.getElementsByClassName('total-price')[0];
    createh2.innerHTML = '';
    createh2.innerHTML = await itemsSum;
    createh2.id = 'totalPrice';
    createh2.classList.add('total-price');
    selectDiv.appendChild(createh2);
  };

  // Tive ajuda do instrutor Eduardo para finalizar o requisito 1.

window.onload = async function onload() { 
  console.log('Ok!!! Ready');
  const getResult = await listOfProducts();
  renderItems(getResult);
  createCartItemElement(getResult);
  const itemsStorageString = localStorage.getItem('carShop');
  cartItemsList = itemsStorageString ? JSON.parse(itemsStorageString) : [];
  createCartItems();
  sumItemsPrices();
  };
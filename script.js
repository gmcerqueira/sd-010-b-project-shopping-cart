// Trabalho executado com colaboração de Fellipe Correa, Lotar Lucas, João Herculano e do instrutor Gabriel Almeida. //

const arrStorage = [];

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
  const item = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return item.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const idRemove = event.target;
  idRemove.remove();
  arrStorage.splice(arrStorage.indexOf(idRemove), 1);
  localStorage.setItem('item', JSON.stringify(arrStorage));/* retirar de dentro do array o elemento do carrinho */
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const callFetch = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const objResponse = await response.json();
  const arrayReturn = objResponse.results;
  return arrayReturn;
};

// function addStorage() => {
  //   //toda vez que pegar o produto, dar push no array  
  // }
  // localStorage.setItem('cart', value) /* puxa como string no local storage */
  
  const renderProductList = async (product) => {
    const items = document.querySelector('.items');
    product.forEach((element) => {
      const object = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail, 
      };
      const joinProducts = createProductItemElement(object);
      items.appendChild(joinProducts);
      // console.log(joinProducts);
    });
  };
  
  const changeToObject = (data) => ({ sku: data.id, name: data.title, salePrice: data.price });
  
  const joinItemsCart = (item) => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const olCartItem = document.querySelector('.cart__items');
    olCartItem.appendChild(item);
  };
  
  function removeAllItems() {
    const catchButton = document.querySelector('.empty-cart');
    const createOl = document.querySelector('.cart__items');
    catchButton.addEventListener('click', () => {
      createOl.innerHTML = ' ';
      localStorage.removeItem('item');
    });
  }

    function buttonEvent() {
    const productButton = document.querySelectorAll('.item__add');
    productButton.forEach((addProduct) => {
      addProduct.addEventListener('click', async (event) => {
        const idProduct = getSkuFromProductItem(event.target.parentNode);
        const fetchCall = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
        const response = await fetchCall.json();
        const changeObject = changeToObject(response);
        // console.log(changeObject);
        const liCreate = createCartItemElement(changeObject);
        arrStorage.push(changeObject);
        // console.log(arrStorage);
        localStorage.setItem('item', JSON.stringify(arrStorage));
      joinItemsCart(liCreate);
    });
  });
}

// antes do renderProduct
const expectLoadingAPI = () => {
  const newSpan = document.createElement('span');
  const sectionCart = document.querySelector('.items');
  newSpan.className = 'loading';
  newSpan.innerText = 'loading...';
  sectionCart.appendChild(newSpan);
};

// depois do renderProduct
const afterLoadingAPI = () => {
  document.querySelector('.loading').remove();
};

const funct = async () => {
  const delStorage = localStorage.getItem('item');
  console.log(delStorage);
  const newObject = await JSON.parse(delStorage);/* string dentro do array novamente */
  console.log(newObject);
  return newObject.forEach((element) => {
    console.log(element);
    const createCart = createCartItemElement(element);
    joinItemsCart(createCart);
  });
};

window.onload = async function onload() {
  expectLoadingAPI();
  const products = await callFetch();  
  afterLoadingAPI();
  renderProductList(products);  
  // saveShopCart();
  buttonEvent();
  removeAllItems();
  await funct();
};

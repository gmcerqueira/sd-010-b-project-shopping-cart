const carItens = [];
let totalPrice = 0;

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

// Primeiro Passo

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) { 
  const liId = event.target.id;
  localStorage.removeItem(liId);
  event.target.remove();  
}

async function somarPrice(carItem) {
  await carItem.forEach((price) => {
   totalPrice += price.salePrice;
   });
   return totalPrice; 
}

/* const removePrice = (carItem) => {
  carItem.forEach((price) => {
    totalPrice -= price.salePrice;
    });
    return totalPrice; 
}; */

// Requisito 4 - Local Storage // Falta imprimir na tela quando for atualizada
const salvaLocalStorage = (idProduto, objetoVal) => {
  localStorage.setItem(`${idProduto}`, JSON.stringify(objetoVal));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${localStorage.length}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.appendChild(li);
  const getTotalPrice = document.querySelector('.total-price');
  getTotalPrice.innerText = `Total: ${somarPrice(carItens)}`;
  salvaLocalStorage(li.id, { sku, name, salePrice });
} 

async function getElements(QUERY) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const { results } = await response.json();  

  return results; 
}

const appendProducts = (element) => document.getElementsByClassName('items')[0]
.appendChild(element); 

const renderProduct = (prodctJson) => {
  prodctJson.forEach((product) => {
    const objResult = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    appendProducts(createProductItemElement(objResult));
  });
};

async function fechFavoriteProduct(addIdProduct) {
  const response = await fetch(`https://api.mercadolibre.com/items/${addIdProduct}`);
  const responseResult = await response.json(); 
  const objt = {
    sku: responseResult.id,
    name: responseResult.title, 
    salePrice: responseResult.price,
  };
  createCartItemElement(objt);
  return responseResult; 
} 

const addProduct = () => {
  const button = document.querySelectorAll('.item__add'); 
  button.forEach((elementButt) => {
    elementButt.addEventListener('click', (event) => {
     const item = event.target.parentNode.firstChild.innerHTML;
     fechFavoriteProduct(item);
    });
  });
  return button;
};

const allProductsChamada = async () => {
 renderProduct(await getElements('computador'));
};

const recarregarLocalStorage = () => {
  if (localStorage.length) {
    for (let index = 0; index < localStorage.length; index += 1) {
      const itemobj = JSON.parse(localStorage[index]);
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `SKU: ${itemobj.sku} | NAME: ${itemobj.name} | PRICE: $${itemobj.salePrice}`;
      li.id = `${index}`;
      li.addEventListener('click', cartItemClickListener);
      const ol = document.getElementsByClassName('cart__items')[0];
      ol.appendChild(li);
      const getTotalPrice = document.querySelector('.total-price');
      getTotalPrice.innerText = `Total: ${somarPrice(carItens)}`;
    }
  }
};

window.onload = function onload() { 
  recarregarLocalStorage();
  allProductsChamada()
  .then(() => {
    addProduct();
  });
  /* const carItem = localStorage.getItem('produto'); 
  const ItemLocalStorage = JSON.parse(carItem) || [];
  if (ItemLocalStorage.length > 0) {
    ItemLocalStorage.forEach((posicao) => createCartItemElement(posicao));
  } */
};  

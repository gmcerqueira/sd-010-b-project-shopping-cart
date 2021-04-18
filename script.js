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
function somarPrice(price) {
  const arrayPrices = [];
  let totalPrice = 0;
  for (let index = 0; index < localStorage.length; index += 1) {
   const key = localStorage.key(index);
   console.log(key);
   const dataObjt = JSON.parse(localStorage[key]); 
   console.log(dataObjt);
   arrayPrices.push(dataObjt.salePrice);   
  }
  if (price) {
    arrayPrices.push(price);
    totalPrice = parseFloat(arrayPrices.reduce((acc, curr) => acc + curr, 0));
    document.querySelector('.total-price').innerText = totalPrice;
  }
  totalPrice = arrayPrices.reduce((acc, curr) => acc + curr, 0);
  document.querySelector('.total-price').innerText = totalPrice;
}

function cartItemClickListener(event) { 
  const liId = event.target.id;
  localStorage.removeItem(liId);
  somarPrice();
  event.target.remove();  
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
  li.id = `${Date.now()}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.appendChild(li);
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
  somarPrice(objt.salePrice);
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
    const objkeys = Object.keys(localStorage).sort((a, b) => a - b);
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = objkeys[index]; 
      const itemobj = JSON.parse(localStorage[key]);
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `SKU: ${itemobj.sku} | NAME: ${itemobj.name} | PRICE: $${itemobj.salePrice}`;
      li.id = `${key}`;
      li.addEventListener('click', cartItemClickListener);
      const ol = document.getElementsByClassName('cart__items')[0];
      ol.appendChild(li);
      // const getTotalPrice = document.querySelector('.total-price');
      // getTotalPrice.innerText = `Total: ${somarPrice(itemobj.salePrice)}`;
    }
  }
};

const clearCart = () => {
  const buttunClear = document.querySelector('.empty-cart'); 
  buttunClear.addEventListener('click', () => {
    const olElements = document.querySelector('.cart__items'); 
    const price = document.getElementById('total_price');
    olElements.innerText = ''; 
    price.innerText = '';
    localStorage.clear();
  });
};

window.onload = function onload() { 
  recarregarLocalStorage();
  allProductsChamada()
  .then(() => {
    addProduct();
  });
  clearCart();
  somarPrice(); 
};  

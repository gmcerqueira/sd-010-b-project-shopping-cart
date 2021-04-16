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

function cartItemClickListener() { 
  
}

 function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.appendChild(li);
} 
// Primeira modificação

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

window.onload = function onload() { 
  allProductsChamada()
  .then(() => {
    addProduct();
  });
};  

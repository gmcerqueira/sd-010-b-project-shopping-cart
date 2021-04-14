// window.onload = function onload() {};

// const fetch = require('node-fetch');


function getData(url) {
  return fetch(url)
    .then((r) => r.json())
    .then((r) => (r.results))
    .catch((error => error))
}
const productsTitle = [];
const productsId = [];
const productsThumbnail = [];


async function getProducts() {
  return await getData('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r)
    .catch(error => error);
}


async function renderProducts() {
  const allProducts = await getProducts();
  allProducts.forEach((el) => {
    const newDiv = document.createElement('div')
    newDiv.className ='item';
    document.querySelector('.items').appendChild(newDiv);
    const newItem = createProductImageElement(el.thumbnail);
    
    document.querySelector('.items').lastChild.appendChild(newItem)
        
  })

}

renderProducts();

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}



// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function createProductItemElement({ sku, name, image }) {
//   const section = document.createElement('section');
//   section.className = 'item';

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

//   return section;
// }

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
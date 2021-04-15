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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  return event;
}

// Recebe um obj com 3 keys especificas e cria um elemento no carrinho:
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Com o ID vindo de 'getSkuFromProductItem' cria o produto especifico no carrinho de compras com a função 'createCartItemElement':
const getProduct = (itemID) => fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((productToCart) => {
      const inCart = {
        sku: productToCart.id,
        name: productToCart.title,
        salePrice: productToCart.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(inCart));
     });

// Através de infos especificas cria elementos filhos de 'section', com auxilio de outras funções previamente criadas;
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', (event) => {
    const item = event.target;
    getProduct(getSkuFromProductItem(item.parentNode));
  });

  return section;
}

// Através da requisição da API captura uma lista de obj e, pegando infos especificas deles cria a lista de produtos com a função: 'createProductItemElement';
function productInfo(product) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => response.json())
  .then((computers) => {
    computers.results.forEach((element) => {
      const pc = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(pc));
    });
  });
}
        
window.onload = function onload() { 
  productInfo('computador');
};
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  return event;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart() {
  const item = document.querySelector('.item__add');
  item.addEventListener('click', () => {
    const getProduct = (itemID) => {
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then((response) => response.json())
        .then((productToCart) => {
          const inCart = {
            sku: productToCart.id,
            name: productToCart.title,
            salePrice: productToCart.price,
          };
          document.querySelector('.cart').appendChild(createCartItemElement(inCart));
        });
    };
    getProduct(getSkuFromProductItem(item));
  });
}

function computerInfo(product) {
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
      addToCart();
    });
  });
}
        
window.onload = function onload() { 
  computerInfo('computador');
};
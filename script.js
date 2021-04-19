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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const loadAvailableProducts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productsJSON = await response.json();
  const itens = productsJSON.results;
  const itensProntos = itens.forEach((produto) => {
    const produtos = document.getElementsByClassName('items')[0];
    produtos.appendChild(createProductItemElement(produto));
  });
  return itensProntos;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const itemsOnCarList = [];

const putItemOnCartList = async (item) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(item)}`);
  const itemProduto = await response.json();
  const cartItens = document.getElementsByClassName('cart__items')[0];
  cartItens.innerHTML = '';
  itemsOnCarList.push(itemProduto);

  localStorage.setItem('produtos', JSON.stringify(itemsOnCarList));
  itemsOnCarList.forEach((produto) => {
    cartItens.appendChild(createCartItemElement(produto));
  });
  };

const loadCartItems = () => {
  const itemProduto = document.getElementsByClassName('items')[0];
  itemProduto.addEventListener('click', (itemClicado) => {
    if (itemClicado.target.className.includes('item__add')) {
      putItemOnCartList(itemClicado.target.parentNode);
    }
});
};

const clearCart = () => {
  const cartItens = document.getElementsByClassName('cart__items')[0];
  cartItens.innerHTML = '';
};

window.onload = function onload() { 
  loadAvailableProducts();
  loadCartItems();
  if (localStorage.getItem('produtos')) {
    const itemsOnCarListString = localStorage.getItem('produtos');
  const x = JSON.parse(itemsOnCarListString);
  x.forEach((produto) => {
    const cartItens = document.getElementsByClassName('cart__items')[0];
    cartItens.appendChild(createCartItemElement(produto));
  });
  }
  const buttonClearCart = document.getElementsByClassName('empty-cart')[0];
  console.log(buttonClearCart);
  buttonClearCart.addEventListener('click', clearCart);
};
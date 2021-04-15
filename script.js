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

// tive ajuda Carlos Margato - Turma 10 - Tribo B
function consultProducts(products) {
  const classItems = document.getElementsByClassName('items')[0];
  products.forEach((product) => classItems.appendChild(createProductItemElement(product)));
}

// tive ajuda Carlos Margato - Turma 10 - Tribo B
async function fethProdutos() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await response.json();
  const products = responseJson.results;
  return consultProducts(products);
}

fethProdutos();

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

  function cartItemClickListener(event) {
  }

  // classItem.forEach(() =>
  // classItem.addEventListener('click', () => console.log('item adicionado')));
  
  function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }
  
  function addProductsInFavorite(products) {
    const classCartItems = document.getElementsByClassName('cart__items');
    console.log(classCartItems);
    classCartItems.appendChild(createCartItemElement(products));
  }
  
  // testando addEventListener
  document.querySelectorAll('.item')
  .forEach((teste) => document.getElementsByClassName('item__add')
  .addEventListener('click', () => console.log(teste)));
  
  // tive ajuda do Lucas Matins
  window.onload = async function onload() {
    await fethProdutos();
  };
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
// -------------------------------------------
function log(...menssage) {
  console.log(menssage);
}
// -------------------------------------------
function renderProducts(products) {
  const items = document.querySelector('.items');
  products.forEach(({ id, title, thumbnail }) => {
    const objProduct = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    const createProducts = createProductItemElement(objProduct);
    // log(createProducts);
    items.appendChild(createProducts);
  });
}

async function getProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const computer = await response.json();
  return computer.results;
}

window.onload = async function onload() {
  log('Script Funcionando');
  const getProduct = await getProducts();
  renderProducts(getProduct);
};

const getProducts = async () => {
  const products = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const allProducts = await products.json();
  const { results } = allProducts;
  // console.log(results);
  return results;
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

const renderProducts = (products) => {
  const productsItens = document.querySelector('.items');
  products.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const productsRenders = createProductItemElement({ sku, name, image });
    productsItens.appendChild(productsRenders);
  });
};

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
window.onload = async function onload() { 
  console.log('Ok,Starts!');
  const products = await getProducts();
  renderProducts(products);
};

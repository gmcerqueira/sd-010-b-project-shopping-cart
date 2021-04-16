const getProducts = async () => {
  const products = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const allProducts = await products.json();
  const { results } = allProducts;
  // console.log(results);
  return results;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const removeItem = event.target;
  removeItem.parentNode.removeChild(removeItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

const addProductsToCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const teste = async () => {
        const ids = getSkuFromProductItem(event.target.parentNode);
        const idProducts = await fetch(`https://api.mercadolibre.com/items/${ids}`);
        const idProduct = await idProducts.json();
        const objIdPrduct = {
          sku: idProduct.id,
          name: idProduct.title,
          salePrice: idProduct.price,
        };
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(objIdPrduct));
      };
      return teste();
    });
  });
};

window.onload = async function onload() { 
  console.log('Ok,Starts!');
  const products = await getProducts();
  renderProducts(products);
  addProductsToCart();
};

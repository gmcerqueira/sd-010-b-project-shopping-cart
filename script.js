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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getFetch = async (term) => {
  const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`);
  const dataJson = await data.json();

  return dataJson;
};

const fetchProduct = async (itemId) => {
  const dataProduct = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const dataProductJason = await dataProduct.json();

  return dataProductJason;
}

const renderElement = (element) => document
  .querySelector('.items')
  .appendChild(createProductItemElement(element));

const getResult = ({ results }) => {
  const searchResult = results.forEach((result) => {
    const resultObject = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };

    renderElement(resultObject);
  });

  return searchResult;
};

const getResultProduct = (results) => {
  const resultObject = {
    sku: results.id,
    name: results.title,
    salePrice: results.price,
  }
  
  return resultObject;
};

const getListProducts = async () => {
  getResult(await getFetch('computador'));
};

const getProductFetch = async (itemId) => {
  return getResultProduct(await fetchProduct(itemId));
};

const addShoppingCart = () => {
  const product = document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.parentNode.firstChild.innerText;
      const shoppingCart = document.querySelector('.cart__items');

      fetchProduct(productId).then((dataProduct) => {
        shoppingCart.appendChild(createCartItemElement(getResultProduct(dataProduct)));
      });
    });
  });

  return product;
};

window.onload = function onload() {
  getListProducts()
  .then(() => {
    addShoppingCart();
  })
};

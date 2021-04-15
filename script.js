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
/* 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

function cartItemClickListener(event) {
  const idProduct = event.target.innerHTML.split(' ')[1];
  const arrayShoppingList = JSON.parse(localStorage.getItem('productsSave'));
  const arrayFilted = arrayShoppingList.filter(({ sku }) => sku !== idProduct);

  localStorage.setItem('productsSave', JSON.stringify(arrayFilted));
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchData(url, header) {
  return fetch(url, header)
  .then((promise) => promise.json())
  .catch((err) => err);
}
function saveLocalStorage(objProduct) {
  if (localStorage.getItem('productsSave') === null) {
    localStorage.setItem('productsSave', JSON.stringify([objProduct]));
  } else {
    localStorage.setItem(
      'productsSave', 
      JSON.stringify([
        ...JSON.parse(localStorage.getItem('productsSave')), 
        objProduct,
      ]),
    );
  }
}

const addEventBtn = (section, objProduct) => {
  section.getElementsByClassName('item__add')[0].addEventListener('click', async () => {
    const ItemID = objProduct.sku; 
    const objResponse = await fetchData(`https://api.mercadolibre.com/items/${ItemID}`)
      .then((data) => data)
      .catch((err) => console.log(err));
    
    const obj = { sku: objResponse.id, name: objResponse.title, salePrice: objResponse.price };

    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(obj));
    saveLocalStorage(obj);
  });
};

const printOutProducts = (product) => {
  const objProduct = { sku: product.id, name: product.title, image: product.thumbnail };
  const section = createProductItemElement(objProduct);
  
  addEventBtn(section, objProduct);
  document.getElementsByClassName('items')[0].appendChild(section);
};

async function listProduct() {
  const products = await fetchData('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((data) => data.results)
    .catch((err) => alert(`erro ao carregar produtos. Erro: ${err}`));
  
  products.forEach(printOutProducts);
  console.log(products);
}

function recoverShoppingList() {
  const JSONListProducts = localStorage.getItem('productsSave');
  if (JSONListProducts !== null) {
    const arrayListProducts = JSON.parse(JSONListProducts);
    arrayListProducts.forEach((obj) => {
      document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(obj));
    });
  }  
}

window.onload = () => {
  listProduct();
  recoverShoppingList();
};

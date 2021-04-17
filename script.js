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
  event.target.remove();
}
    
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
  
const consultAPI = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const responseObjeto = await response.json();
  const arrayResult = responseObjeto.results;
  return arrayResult;
};

const renderProduct = async (products) => {
  const itens = document.querySelector('.items');
  products.forEach((element) => {
    const parametro = { 
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const productRenders = createProductItemElement(parametro);
    itens.appendChild(productRenders);
  });
};

const transformToObject = (data) => ({ sku: data.id, name: data.title, salePrice: data.price });

const renderItemsCart = (item) => {
  const cartItemsOl = document.querySelector('.cart__items');
  cartItemsOl.appendChild(item);
};

const eventButton = () => {
  const buttonProducts = document.querySelectorAll('.item__add'); // traz uma lista con todos os botões dos produtos;
  buttonProducts.forEach((product) => {
    product.addEventListener('click', async (event) => {
      // resgata o id do produto que foi clicado no botão "adicionar ao carrinho"
      const id = getSkuFromProductItem(event.target.parentNode); 
      const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const responseAPI = await response.json();
      const objTransform = transformToObject(responseAPI);// a função pega os dados necessarios para entrar como parametro a função da proxima linha retornando um objeto;
      const liCreated = createCartItemElement(objTransform);
      renderItemsCart(liCreated);
    });
  });
};

const emptyCart = () => {
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', () => {
    const listCart = document.querySelector('.cart__items');
    listCart.innerText = '';
  });
};

window.onload = async function onload() { 
  const products = await consultAPI();
  renderProduct(products);
  eventButton();
  emptyCart();
};

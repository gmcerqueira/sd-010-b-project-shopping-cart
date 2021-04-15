window.onload = function onload() { };
const cartItens = document.querySelector('.cart__items');
const itens = document.querySelector('.items');
const priceToAppend = document.querySelector('.total-price');

const setItens = () => {
  localStorage.setItem('cart', cartItens.innerHTML);
  localStorage.setItem('priceCart', priceToAppend.innerHTML);
};

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  setItens();
}

const loadStorage = () => {
  priceToAppend.innerHTML = localStorage.getItem('priceCart');
  cartItens.innerHTML = localStorage.getItem('cart');
  cartItens.forEach((item) => item.addEventListener('click', cartItemClickListener));
};
console.log(loadStorage);

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return data;
};
  fetchProduct();

const fetchID = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  return data;
};

const renderProducts = ({ results }) => {
  results.forEach((result) => {
  itens.appendChild(createProductItemElement(result));
  });    
};

const addToCart = () => {
  document.querySelectorAll('.item__add').forEach((item) =>
  item.addEventListener('click', async () => {
    try {
      const data = await fetchID(getSkuFromProductItem(item.parentNode));
      cartItens.appendChild(createCartItemElement(data));
      setItens();
      console.log('batata');
    } catch (error) {
      console.log('estou aqui :)');
    }
  }));
};

const removeItem = () => {
document.querySelector('.empty-cart').addEventListener('click', () => {
  cartItens.innerHTML = '';
    setItens();
});
};
console.log(removeItem);
const removeLoading = () => document.querySelector('.loading').remove();

const renderPage = async () => {
  try {
    renderProducts(await fetchProduct());
    removeLoading();
    await addToCart();
    removeItem();
  } catch (error) {
    console.log('algo aconteceu, tente novamente ;)');
  }
};
renderPage();
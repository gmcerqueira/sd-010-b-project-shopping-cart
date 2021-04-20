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
  event.target.remove(); // remove o alvo clicado
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createListItems() {
  const responseList = await (fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador'));
  const responseJson = await responseList.json();
  responseJson.results.forEach((item) => {
    const product = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}
// capturar o id do produto clicado, faz acesso à API ML e joga pro carrinho.
const cartItems = document.querySelector('.cart__items');

function addItemCart() {
  const btnAddItemCart = document.querySelectorAll('.item__add'); // captura todos os botões.
  btnAddItemCart.forEach((event) => {
    event.addEventListener('click', async (productId) => {
      const id = getSkuFromProductItem(productId.target.parentNode); // ao clicar, captura a section que contém o item clicado.
      const productResponse = await fetch(`https://api.mercadolibre.com/items/${id}`); // passa para a API a id do item clicado.
      const productResponseJson = await productResponse.json();
      const productCartInfo = {
        sku: productResponseJson.id,
        name: productResponseJson.title,
        salePrice: productResponseJson.price,
      };
      cartItems.appendChild(createCartItemElement(productCartInfo));
    });
  });
}

function btnEmptyCart() {
  const cleanCart = document.querySelector('.empty-cart');
  cleanCart.addEventListener('click', () => {
    const carrinho = document.querySelector('.cart__items');
    carrinho.innerText = '';
  });
  // const cleanCart = document.querySelector(".empty-cart");
  // cleanCart.addEventListener('click', () => {
  // const carrinho = document.querySelectorAll(".cart__item");
  // carrinho.forEach((items) => items.remove());
  // });
}

window.onload = async function onload() {
  await createListItems();
  addItemCart();
  btnEmptyCart();
};
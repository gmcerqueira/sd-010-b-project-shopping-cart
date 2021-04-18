// Tive muita dificuldade neste projeto. Tive ajuda e me baseei no projeto do amigo Anderson

let liPrice;

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

let flexPrice = 0;

function cartItemClickListener(event, price) {
  flexPrice -= price;
  liPrice.innerHTML = `${flexPrice}`;
  localStorage.setItem('shopCar', liPrice.innerHTML);
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event, salePrice);
  });
  return li;
}

async function api(price) {
  const li = document.querySelector('.total-price');
  flexPrice += price;
  const allPrice = flexPrice;
  li.innerHTML = `${allPrice}`;
  localStorage.setItem('shopCar', li.innerHTML);
}

function loading() {
  const title = document.createElement('div');
  title.innerHTML = 'Loading...';
  title.className = 'loading';
  document.querySelector('body').appendChild(title);
}

function deleteLoading() {
  document.querySelector('.loading').remove();
}

async function clearShopCar() {
  const button = document.querySelector('.empty-cart');
  await button.addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    liPrice.innerHTML = '0';
  });
  document.querySelector('.cart').appendChild(button);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', async () => {
      loading();
      const request = await (await fetch(`https://api.mercadolibre.com/items/${sku}`)).json();
      const ol = document.querySelector('.cart__items');
      deleteLoading();
      const { price } = request;
      await api(price);
      const result = createCartItemElement(request);
      ol.appendChild(result);
      localStorage.setItem('page', ol.innerHTML);
    });
  return section;
}

async function renderProduct() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()).then(({ results }) => {
      results.forEach((element) => {
        const result = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
      document.querySelector('.items').appendChild(createProductItemElement(result));
      });
    }).catch((error) => error);
}

window.onload = async function onload() {
  liPrice = document.querySelector('.total-price');
  if (localStorage.getItem('page')) {
    console.log(localStorage.getItem('page'));
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('page');
  }
  loading();
  setTimeout(async () => {
    await renderProduct();
    deleteLoading();
  }, 2000);
  clearShopCar();
};
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
  // com ajuda do pedro henrique e daniel roberto
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return sectionItems.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
const sum = async () => {
  let total = 0;
  const addedToCartArray = document.querySelectorAll('.cart__item');
  console.log(addedToCartArray);
  addedToCartArray.forEach((element) => {
    total += Number(element.innerText.split('$')[1]);
  });
  const totalRounded = Math.round(total * 100) / 100;

  const result = document.querySelector('.total-price');
  result.innerText = totalRounded;
  localStorage.setItem('totalPrice', result.innerText);
  return result;
};

const saveData = () => {
  const olInnerHtml = document.querySelector('ol').innerHTML;
  localStorage.setItem('saved', olInnerHtml);
};

function cartItemClickListener(event) {
  document.querySelector('ol').removeChild(event.target);
  sum();
  saveData();
}
const loadData = () => {
  const cartItem = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  cartItem.innerHTML = localStorage.getItem('saved');
  totalPrice.innerText = localStorage.getItem('totalPrice');

  const [...allItems] = document.querySelectorAll('.cart__item');
  allItems.forEach((item) =>
    item.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', sum);
  document.querySelector('.cart__items').appendChild(li);
  saveData();
}

const addToCart = async (event) => {
  const id = await event.currentTarget.querySelector('.item__sku').innerText;
  await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }));
  sum();
};

const deleteCart = () => {
  const cartItem = document.querySelector('#cart__items__id');
  while (cartItem.firstChild) {
    cartItem.removeChild(cartItem.firstChild);
  }
  sum();
  saveData();
};

const load = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((element) => createProductItemElement(element));
      const allItems = document.querySelectorAll('.item');
      allItems.forEach((item) => item.addEventListener('click', addToCart));
      const emptyCartButton = document.querySelector('.empty-cart');
      emptyCartButton.addEventListener('click', deleteCart);
      loadData();
    });
};

window.onload = function onload() {
  load();
};
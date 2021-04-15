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

function cartItemClickListener(event) {
  document.querySelector('ol').removeChild(event.target);
}

const saveData = () => {
  const olInnerHtml = document.querySelector('ol').innerHTML;
  localStorage.setItem('saved', olInnerHtml);
};

const loadData = () => {
  const cartItem = document.querySelector('.cart__items');
  cartItem.innerHTML = localStorage.getItem('saved');
  const [...allItems] = document.querySelectorAll('.cart__item');
  allItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  saveData();
}

const addToCart = (event) => {
  const id = event.currentTarget.querySelector('.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }));
};

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((element) => createProductItemElement(element));
      const allItems = document.querySelectorAll('.item');
      allItems.forEach((item) => item.addEventListener('click', addToCart));
      loadData();
    });
};

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
  const primarySection = document.getElementsByClassName('items')[0];
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  primarySection.appendChild(section);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ id: sku, title: name, price: salePrice }) {
//   const cartItems = document.getElementsByClassName('cart__items')[0];
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   cartItems.appendChild(li);
//   return li;
// }

// function addToCart() {
//   const addButton = document.getElementsByClassName('item__add');
//   const itemsBySku = document.getElementsByClassName('item__sku');
//   addButton.forEach((button, index) => button.addEventListerner('click', () => {
//     fetch(`https://api.mercadolibre.com/items/${itemsBySku[index]}`)
//       .then((data) => data.json())
//       .then((data) => {
//         data[0].forEach((product) => { createCartItemElement(product); });
//       });
//   }));
// }

const productsList = async () => {
const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
const data = await result.json();
data.results.forEach((product) => { createProductItemElement(product); });
// addToCart();
};

window.onload = function onload() { 
  productsList();
};

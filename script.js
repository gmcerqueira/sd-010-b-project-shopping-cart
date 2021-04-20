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

  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(createCustomElement('span', 'item__sku', id));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() {
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchItems(number) {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((items) => {
      console.log(items.results);
      for (let i = 0; i < number; i += 1) {
        const newItem = createProductItemElement(items.results[i]);
        const itemsSection = document.querySelector('.items');
        itemsSection.appendChild(newItem);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

window.onload = () => {
  fetchItems(12);
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    const itemID = event.target.nextElementSibling.innerText;
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((item) => {
      console.log(item);
      const cartItem = createCartItemElement(item);
      const cart = document.querySelector('.cart__items');
      cart.appendChild(cartItem);
    })
    .catch((error) => {
      console.log(error);
    });
  }
});

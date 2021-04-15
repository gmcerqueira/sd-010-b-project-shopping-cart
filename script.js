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

function createCartItemElement(sku, name, salePrice) {
  const olPai = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return olPai.appendChild(li);
}

const createCart = (sku) => {
   fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then(
      (data) => {
        const { id, title, price } = data;
        return createCartItemElement(id, title, price);
      },
    );
};

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', () => createCart(sku));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {

// }

const fetchApi = (api) =>
  fetch(`https://api.mercadolibre.com/${api}`).then((response) =>
    response.json());

const listItem = () => {
  fetchApi('sites/MLB/search?q=computador').then((data) => {
    data.results.map((element) => {
      const { id, title, thumbnail } = element;
      const sectionPai = document.querySelector('.items');
      return sectionPai.appendChild(
        createProductItemElement(id, title, thumbnail),
      );
    });
  });
};

window.onload = function onload() {
  listItem();
};
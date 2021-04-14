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
  console.log(name);
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items');
  items.appendChild(section);
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

const start = ($QUERY) => {
 fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
  .then((response) => {
    response.json()
      .then((mercados) => {
        const deconstruct = mercados.results;
        /* const { id } = deconstruct; */
        /* const list = document.querySelector('items'); */
        deconstruct.forEach((element) => {
          const obj = {
            sku: element.id,
            name: element.title,
            image: element.thumbnail,
          };
          createProductItemElement(obj);
          console.log(element.id);
        });
      });
  });
};

window.onload = function onload() {
  start('computador');
};
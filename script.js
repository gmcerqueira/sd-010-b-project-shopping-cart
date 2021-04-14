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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchML() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador',
    { method: 'GET' });
  const json = await response.json();
  console.log(json.results);
  return json.results;
}

async function fetchItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`,
    { method: 'GET' });
  const json = await response.json();
  console.log(json);
  return json;
}

const addToCart = () => {
  document.querySelectorAll('.item__add').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      console.log(event.target);
      const firstSibling = event.target.parentNode.firstChild;
      fetchItem(firstSibling.innerText).then((result2) => {
        const father2 = document.querySelector('.cart__items');
        const child = createCartItemElement({
          sku: result2.id,
          name: result2.title,
          salePrice: result2.price,
        });
        father2.appendChild(child);
      });
    });
  });
};

window.onload = function onload() {
  fetchML().then((result) => {
    const father = document.querySelector('.items');
    result.forEach((element) => {
      const child = createProductItemElement({
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      });
      father.appendChild(child);
    });
    addToCart();
  });
};

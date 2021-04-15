function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

 function cartItemClickListener() {

  }
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const ol = document.querySelector('.cart__items');
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);

    return ol.appendChild(li);
  }
  const fetchItem = ((itemID) => {
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((item) => {
      createCartItemElement(item);
      });
    });
  const clickEvent = (event) => {
    const select = event.target;
    const itemID = select.parentElement.firstElementChild.innerText;
    fetchItem(itemID);
  };

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const item = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', clickEvent);

  return item.appendChild(section);
}
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchProducts = ((product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}"`)
  .then((response) => response.json())
  .then((products) => {
    products.results.forEach((element) => {
    createProductItemElement(element);
    });
  });
  });

  window.onload = () => {
  fetchProducts('computador');
  };
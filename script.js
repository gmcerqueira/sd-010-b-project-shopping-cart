function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const elementCreated = document.createElement(element);
  elementCreated.className = className;
  elementCreated.innerText = innerText;
  return elementCreated;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  
  const ordenedList = document.querySelector('.cart__items');
  ordenedList.appendChild(li);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async () => {
    const fetchId = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const fetchIdJson = await fetchId.json();
    createCartItemElement(fetchIdJson);
  });
  
  const sectionFather = document.querySelector('.items');
  sectionFather.appendChild(section);
}

const getApi = async (parameter) => {
  const objApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${parameter}`);
  const objApiJson = await objApi.json();
  objApiJson.results
  .forEach((element) => {
      createProductItemElement(element);
    }); 
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
// }

window.onload = function onload() { 
  getApi('computador');
};
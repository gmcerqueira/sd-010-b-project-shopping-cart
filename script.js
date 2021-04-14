window.onload = function onload() {
  fetchItems()
};

const fetchItems = () => {
    let url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'
    fetch(url)
      .then(res => res.json())
      .then(res => res.results)
      // .then(console.log)
      .then(getItems)
}

const getItems = (arr) => {
  
  for(let i = 0; i < arr.length; i += 1) {
    let obj = {sku: arr[i].id, name: arr[i].title, image: arr[i].thumbnail}
    document.querySelector('section .items').appendChild(createProductItemElement(obj))
  }
}

/* << DEFAULT >> */

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

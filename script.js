window.onload = function onload() {
  load()
  construct()
};

const construct = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'
  await fetch(url)
    .then(res => res.json())
    .then(res => res.results)
    .then(getItems)
  let btnArr = document.querySelectorAll('.item__add')
  btnArr.forEach((_, i) => btnArr[i].addEventListener('click', addItemToCart))
}

const getItems = (arr) => {
  for(let i = 0; i < arr.length; i += 1) {
    const obj = {sku: arr[i].id, name: arr[i].title, image: arr[i].thumbnail}
    document.querySelector('section.items').appendChild(createProductItemElement(obj))
  }
}

const addItemToCart = async (event) => {
  const item = event.target
  const itemId = item.parentElement.firstElementChild.innerText
  const url = `https://api.mercadolibre.com/items/${itemId}`
  
  await fetch(url)
    .then(res => res.json())
    .then(res => {
      const itemObj = {sku: res.id, name: res.title, salePrice: res.price}
      document.querySelector('ol.cart__items').appendChild(createCartItemElement(itemObj))
    })
  
  save()
}

const save = () => {
  localStorage.clear()
  const cartItems = document.querySelector('ol.cart__items')
  const arr = [...cartItems.children]
  arr.map((e, i) => {
    localStorage.setItem(`${i}`, e.innerText)
  })
  

}

const load = () => {
  for( let i = 0; i < localStorage.length; i += 1){
    const data = localStorage[i]
    const li = document.createElement('li');
    li.innerText = data
    li.addEventListener('click', cartItemClickListener)
    document.querySelector('ol.cart__items').appendChild(li)
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
  const item = event.target
  item.remove()
  save()
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

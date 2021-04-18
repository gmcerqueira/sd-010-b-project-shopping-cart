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

function storageCart() {
  localStorage.clear('cart');
  const myStorage = document.getElementsByClassName('cart__items')[0].innerHTML;
  console.log(myStorage);
  localStorage.setItem('cart', myStorage);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.currentTarget.classList.contains('clicked');
    event.currentTarget.classList.add('clicked');
  event.currentTarget.remove('clicked');
  storageCart();
  }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((response) => response.json())
    .then((data) => {
      const addCar = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const cart = document.getElementsByClassName('cart__items')[0];
      cart.appendChild(createCartItemElement(addCar));
      storageCart();
    });
}

function addObject() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()).then((data) => {
      data.results.forEach((item) => {
        const computer = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(computer);
      });
    })
    .then(() => {
      document.querySelectorAll('.item__add').forEach((addItem) => 
        addItem.addEventListener('click', () => { 
          getSkuFromProductItem(addItem
        .parentElement.querySelector('span.item__sku').innerText);
      }));
    });
}

window.onload = function onload() {
  if (localStorage.getItem('cart') !== undefined) {
    document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart');
    const li = document.querySelectorAll('li');
    li.forEach((list) => list.addEventListener('click', cartItemClickListener));
  }
  addObject();
};

let arrCarts = [];

// function getTotalPrice(arr) {
//   return new Promise((resolve) => {
//     let total = 0;
//     const elementSpan = document.querySelector('#price');
//     arr.forEach((elem) => {
//       total += elem.salePrice
//     })
//     elementSpan.innerHTML = `Preço Total: R$${total.toFixed(2)}`
//   })
// } 

async function totalPrice(arr) {
  // const response = await getTotalPrice(arrCarts)
  let total = 0;
  const elementSpan = document.querySelector('#price');
    arr.forEach((elem) => {
    total += elem.salePrice;
  });
  elementSpan.innerHTML = total;
}

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

function cartItemClickListener(event) {
  const liStr = event.target.innerText;
  const liArr = liStr.split(' ');
  arrCarts.forEach((carts) => {
    if (carts.sku === liArr[1]) {
      arrCarts.splice(arrCarts.indexOf(carts), 1);
      localStorage.setItem('carts', JSON.stringify(arrCarts));
    }
  });
  totalPrice(arrCarts);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function savedProducts() {
  const cartsString = localStorage.getItem('carts');
  arrCarts = cartsString === null ? [] : JSON.parse(cartsString);
  arrCarts.forEach((cart) => {
    const li = createCartItemElement(cart);
    document.querySelector('.cart__items').appendChild(li);
  });
}

function fetchItemId(idItem) {
  return fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
    .then((item) => {
      const itemObj = {
        sku: item.id,
        name: item.title,
        salePrice: item.price,
      };
      arrCarts.push(itemObj);
      totalPrice(arrCarts);
      localStorage.setItem('carts', JSON.stringify(arrCarts));
      document.querySelector('.cart__items').appendChild(createCartItemElement(itemObj));
    });
}

function fetchProducts() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((products) => {
      products.results.forEach((product) => {
        const productObj = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(productObj));    
      });
    })
    .then(() => {
      document.querySelectorAll('.item').forEach((item) => {
        item.lastChild.addEventListener('click', () => fetchItemId(item.firstChild.innerText));
      });       
    });
}

window.onload = function onload() { 
  savedProducts();
  fetchProducts();  
  totalPrice(arrCarts);
};
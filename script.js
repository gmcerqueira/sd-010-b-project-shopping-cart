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

let flexPrice = 0;

function cartItemClickListener(event, price) {
  const li = document.getElementsByClassName('total-price')[0];
  flexPrice -= price;
  li.innerHTML = `${flexPrice}`;
  localStorage.setItem('shopCar', li.innerHTML);
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event, salePrice);
  });
  return li;
}

function api(price) {
  console.log(price);
  const liPrice = document.querySelector('.total-price');
  flexPrice += price;
  const allPrice = flexPrice;
  liPrice.innerHTML = `${allPrice}`;
  localStorage.setItem('shopCar', liPrice.innerHTML);
}
  
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', async () => {
      const request = await fetch(`https://api.mercadolibre.com/items/${sku}`);
      const ol = document.querySelector('.cart__items');
      const obj = await request.json();
      const { price } = obj;
      await api(price);
      const result = createCartItemElement(obj);
      ol.appendChild(result);
      localStorage.setItem('page', ol.innerHTML);
    });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = async function onload() {
  if (localStorage.getItem('page')) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('page');
    document.querySelectorAll('.total-price')[0].innerHTML = localStorage.getItem('shopCar');
  }
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()).then(({ results }) => {
      results.forEach((element) => {
        const result = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(result));
      });
    }).catch((error) => error);
};
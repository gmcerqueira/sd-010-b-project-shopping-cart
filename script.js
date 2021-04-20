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
const savelocalStorage = [];
const savePrice = [0];
const divPrice = document.querySelector('.total-price');

const price = () => {
  const sumPrices = savePrice.reduce((acc, element) => acc + element);
   divPrice.innerText = `${sumPrices}`;
};
 async function cartItemClickListener(event, sku) {
   // let newArray = savelocalStorage;
  const select = event.target;
  select.remove();
  console.log(select);
  console.log(savelocalStorage);
  const teste = savelocalStorage.find((element) => element.id === sku); //  Com ajuda Gabriel Esseênio.
  savelocalStorage.splice(savelocalStorage.indexOf(teste), 1);
  console.log(savelocalStorage);
  console.log(select);

  savePrice.splice(savePrice.indexOf(Number(select.innerText.split('$')[1])), 1);
  localStorage.setItem('selected', JSON.stringify(savelocalStorage));
  price();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const ol = document.querySelector('.cart__items');
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', (event) => cartItemClickListener(event, sku));

    return ol.appendChild(li);
  }

  const fetchItem = ((itemID) => {
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((item) => {
      createCartItemElement(item);
      savelocalStorage.push(item);
      savePrice.push(item.price);
      })
    .then(() => localStorage.setItem('selected', JSON.stringify(savelocalStorage)))
    .then(() => price());
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

const fetchProducts = (product) => {
  const loading = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}"`)
  .then((response) => response.json())
  .then((products) => {
    products.results.forEach((element) => {
    createProductItemElement(element);
    loading.remove();
    });
  });
  };

  const delet = () => {
    const apagar = document.querySelector('.empty-cart');
    apagar.addEventListener('click', () => {
      document.getElementById('cart__itemsId').remove();
      const ol = document.createElement('ol');
    ol.className = 'cart__items';
    ol.id = 'cart__itemsId';
    document.querySelector('.cart').appendChild(ol);
    });
  };

  window.onload = async () => {
  fetchProducts('computador');
  delet();
  const savedLocalStorage = await localStorage.getItem('selected');
  const arraySaved = JSON.parse(savedLocalStorage);
  arraySaved.forEach((element) => createCartItemElement(element));
  arraySaved.forEach((element) => savePrice.push(element.price));
  await price();
};

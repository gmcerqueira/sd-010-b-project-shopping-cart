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
 async function cartItemClickListener(event) {
   // let newArray = savelocalStorage;
  const select = event.target;
  select.remove();
  console.log(select.innerText.split('$')[1]);
  console.log(savePrice);
  savelocalStorage.splice(savelocalStorage.indexOf(select), 1);
  savePrice.splice(savePrice.indexOf(Number(select.innerText.split('$')[1])), 1);
  localStorage.setItem('selected', JSON.stringify(savelocalStorage));
  price();
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

    // localStorage.setItem('selected', JSON.stringify(savelocalStorage));
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
  // const load = () => {
  //   const creatLoading = document.createElement('span');
  //   creatLoading.className = 'loading';
  //   creatLoading.innerText = 'Loading...';
  //   document.querySelector('.container').appendChild(creatLoading);
  // };

  window.onload = async () => {
  fetchProducts('computador');
  delet();
  const savedLocalStorage = await localStorage.getItem('selected');
  const arraySaved = JSON.parse(savedLocalStorage);
  arraySaved.forEach((element) => createCartItemElement(element));
};

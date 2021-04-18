// função de apagar item no carrinho de compras
const cartItemClickListener = (event) => {
  event.target.remove();
  const olCard = document.getElementsByClassName('cart__items')[0];
  localStorage.saveItensCar = olCard.innerHTML; // apaga item loca
};

// cria a imagem src, classe, return
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria elemeno classe, texto do element
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// pegar o evento de click no item enviar pela api
const addCardCar = async (ItemID) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const item = await response.json();
  const returnID = createCartItemElement(item);
  const olCard = document.querySelector('.cart__items');
  olCard.appendChild(returnID);
  localStorage.setItem('saveItensCar', olCard.innerHTML); // save no localStorage.setItem()
};

// add no carrinho de compras
const addCardItem = async (event) => {
  const getButtonId = event.target.parentNode.firstChild.innerText;
  addCardCar(getButtonId);
};

// cria elemento no dom , id , titulo , imagem. botao de adicionar ao car. eventListener click
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItem = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addCardItem); // evento de click, e chamada de função

  return sectionItem.appendChild(section);
}

// // cria item no carrinho de compras com os paramentros passado
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
//   // return event.target =
// }

const restoreLocalStorage = () => {
  if (localStorage.getItem('saveItensCar')) {
    const olCard = document.querySelector('.cart__items');
    olCard.innerHTML = localStorage.getItem('saveItensCar');
    const liCardCar = document.querySelectorAll('.cart__item');
    liCardCar.forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
};

window.onload = function onload() {
  const fetchApi = async (item) => {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
    const data = await response.json();
    data.results.forEach((element) => {
      createProductItemElement(element);
    });
  };
  fetchApi('computador');
  restoreLocalStorage();
};

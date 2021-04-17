// const addCartItem = document.querySelectorAll('.item__add ');
// const remuveCarItem = document.querySelectoAll('.empty-cart');
// const allCar = document.querySelector('.cart__title')
const cartItemClickListener = (i) => i;

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
// evento de pegar o evento de click   .parentNode `https://api.mercadolibre.com/items/${id}`;
// const eventClick = (event) => {
//   const idproduto = event.terget.parentNode.firstChild.innerText;
//   idproduto = 'texto':
// };

// pegar o evento de click no item
const addCardCar = async (ItemID) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const item = await response.json();
  return item;
};

// add no carrinho de compras
const addCardItem = async (event) => event;

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

// cria item no carrinho de compras com os paramentros passado
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
//   // return event.target =
// }

// const addLocalStorage = () => {
//   localStorage.setItem("chave", valor)
//   //nessa chave vai ser armazenado um arry de objetos = JSON.stringfy(arrayde objetos)

// }

window.onload = function onload() {
  const fetchApi = async (item) => {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
    const date = await response.json();
    date.results.forEach((element) => {
      createProductItemElement(element);
    });
  };
  fetchApi('computador');
};

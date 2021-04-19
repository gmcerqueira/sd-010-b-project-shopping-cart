const classOl = document.querySelector('.cart__items');
const body = document.querySelector('body');
const classItens = document.querySelector('.items');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
// Remove o item do carrinho ao clicar nele. https://developer.mozilla.org/pt-BR/docs/Web/API/ChildNode/remove
function cartItemClickListener(event) {
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Faz a requisição para a API
const apiUrl = async (item) => {
  const URL = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
  const docJson = await URL.json();
  const listComputer = await docJson.results;
  return listComputer;
};
// Adiciona o elemento buscado (computador) como filho da section com a classe items
const elementComputerSection = async () => {
  const list = await apiUrl('computador');
  list.forEach((item) => {
    const computers = createProductItemElement(item);
      classItens.appendChild(computers);
  });
};
// Faz a requisição na API pelo id
const fetchSearchId = async (id) => {
  const productId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const response = await productId.json();
  console.log(response);
  return response;
};
// Cria o item a ser adicionado no carrinho. Codigo ajustado com a ajuda de Herique Clementino.
const createProductCart = async (id) => {
  const itemId = await fetchSearchId(id);
  classOl.appendChild(createCartItemElement(itemId));
};
// Adiciona Item no carrinho. Referencia da ajuda que encontrei, no final  da pagina.
const addProductCart = () => {
   body.addEventListener('click', (event) => {
    const clickElement = event.target;
      if (clickElement.className === 'item__add') {
         createProductCart(getSkuFromProductItem(event.target.parentNode));
    }
  });
};

addProductCart();
 
window.onload = () => {
   elementComputerSection(); 
};

// Resolução do segundo exercicio: https://www.youtube.com/watch?v=LEtLtRXBDms&t=492s
// https://www.youtube.com/watch?v=9bWDK5oltiI.
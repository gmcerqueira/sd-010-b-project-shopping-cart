function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function rememberCartItemsOnload() {
  const cartItemsHTMLFather = document.querySelector('ol');
  cartItemsHTMLFather.innerHTML = localStorage.getItem('CartHTML');
}

function setLocalStorageItemCartItems() {
  const items = document.querySelector('ol').innerHTML;
  localStorage.CartHTML = items;
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  setLocalStorageItemCartItems();
}

async function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 1 ------------------------------------------------------------------------------------
// essa função acessa os array "results" da API
async function getResultsAPI(url) {
  const { results } = await fetch(url)
  .then((response) => response.json())
  .catch(() => 'não foi possível acessar a API');
  return results;
}

// Essa função chama executa uma chamada para a função que monta o elemento;
async function createItemElements(url) {
  const sectionItems = document.querySelector('.items');
  
  const APILoading = '<div class = "loading" >loading...</div>';
  sectionItems.innerHTML = APILoading;
  const getLoading = document.querySelector('.loading');
  
  const createHTMLElements = await getResultsAPI(url)
  .then((array) => {
    getLoading.remove();
    array.forEach((element) => sectionItems.appendChild(createProductItemElement(element)));
  })
  .catch(() => getLoading.remove());
  return createHTMLElements;
}

// requisito 2 ------------------------------------------------------------------------------------

function executeFunctionWhenClick() {
  const getOlList = document.querySelector('.cart__items');
  const ItemsGrid = document.querySelectorAll('.item');
  ItemsGrid.forEach(async (item) => {
    item.lastChild.addEventListener('click', async () => {
      const idItem = getSkuFromProductItem(item);

      const itemInfo = await fetch(`https://api.mercadolibre.com/items/${idItem}`)
      .then((response) => response.json())
      .then((data) => data);

      getOlList.appendChild(await createCartItemElement(itemInfo));
      setLocalStorageItemCartItems();
    });
  });
}

// requisito 3 ------------------------------------------------------------------------------------
// código na linha 35

// requisito 4 ------------------------------------------------------------------------------------
// Quando devo salvar o carrinho? Quando ele é atualizado?
// Quando adiciono um item - V
// Quando removo um item - V
// Quando esvazio o carrinho - V
// requisito 5 ------------------------------------------------------------------------------------

// requisito 6 ------------------------------------------------------------------------------------
function actionCleanItemsCart() {
  const arrayItems = document.querySelectorAll('.cart__item');  
  arrayItems.forEach((item) => {
    item.remove();
  });
  setLocalStorageItemCartItems();
}

function cleanAllItemsShoppingCart() {
  const cartButton = document.querySelector('.empty-cart');
  cartButton.addEventListener('click', actionCleanItemsCart);
}

// requisito 7 ------------------------------------------------------------------------------------
// código na linha 62 em diante
// peguei a idéia desse requisito nesses links:
//  stackoverflow.com/questions/53799108/how-to-add-a-loading-animation-while-fetch-data-from-api-vanilla-js
//  stackoverflow.com/questions/36294109/how-to-check-if-a-promise-is-pending
// ------------------------------------------------------------------------------------------------
window.onload = async function onload() {
  rememberCartItemsOnload();
  await createItemElements('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  await executeFunctionWhenClick();
  cleanAllItemsShoppingCart();
 };

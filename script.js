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
/* 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
 */
function fetchData(url) {
  return fetch(url)
  .then((promise) => promise.json())
  .catch((err) => err);
}

const printOutProducts = (product) => {
  const section = createProductItemElement(
    { sku: product.id, name: product.title, image: product.thumbnail },
   );
   
  document.getElementsByClassName('items')[0].appendChild(section);
};

async function listProduct() {
  const products = await fetchData('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((data) => data.results)
    .catch((err) => alert(`erro ao carregar produtos. Erro: ${err}`));
  
  products.forEach(printOutProducts);

  console.log(products);
}

window.onload = () => {
  listProduct();
};

// create the 'img' tag, add a className and get the image url (parameter)
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// create a custom element (parameter 1), adding a className (parameter 2) and an innerText (parameter 3)
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// get the sku from the item clicked
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// delete the product from the shopping cart when clicked
// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// create the 'li' element that will be inside the shopping cart sidebar
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// after clicking on a add button, adds that item to the shopping cart
async function addToTheCart() {
  const productId = getSkuFromProductItem(this.parentElement);
  const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const product = await response.json();
  
  const { id: sku, title: name, price: salePrice } = product;

  const shoppingCart = document.querySelector('ol.cart__items');
  shoppingCart.appendChild(createCartItemElement({ sku, name, salePrice }));
  console.log(product);
} 

// get the array results from the API
async function getData() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json();
  const products = json.results;
  return products;
}

// create each product object containing sku, name, img and salePrice
// uses getData()
async function createProductsObject() {
  const products = await getData();
  return products.reduce((accumulator, product) => 
    [...accumulator,
      {
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      },
    ], []);
}

// create the product in a 'section' element with the className 'item'. that 'section' has the 'sku', 'name', 'img' (all 3 from the API) and a button.
// also add an eventListener on the created button, to 
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToTheCart);
  return section;
}
// create the card of each product
// uses createProductsObject() and createProductItemElement()
async function renderProduct() {
  const products = await createProductsObject();
  const itemsSection = document.querySelector('section.items');
  products.forEach(({ sku, name, image }) => {
    itemsSection.appendChild(createProductItemElement({ sku, name, image }));
  });
}

// apply the function when the window is loaded
window.onload = async function onload() {
  await renderProduct();
};

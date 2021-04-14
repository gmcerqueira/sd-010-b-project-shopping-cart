// get the results from the API
function fetchComputersAPI(url) {

}

// apply the function when the window is loaded
window.onload = function onload() {
  fetchComputersAPI();
};
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
// create the product in a 'section' element with the className 'item'. that 'section' has the 'sku', 'name', 'img' (all 3 from the API) and a button.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
// create each product card based on the quantity of results (array)
function createProductItem(results) {}
// NO IDEA YET --- get the sku from the item, but no idea why.....
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// delete the product from the shopping cart when clicked
function cartItemClickListener(event) {
  // coloque seu código aqui
}
// create the 'li' element that will be inside the shopping cart sidebar
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
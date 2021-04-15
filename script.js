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
  console.log(name);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const listOfProducts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();  
  return results;
};

const renderItems = (getResults) => {
  let pc;
  const selectSection = document.getElementsByClassName('items')[0];
  getResults.forEach((el) => {
   pc = createProductItemElement({ sku: el.id, name: el.title, image: el.thumbnail });
    selectSection.appendChild(pc);
   });
  };

  // Tive ajuda do instrutor Eduardo para finalizar o requisito 1.

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = async function onload() { 
  console.log('Ok!!! Ready');
  const getResult = await listOfProducts();
  console.log(getResult);
  renderItems(getResult);
};
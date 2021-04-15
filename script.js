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

// Primeiro Passo

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
}
 */
/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

// Primeira modificação

async function getElements(QUERY) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const { results } = await response.json();  
  // console.log(results);
  return results; 
}

const appendProducts = (element) => document.getElementsByClassName('items')[0]
.appendChild(element); 

const renderProduct = (prodctJson) => {
  prodctJson.forEach((product) => {
    const objResult = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    appendProducts(createProductItemElement(objResult));
  });
};

const allProductsChamada = async () => {
 renderProduct(await getElements('computador')); 
};

window.onload = function onload() { 
  allProductsChamada();
};

// for (const key in itens.results) {
//   console.log(key);
//   const { id } = key;
//   const { title } = key;
//   const image = key.thumbnail;
// createProductItemElement({ id, title, image });

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, price: salePrice }) {
  const ol = document.querySelector('ol');
  const li = document.createElement('li');
  ol.appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}
// function cart({ sku }) {
//   return fetch(`https://api.mercadolibre.com/items/${sku}`)
//   .then((response) => response.json()).then((iten) => {
//   const { id, title, price } = iten;
//   const element = {
//     sku: id,
//     name: title,
//     price,
//   };
//   return createCartItemElement(element);
// });
// }
function createProductItemElement({ sku, name, image }) { // poderia fazer id: sku, title: name, thumbnail: image
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json()).then((iten) => {
  const { price } = iten;
  const element = {
    sku,
    name,
    price,
  }; return createCartItemElement(element);
  });
});
return section;
}

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((itens) => {
     itens.results.forEach((iten) => {
      const { id, title, thumbnail } = iten;
      const products = {
        sku: id,
        name: title,
        image: thumbnail,
      }; 
      const createItens = createProductItemElement(products);
      document.getElementsByClassName('items')[0].appendChild(createItens);
    });
});
};

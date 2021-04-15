function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// createCartItemElement()

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

function pegaAPI() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((respostaApi) => respostaApi.json())
  .then((respostaConvertida) => {
    console.log(respostaConvertida);
    const { results } = respostaConvertida;
    results.forEach((valor) => {
      const produtos = {
        ids: valor.id,
        name: valor.title,
        image: valor.thumbnail,
      };
      const produto = createProductItemElement(produtos);
    document.querySelector('.items').appendChild(produto);
    });
  });
}

window.onload = async function onload() { 
  try {
   await pegaAPI();
  } catch (_error) {
   alert('error');
  }
 };
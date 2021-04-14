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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return sectionItems.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({
//   sku,
//   name,
//   salePrice,
// }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
// 1° Desafio
// Baby Steps: 
// 1° informação
// 1.1 acessar a API do 'mercadolivre'
// 1.2 pega-la e transformar em .json para ser lido pelo javascript
// 2 Capturar as informações 
// 2.1 Apos capturada, percorrer as info contidas dentro
// 2.2 acionar o createProductItemElement
// 2.3 adicionar um destructuring no parametro do creatProductItemElement
// 2.4 colocar dentor do create o 'element' contendo as informações da API
// 3° o Parametro da API está desestruturado e fará a organização da pesquisa
// entrega-los para o crateProduction
window.onload = function onload() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((element) =>
        createProductItemElement(element));
    });
};
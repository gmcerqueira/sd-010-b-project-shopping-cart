function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Criando as Imagens dos Produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// //Capturando o ID dos Produtos
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Criando os Elementos do Produto no HTML
function criarElementoNaTabela({ sku, name, image }) {
  const encontraSection = document.createElement('section');
  encontraSection.className = 'item';

  encontraSection.appendChild(createCustomElement('span', 'item__sku', sku));
  encontraSection.appendChild(createCustomElement('span', 'item__title', name));
  encontraSection.appendChild(createProductImageElement(image));
  encontraSection.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return encontraSection;
}

// Desenvolvendo a Lista de Produtos
async function transformarUrl(url) {
  const pegarIformacoesDaUrl = await fetch(url);
// passar para obejeto
  const arrayDaUrl = await pegarIformacoesDaUrl.json();
  const { results: answer } = arrayDaUrl;
  const elementos = document.querySelector('.items');

  answer.forEach((index) => {
    const informaçoesDoproduto = {
      sku: index.id,
      name: index.title,
      image: index.thumbnail,
    };
    const element = criarElementoNaTabela(informaçoesDoproduto);
    elementos.appendChild(element);
  });
}

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

window.onload = function onload() {
  transformarUrl('https://api.mercadolibre.com/sites/MLB/search?q=computador');
 };

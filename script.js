/*
  Essa função recebe uma imageSource, constrói e retorna este respectivo elemento HTML com a classe "item__image".
*/
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

/*
  Essa função recebe um element, className e innerText, constrói e retorna este respectivo elemento HTML com estas informações.
*/
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

/*
  Essa função desestrutura um objeto produto recebido, construindo e retornando os componentes HTML referentes a este parâmetro.
*/
// function createProductItemElement({ sku, name, image }) {
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/*
  Essa função retorna uma lista dos itens relacionados com uma consulta que contém o termo (palavra) passado como parâmetro.

  Créditos pela explicação sobre async/await e .then():
  @Henrique Clementino - Turma 10 - Tribo B 
  @Janaina Oliveira - Turma 10 - Tribo B 
  @Luanderson Santos 
*/
const createProductsList = async (query = 'computador') => {
  // busca os resultados de uma Promise de consulta usando a api do mercado livre e um termo recebido como parâmetro
 const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
 
 // desestrutura o objeto JSON resultado do sucesso de uma Promise do processamento da stream response
 const { results } = await response.json();

 return results; // retorna uma lista de produtos
//  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
//  const { results } = await response.json();
//  console.log(results);
};

/*
  Essa função recebe uma lista de produtos e renderizar seus elementos.

  Créditos pela explicação sobre destructuring:
  @Henrique Clementino - Turma 10 - Tribo B
*/
const renderProductsList = (productsList) => {
  const items = document.querySelector('.items'); // obtém o elemento que possui a classe 'items'
  productsList.forEach((product) => { // para cada produto na lista
    // const { id, title, thumbnail } = product;
    // const productCart = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const productCart = createProductItemElement(product); // cria um elemento HTML que o armazena
    items.appendChild(productCart); // e o adiciona como filho de 'items'
  });
};

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
  // cria e renderiza a lista de produtos relacionados com uma consulta que contém o termo (palavra) passado como parâmetro
  renderProductsList(await createProductsList());
 };

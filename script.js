function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
// // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

 async function getProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await response.json();
  const result = products.results;
  return (result);
}
// função assincrona, envia requisição ao API com a busca por computador
// aguarda com o await o retorno desta requisição e guarda na const response
// na const products armazena o resultado de response transformado em json
// a const result guarda especificamente o array results do arquivo json
// retorna o array com 50 itens - result
 
async function renderProducts(getProducts) {
  getProducts.forEach((product) => { 
    const elementProduct = createProductItemElement(product);
    const item = document.querySelector('.items');
    item.appendChild(elementProduct); 
  }); 
}
// função que exibe os itens na tela e tem como parametro a função anterior
// utiliza o retorno dos produtos e cria um elemento para cada item do array
// o item, busca os elementos com a classe .items 
// e o append, inclui o elemento criado no foreach como filho da classe items.

window.onload = async function onload() {
  const product = await getProducts();
  renderProducts(product);
 };

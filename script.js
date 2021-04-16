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

 const getProducts = async (product) => {
  const items = document.querySelector('.items');
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then(
      (response) => {
        response.json().then((products) => {
          const result = products.results;
          result.forEach((element) => { 
            items.appendChild(createProductItemElement(element));
          }); 
        });
      },
    ).catch((erro) => {
      alert(`Erro interno: ${erro}`);
    });  
 };
 
// função assincrona com parametro o nome do produto desejado, envia requisição ao API - fetch
// se der certo, entra com a resposta no .then que na seqquencia da função, transforma em json 
// e novamente entra no then como products e é saldo numa constante desconstruindo apenas o array results que contem
// os produtos especificado - um array com 50 itens 
// no array, fazemos um foreach para criar para cada produto um elemento html filho da classe items
// Este código havia sido escrito inicialmente com async/await, porém como não passou no lint, pedi ajuda para meu 
// colega Emerson Saturnino que me explicou melhor a utilização do then e refatorei o código seguindo a lógica acima.

window.onload = function onload() {
  getProducts('computador');
};
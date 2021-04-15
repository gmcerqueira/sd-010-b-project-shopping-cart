// cria uma tag de imgem e atribui informções a partir dos parâmetros.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

// Quando um item da lista do carrinho de compras é clicado o mesmo é removido da lista.
function cartItemClickListener(event) {
  const alvo = event.target;
  const listCart = document.querySelector('.cart__items');
  listCart.removeChild(alvo);

  const local = localStorage.getItem('product', alvo.innerHTML);
  console.log(local);
}

// Recebe um objeto desconstrói pegando apenas id,title e price, cria um elemento li com informações do objeto recebido, adiciona um escutador de eventos com a função 'cartItemClickListener' e retorna o elemento li.
function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Recebe as section criadas e adiciona um escutador de eventos click, faz um requerimento em uma API passando o id pego na section, traansforma em JSON, chama a função 'createCartItemElement' e adiciona o retono na lista de compras.
function addToCart(product) {
  product.addEventListener('click', async () => {
    const id = product.children[0].innerText;
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const element = await response.json();
    const listCart = document.querySelector('.cart__items');
    listCart.appendChild(createCartItemElement(element));
  });
}

// Cria e adiciona informações ao elemento de acordo com parâmetros passados.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
}

// Recebe um objeto como parâmetro, cria uma section e coloca dentro da section os elementos criados com informações do objeto, chama a função addToCart passando  section crida e retorna o elemento.
function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  addToCart(section);
  return section;
}

// Faz  requisição da API transforamando em JSON, e envia cada item para ser criado na função 'createProductItemElement' e adiciona cada item na section. 
async function getProductsList(word) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${word}`);
  const object = await response.json();
  const {
    results,
  } = object;
  const section = document.querySelector('.items');
  results.forEach((item) => {
    // Dica do PR da Ana Gomes 
    section.appendChild(createProductItemElement(item));
  });
}

window.onload = function onload() {
  getProductsList('computador');

  /*  const listStorage = localStorage.getItem('product'); */
};
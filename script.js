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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {

// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((item) => {
        const object = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
}
// createItemsList function que faz um fetch da api
// trazendo os itens e transformados no .then em .json()
// apos pegar os dados do data.result
// acesso results com forEach pois ele eh um array
// forEach passa por todos os dados buscando sku, name e image
// com esses dados gero uma lista com o resultado desses itens usando appendChild no (createProductItemElement).

// Ao esperar a requisicao da API, adiciono 'loading'
// crio uma tag h2 com a class 'loading' que vai ser carregada e removida
// usando querySelector e .remove
// quando terminar de carregar api.

function moveItensToCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentNode = event.target.parentElement;
      const sku = getSkuFromProductItem(parentNode);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((response) => response.json())
        .then((data) => {
          const idObject = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(idObject));
        });
    }
  });
}
// moveItensToCart adiciono produto no carrinho
// uso addEventLister para adicionar ao carrinho com click
// id eh o sku do Readme
// ao clicar no botao, ele pega os itens que cliquei e joga no ol com querySelector('items)
// usando eventListener que ao clicar ele me da o event target com tudo
// crio a const id, uso a funcao ja existente (getSkuFromProductItem) que busca o ID
// passo o elemento parentNode que eh o item clicado
// ele busca no elemento pai, se existe span, class, item__sku, id
// faco fetch buscado especificamente conforme readme link
// e transformo em json()
// atraves do data pego os dados recebidos e crio uma const idObject
// que contem o id, name e salePrice 
// uso querySelector do cart__items e faco appendChield usando a funcao ja criada
// (createCartItemElement) passando como parementro o meu idObject 
window.onload = function onload() {
  createItemsList();
  moveItensToCart();
 };
let items; // Esta variável guarda os itens exibidos na tela;
let orderedList; // Esta variável guarda a OL;

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

 function cartItemClickListener(event) {
   console.log(event);
 }

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

 function createCartItemElement({ sku, name, salePrice }) {
   const li = document.createElement('li');
   li.className = 'cart__item';
   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
   li.addEventListener('click', cartItemClickListener);
   return li;
 }

const addProductToCart = (args) => {  
  fetch(`https://api.mercadolibre.com/items/${args}`)
  .then(
    (response) => {
      response.json()
  .then((result) => {
    const resultado = result;
    const newItem = createCartItemElement({
      sku: resultado.id,
      name: resultado.title,
      salePrice: resultado.price,
    });
    orderedList.appendChild(newItem);
      });
    },
  );
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clickAddEvent = () => {
  // Busca com base na classe .item todos os itens
  items.addEventListener('click', function (props) {
    // parentNode retorna o pai do elemento clicado, no caso o pai do botão adicionar
    const sku = getSkuFromProductItem(props.target.parentNode);
    addProductToCart(sku);
  });
};

// Função para retornar o produto com base no parâmetro
const recoverProduct = async (product) => {
  items = document.querySelector('.items');
  orderedList = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then(
    (response) => {
      response.json().then((result) => {
        const resultado = result.results;
        resultado.forEach((element) => {
          items.appendChild(createProductItemElement(element));
        });     
          // Após criar os elementos na tela, aciona a função que cria o evento de clique
          clickAddEvent();
      });
    },
  );
};

window.onload = function onload() {
  recoverProduct('computador');
};

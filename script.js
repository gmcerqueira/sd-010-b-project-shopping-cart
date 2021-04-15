let items; // Esta variável guarda os itens exibidos na tela;

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

const addProductToCart = (args) => {
  const query = args;
  fetch(`https://api.mercadolibre.com/items/${query}`).then(
    (response) => {
      response.json().then(async (result) => {
        const resultado = await result.results;
        console.log(resultado, args);
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

/*
function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
*/

window.onload = function onload() {
  recoverProduct('computador');
};

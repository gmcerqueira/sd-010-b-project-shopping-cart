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
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.setAttribute('data-id', sku);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.setAttribute('data-id', sku);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Pega da API o item pelo ID do produto.
const fetchItem = async (sku) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  return data;
};

// Captura ol e adiciona li ao licar no card adicioando o item no carrinho;
const addItemCart = async (sku) => {
  const getOl = document.querySelector('.cart__items');
  const data = await fetchItem(sku);
  getOl.appendChild(createCartItemElement(data));
};

// Faz a listagem dos computadores, chama a função que cria os cards aicionando evento de click nele. Em seguida pega o id e chama função adItemCart;
const createListProduct = (data) => {
  data.results.forEach((product) => {
    const classItens = document.querySelector('.items');
    const cardProduct = createProductItemElement(product);
    cardProduct.addEventListener('click', (event) => {
      const section = event.target.parentNode;
      addItemCart(section.dataset.id);
    });
    classItens.appendChild(cardProduct);
  });
};

// Faz requisição de todos os computadores na API.
const fetchPC = async () => {
  // referência https://www.youtube.com/watch?v=Zl_jF7umgcs&ab_channel=RogerMelo
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  await createListProduct(data);
};

window.onload = function onload() {
  fetchPC();
};
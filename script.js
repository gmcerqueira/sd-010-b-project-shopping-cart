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
  // coloque seu código aqui
  const intemCart = event.target;
  intemCart.parentNode.removeChild(intemCart);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adiciona produto ao carrinho
async function onClick(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const results = await response.json();
  const addToCart = createCartItemElement(results);
  document.querySelector('.cart__items').appendChild(addToCart);
  addToCart.addEventListener('click', cartItemClickListener);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const onClickButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(onClickButton);
  onClickButton.addEventListener('click', () => onClick(sku));
  return section;
}

// ASYNC declara a função como assincrona! e assim podemos usar o AWAIT
// Esta função cria uma listagem de produtos($computador)
async function getComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const { results } = await response.json();
  results.forEach((product) => {
    const getComputers = createProductItemElement(product);
    document.querySelector('.items').appendChild(getComputers);
  });
}

window.onload = function onload() {
  console.log('Funcionando, corretamente.');
  getComputer();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function renderComputer({ url }, index) {
//   const elementImgComputer = createProductImageElement(url);
//   console.log(elementImgComputer);
// }

// function renderComputers(computers) {
//   const elementComputers = document.getElementsByClassName('items');
//   computers.forEach(({url}) => {
//     const elementImgComputers = createProductImageElement(url);
//     elementComputers.appendChild(elementImgComputers);
//   });
// }

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

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
    console.log(getComputers);
    return getComputers;
  });
}

window.onload = function () {
  console.log('Funcionando, corretamente.');
  getComputer();
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

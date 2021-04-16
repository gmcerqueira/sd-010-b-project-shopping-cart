function cartItemClickListener(event) {
 event.target.remove();
  }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemAddClickListener(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const prepareToAdd = async (id) => {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const archive = await response.json();
    return archive;
  };
  const itemApiReturn = await prepareToAdd(itemId);
  const { id, title, price } = itemApiReturn;
  const computerAdd = {
    sku: id,
    name: title,
    salePrice: price,
  };
  document.querySelector('.cart__items').appendChild(createCartItemElement(computerAdd));
  }

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', cartItemAddClickListener);

  return section;
}

async function getComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computer');
  const computers = await response.json();
  const { results } = computers;
  console.log(results);
  // ate aqui está tudo certo estou recebendo um objeto 
  results.forEach((computer) => {    
    const newComputerObject = {
      sku: computer.id, 
      name: computer.title,
      image: computer.thumbnail,
    };
    // onde desejo adicionar os computadores que serão filhos da section
    document.querySelector('.items').appendChild(createProductItemElement(newComputerObject));
  });
}
window.onload = async function onload() { 
  // acima tenho os computadore que busca achou!
  await getComputer();
  };
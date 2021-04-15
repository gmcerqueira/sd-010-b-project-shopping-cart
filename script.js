window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const customElement = document.createElement(element);
  customElement.className = className;
  customElement.innerText = innerText;
  return customElement;
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

const fetchComputers =
  (computerName) => fetch (`https://api.mercadolibre.com/sites/MLB/search?q=${computerName}`)
    .then((response) => response.json())
    .then((computers) => {
      createProductItemElement(computers[0]);
  });

const getComputers = async () => {
  try {
    await fetchComputers("computador");
  } catch (error) {
    alert('Ocorreu um erro ao buscar os dados');
  }
}
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id: sku, title: name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

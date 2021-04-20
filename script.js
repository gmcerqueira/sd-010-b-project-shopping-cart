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

async function searchItem(item) {
  const sectionItens = document.querySelector('.items');
  try {
    const a = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
    const b = await a.json();
    console.log(b.results);
    b.results.forEach((value) => {
      const { id: sku, title: name, thumbnail: image } = value;
      sectionItens.appendChild(createProductItemElement({ sku, name, image }));
    });
  } catch (erro) {
    console.log(erro);
  }
}

window.onload = function onload() {
  searchItem('computador');
};

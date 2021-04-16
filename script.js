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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* const add = (mercados) => {
  const deconstruct = mercados.results;
  const items = document.querySelector('.items');
  deconstruct.forEach((element) => {
  items.appendChild(createProductItemElement(element));
  });
}; */

const localS = () => {
  const aux = document.querySelector('ol');
  localStorage.setItem('keyss', aux.innerText);
};

const addLi = (li) => {
  const constOl = document.querySelector('ol');
  constOl.appendChild(li);
  localS();
};

const getId = (event) => {
  const Id = event.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${Id}`)
    .then((response) => {
      response.json()
      .then((list) => {
        const li = createCartItemElement(list);
        addLi(li);
      });
    });
  console.log(Id);
};

const newCart = () => {
  const consButton = document.querySelectorAll('.item__add');
  consButton.forEach((event) => {
    event.addEventListener('click', () => {
      getId(event);
    });
  });
};

const getPc = async ($QUERY) => {
 fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
  .then((response) => {
    response.json()
      .then((mercados) => {
          document.querySelector('.loading').remove();
          const deconstruct = mercados.results;
          const items = document.querySelector('.items');
          deconstruct.forEach((element) => {
          items.appendChild(createProductItemElement(element));
        });
        newCart();
      });
  });
};

const clear = () => {
  const consClear = document.querySelector('.empty-cart');
  consClear.addEventListener('click', () => {
    const cleando = document.querySelector('.cart__items');
    cleando.innerHTML = '';
    localStorage.clear();
  });
};

const recoverStorage = () => {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  if (localStorage.getItem('keyss')) {
    console.log(localStorage.length);
    li.innerText = localStorage.keyss;
    ol.appendChild(li);
  }
};

window.onload = async function onload() {
  getPc('computador');
  clear();
  recoverStorage();
};

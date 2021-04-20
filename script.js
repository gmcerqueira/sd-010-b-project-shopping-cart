async function getComputer(api) {
  const response = await fetch(api);
  const computer = await response.json();
  return computer;
} 

let carrinho = [];

async function getProduct(id) {
 await fetch(`https://api.mercadolibre.com/items/${id}`).then((res) => res.json());
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const soma = () => {
  const sum = carrinho.reduce((acc, curr) => acc + curr.price, 0);
  document.getElementById('sum').innerText = sum;
};

function cartItemClickListener(event) {
  const pegarId = event.target.id;
  event.target.remove();
  carrinho.forEach((elementId, index) => {
    if (pegarId === elementId.id) {
      carrinho.splice(index, 1);
      localStorage.setItem('computers', JSON.stringify(carrinho));
    }
    soma(); 
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function recoverList() {
  const ol = document.getElementsByTagName('ol')[0];
  carrinho.forEach((lIts) => {
    const lCar = createCartItemElement({ sku: lIts.id, name: lIts.title, salePrice: lIts.price });
    ol.appendChild(lCar);
  });
}

function renderComputer(computers) {
  const elements = document.getElementsByClassName('items')[0];
  const ol = document.getElementsByTagName('ol')[0];
  computers.results.forEach((its) => {
    const iten = createProductItemElement({ sku: its.id, name: its.title, image: its.thumbnail });
    elements.appendChild(iten);
    iten.lastChild.addEventListener('click', () => {
      const buy = carrinho.find((produto) => produto.id === its.id);
      if (!buy) {
        carrinho.push(its);
      const list = createCartItemElement({ sku: its.id, name: its.title, salePrice: its.price });
      localStorage.setItem('computers', JSON.stringify(carrinho));
      ol.appendChild(list);
      soma();
      }
    });
  });
}

window.onload = async function onload() { 
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const catalog = await getComputer(api);
  console.log(catalog.results);
  renderComputer(catalog);
  const loading = document.getElementsByTagName('p')[0];
  loading.remove();
  const carrinhoCheio = localStorage.getItem('computers');   
  carrinho = carrinhoCheio ? JSON.parse(carrinhoCheio) : [];
  recoverList();
  soma();
};

// const fetch = require('node-fetch');
const puxarCartItem = () => document.querySelectorAll('.cart__item');

const valorTotal = async () => {
  let total = 0;
  const items = puxarCartItem();
  await items.forEach((item) => {
    total += parseFloat(item.innerHTML.split('PRICE: $')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
};

let cartStorage = [];

const updateLocalStorage = () => {
  const cartStorageArray = [...cartStorage];
  for (let i = 0; i < cartStorageArray.length; i += 1) {
    cartStorageArray[i] = cartStorageArray[i].innerHTML;
  }
  localStorage.setItem('Cart', cartStorageArray);
  valorTotal();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// exported clarCart
function clearCart() {
  puxarCartItem().forEach((element) => {
    element.remove();
  });
  updateLocalStorage();
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
  
  function cartItemClickListener(event) {
    event.path[0].remove();
    cartStorage = puxarCartItem();
    updateLocalStorage();
  }
  
  const renderLocalStorage = () => {
    const localString = localStorage.getItem('Cart');
    if (localString !== null && localString !== '') {
      const localArray = localString.split(',');
      localArray.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerHTML = item;
        li.addEventListener('click', cartItemClickListener);
        document.querySelector('.cart__items').appendChild(li);
      });
    }
    valorTotal();
  };
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }
  
  //  2
  const requisicao = (elementoEmQuestao) => {
    const itemEmQuestao = elementoEmQuestao.path[1].firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${itemEmQuestao}`)
    .then((response) => response.json())
    .then((objetoBruto) => {
      const objetoFino = {
        sku: objetoBruto.id,
        name: objetoBruto.title,
        salePrice: objetoBruto.price,
      };
      const cartItemLi = createCartItemElement(objetoFino);
      document.querySelector('.cart__items').appendChild(cartItemLi);
      cartStorage = puxarCartItem();
      updateLocalStorage();
    });
  };
  
  //  1
  const fetchProduct = (QUERY) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((response) => response.json())
    .then((products) => {
      products.results.forEach((produto) => {
        const cadaProduto = {
          sku: produto.id,
          name: produto.title,
          image: produto.thumbnail,
        };
        const elemento = createProductItemElement(cadaProduto);
        document.querySelector('.items').appendChild(elemento);
        elemento.querySelector('.item__add').addEventListener('click', requisicao);
      });
    });
  };
    
  window.onload = function onload() { 
    renderLocalStorage();
    fetchProduct('computador');
  };